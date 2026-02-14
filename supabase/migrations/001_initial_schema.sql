-- Nagomi Hub: 初期スキーマ
-- profiles, user_settings, pomodoro_sessions, achievements, user_achievements, spirits, user_spirits

-- =============================================================================
-- 1. profiles テーブル（auth.usersと1:1連携）
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  total_xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 新規ユーザー登録時に自動でprofileを作成するトリガー
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 2. user_settings テーブル
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  theme TEXT NOT NULL DEFAULT 'light',
  bgm_volume INTEGER NOT NULL DEFAULT 60 CHECK (bgm_volume BETWEEN 0 AND 100),
  master_volume INTEGER NOT NULL DEFAULT 70 CHECK (master_volume BETWEEN 0 AND 100),
  ambient_rain INTEGER NOT NULL DEFAULT 50 CHECK (ambient_rain BETWEEN 0 AND 100),
  ambient_forest INTEGER NOT NULL DEFAULT 30 CHECK (ambient_forest BETWEEN 0 AND 100),
  ambient_ocean INTEGER NOT NULL DEFAULT 40 CHECK (ambient_ocean BETWEEN 0 AND 100),
  ambient_fire INTEGER NOT NULL DEFAULT 35 CHECK (ambient_fire BETWEEN 0 AND 100),
  pomodoro_work_minutes INTEGER NOT NULL DEFAULT 25,
  pomodoro_break_minutes INTEGER NOT NULL DEFAULT 5,
  pomodoro_long_break_minutes INTEGER NOT NULL DEFAULT 15,
  pomodoro_sessions_before_long_break INTEGER NOT NULL DEFAULT 4,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 3. pomodoro_sessions テーブル
-- =============================================================================
CREATE TYPE public.session_type AS ENUM ('work', 'short_break', 'long_break');
CREATE TYPE public.session_status AS ENUM ('active', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS public.pomodoro_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_type public.session_type NOT NULL DEFAULT 'work',
  status public.session_status NOT NULL DEFAULT 'active',
  duration_minutes INTEGER NOT NULL DEFAULT 25,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  server_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  xp_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pomodoro_sessions_user_id ON public.pomodoro_sessions(user_id);
CREATE INDEX idx_pomodoro_sessions_started_at ON public.pomodoro_sessions(started_at);

-- =============================================================================
-- 4. achievements テーブル（マスターデータ）
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL DEFAULT 1,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 5. user_achievements テーブル
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  unlocked BOOLEAN NOT NULL DEFAULT false,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);

-- =============================================================================
-- 6. spirits テーブル（マスターデータ — M3用先行定義）
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.spirits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'legendary')),
  sprite_url TEXT,
  appear_condition JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 7. user_spirits テーブル（M3用先行定義）
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_spirits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  spirit_id TEXT NOT NULL REFERENCES public.spirits(id) ON DELETE CASCADE,
  obtained_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, spirit_id)
);

CREATE INDEX idx_user_spirits_user_id ON public.user_spirits(user_id);

-- =============================================================================
-- 8. updated_at 自動更新トリガー
-- =============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_user_achievements_updated_at
  BEFORE UPDATE ON public.user_achievements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================================================
-- 9. RLS（Row Level Security）ポリシー
-- =============================================================================

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- pomodoro_sessions
ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON public.pomodoro_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.pomodoro_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON public.pomodoro_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- achievements (マスターデータ: 全ユーザー読み取り可)
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
  ON public.achievements FOR SELECT
  USING (true);

-- user_achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON public.user_achievements FOR UPDATE
  USING (auth.uid() = user_id);

-- spirits (マスターデータ: 全ユーザー読み取り可)
ALTER TABLE public.spirits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view spirits"
  ON public.spirits FOR SELECT
  USING (true);

-- user_spirits
ALTER TABLE public.user_spirits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own spirits"
  ON public.user_spirits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spirits"
  ON public.user_spirits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own spirits"
  ON public.user_spirits FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================================================
-- 10. 初期実績データ投入
-- =============================================================================
INSERT INTO public.achievements (id, title, description, icon, category, condition_type, condition_value, xp_reward) VALUES
  ('first_session', '初めてのセッション', '最初のポモドーロセッションを完了', '🎯', 'session', 'total_sessions', 1, 50),
  ('streak_7', '継続の力', '7日連続でセッションを完了', '🔥', 'streak', 'consecutive_days', 7, 200),
  ('master_100', 'マスター', '100回のセッションを完了', '👑', 'session', 'total_sessions', 100, 1000),
  ('night_owl', '夜更かし', '深夜にセッションを完了', '🌙', 'time', 'session_after_midnight', 1, 100),
  ('early_bird', '早起き', '朝6時前にセッションを完了', '🌅', 'time', 'session_before_6am', 1, 100),
  ('focus_master', '集中の達人', '1日で10セッションを完了', '⚡', 'session', 'daily_sessions', 10, 500),
  ('sound_explorer', '環境音マスター', 'すべての環境音を試す', '🎵', 'exploration', 'unique_sounds_used', 4, 150),
  ('customizer', 'カスタマイズ好き', 'すべての背景とキャラクターを試す', '🎨', 'exploration', 'unique_themes_used', 8, 150)
ON CONFLICT (id) DO NOTHING;

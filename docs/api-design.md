# Nagomi Hub — API設計

## 概要

Supabase Client SDKを使用し、クライアントから直接DBにアクセスする。
RLSにより認可を制御するため、バックエンドAPIサーバーは不要。
複雑なロジックが必要な場合は Supabase Edge Functions を使用する。

## データアクセスパターン

### 認証

| 操作           | メソッド                                                |
| -------------- | ------------------------------------------------------- |
| メール登録     | `supabase.auth.signUp({ email, password })`             |
| メールログイン | `supabase.auth.signInWithPassword({ email, password })` |
| OAuthログイン  | `supabase.auth.signInWithOAuth({ provider })`           |
| ログアウト     | `supabase.auth.signOut()`                               |
| セッション取得 | `supabase.auth.getSession()`                            |
| ユーザー取得   | `supabase.auth.getUser()`                               |

### プロフィール

| 操作 | クエリ                                                                            |
| ---- | --------------------------------------------------------------------------------- |
| 取得 | `supabase.from('profiles').select('*').eq('id', userId).single()`                 |
| 更新 | `supabase.from('profiles').update({ display_name, avatar_url }).eq('id', userId)` |

### ユーザー設定

| 操作   | クエリ                                                                         |
| ------ | ------------------------------------------------------------------------------ |
| 取得   | `supabase.from('user_settings').select('*').eq('user_id', userId).single()`    |
| 作成   | `supabase.from('user_settings').insert({ user_id, ...settings })`              |
| 更新   | `supabase.from('user_settings').update({ ...settings }).eq('user_id', userId)` |
| Upsert | `supabase.from('user_settings').upsert({ user_id, ...settings })`              |

### ポモドーロセッション

| 操作       | クエリ                                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| 開始       | `supabase.from('pomodoro_sessions').insert({ user_id, session_type, duration_minutes })`                         |
| 完了       | `supabase.from('pomodoro_sessions').update({ status: 'completed', ended_at, xp_earned }).eq('id', sessionId)`    |
| キャンセル | `supabase.from('pomodoro_sessions').update({ status: 'cancelled', ended_at }).eq('id', sessionId)`               |
| 履歴取得   | `supabase.from('pomodoro_sessions').select('*').eq('user_id', userId).order('started_at', { ascending: false })` |
| 日別集計   | `supabase.rpc('get_daily_stats', { p_user_id, p_date })`                                                         |

### 実績

| 操作         | クエリ                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| マスター一覧 | `supabase.from('achievements').select('*')`                                                               |
| ユーザー実績 | `supabase.from('user_achievements').select('*, achievements(*)').eq('user_id', userId)`                   |
| 進捗更新     | `supabase.from('user_achievements').upsert({ user_id, achievement_id, progress, unlocked, unlocked_at })` |

### 精霊 (M3)

| 操作         | クエリ                                                                        |
| ------------ | ----------------------------------------------------------------------------- |
| マスター一覧 | `supabase.from('spirits').select('*')`                                        |
| コレクション | `supabase.from('user_spirits').select('*, spirits(*)').eq('user_id', userId)` |
| 獲得         | `supabase.from('user_spirits').insert({ user_id, spirit_id })`                |

## 将来的なEdge Functions (必要に応じて)

| エンドポイント                          | 用途                                                                               |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| `POST /functions/v1/complete-session`   | セッション完了時のXP計算、実績チェック、レベルアップ判定をサーバーサイドで一括処理 |
| `POST /functions/v1/check-spirit-spawn` | 精霊出現判定（不正防止のためサーバーサイドで計算）                                 |

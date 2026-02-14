import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export interface UserSettings {
  theme: string
  bgm_volume: number
  master_volume: number
  ambient_rain: number
  ambient_forest: number
  ambient_ocean: number
  ambient_fire: number
  pomodoro_work_minutes: number
  pomodoro_break_minutes: number
  pomodoro_long_break_minutes: number
  pomodoro_sessions_before_long_break: number
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  bgm_volume: 60,
  master_volume: 70,
  ambient_rain: 50,
  ambient_forest: 30,
  ambient_ocean: 40,
  ambient_fire: 35,
  pomodoro_work_minutes: 25,
  pomodoro_break_minutes: 5,
  pomodoro_long_break_minutes: 15,
  pomodoro_sessions_before_long_break: 4,
}

export async function getUserSettings(userId: string): Promise<UserSettings> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !data) return DEFAULT_SETTINGS

  return {
    theme: data.theme,
    bgm_volume: data.bgm_volume,
    master_volume: data.master_volume,
    ambient_rain: data.ambient_rain,
    ambient_forest: data.ambient_forest,
    ambient_ocean: data.ambient_ocean,
    ambient_fire: data.ambient_fire,
    pomodoro_work_minutes: data.pomodoro_work_minutes,
    pomodoro_break_minutes: data.pomodoro_break_minutes,
    pomodoro_long_break_minutes: data.pomodoro_long_break_minutes,
    pomodoro_sessions_before_long_break: data.pomodoro_sessions_before_long_break,
  }
}

export async function saveUserSettings(userId: string, settings: Partial<UserSettings>) {
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({ user_id: userId, ...settings }, { onConflict: 'user_id' })
    .select()
    .single()

  return { data, error }
}

export { DEFAULT_SETTINGS }

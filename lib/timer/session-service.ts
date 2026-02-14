import { createClient } from '@/lib/supabase/client'
import type { SessionType } from '@/lib/timer/use-timer'

const supabase = createClient()

type DbSessionType = 'work' | 'short_break' | 'long_break'

export async function startSession(
  userId: string,
  sessionType: SessionType,
  durationMinutes: number
) {
  const { data, error } = await supabase
    .from('pomodoro_sessions')
    .insert({
      user_id: userId,
      session_type: sessionType as DbSessionType,
      duration_minutes: durationMinutes,
      status: 'active',
    })
    .select()
    .single()

  return { data, error }
}

export async function completeSession(sessionId: string, xpEarned: number) {
  const { data, error } = await supabase
    .from('pomodoro_sessions')
    .update({
      status: 'completed',
      ended_at: new Date().toISOString(),
      xp_earned: xpEarned,
    })
    .eq('id', sessionId)
    .select()
    .single()

  return { data, error }
}

export async function cancelSession(sessionId: string) {
  const { data, error } = await supabase
    .from('pomodoro_sessions')
    .update({
      status: 'cancelled',
      ended_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .select()
    .single()

  return { data, error }
}

export async function getUserStats(userId: string) {
  const { data: sessions, error } = await supabase
    .from('pomodoro_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .eq('session_type', 'work')
    .order('started_at', { ascending: false })

  if (error) return { stats: null, error }

  const totalSessions = sessions?.length ?? 0
  const totalMinutes = sessions?.reduce((sum, s) => sum + (s.duration_minutes ?? 0), 0) ?? 0
  const totalXp = sessions?.reduce((sum, s) => sum + (s.xp_earned ?? 0), 0) ?? 0

  return {
    stats: {
      totalSessions,
      totalMinutes,
      totalHours: Math.floor(totalMinutes / 60),
      totalRemainingMinutes: totalMinutes % 60,
      totalXp,
    },
    error: null,
  }
}

/** XP計算: 作業セッション完了時 */
export function calculateXp(durationMinutes: number): number {
  // 基本: 1分あたり2XP
  return durationMinutes * 2
}

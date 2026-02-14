import { createClient } from '@/lib/supabase/client'

import { getUnsyncedSessions, markSessionSynced, clearSyncedSessions } from './local-store'

/** オンライン復帰時にローカルのpendingセッションをSupabaseに同期 */
export async function syncPendingSessions() {
  if (!navigator.onLine) return { synced: 0 }

  const supabase = createClient()
  const unsynced = await getUnsyncedSessions()

  let synced = 0
  for (const session of unsynced) {
    const { error } = await supabase.from('pomodoro_sessions').upsert(
      {
        id: session.id,
        user_id: session.userId,
        session_type: session.sessionType,
        duration_minutes: session.durationMinutes,
        started_at: session.startedAt,
        ended_at: session.endedAt,
        status: session.status,
        xp_earned: session.xpEarned ?? 0,
      },
      { onConflict: 'id' }
    )

    if (!error) {
      await markSessionSynced(session.id)
      synced++
    }
  }

  await clearSyncedSessions()
  return { synced }
}

/** オンライン復帰イベントをリッスンして自動同期 */
export function setupAutoSync() {
  if (typeof window === 'undefined') return

  window.addEventListener('online', () => {
    syncPendingSessions()
  })
}

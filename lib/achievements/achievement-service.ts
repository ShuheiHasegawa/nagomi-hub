import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: string
  condition_type: string
  condition_value: number
  xp_reward: number
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  progress: number
  unlocked: boolean
  unlocked_at: string | null
  achievement: Achievement
}

/** 全実績マスター取得 */
export async function getAllAchievements(): Promise<Achievement[]> {
  const { data, error } = await supabase.from('achievements').select('*')

  if (error || !data) return []
  return data as Achievement[]
}

/** ユーザーの実績進捗取得 */
export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*, achievement:achievements(*)')
    .eq('user_id', userId)

  if (error || !data) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({
    ...row,
    achievement: row.achievement,
  }))
}

/** 実績進捗を更新し、条件達成時にアンロック */
export async function updateAchievementProgress(
  userId: string,
  achievementId: string,
  progress: number
): Promise<{ unlocked: boolean; xpReward: number }> {
  // 実績マスター取得
  const { data: achievement } = await supabase
    .from('achievements')
    .select('*')
    .eq('id', achievementId)
    .single()

  if (!achievement) return { unlocked: false, xpReward: 0 }

  const unlocked = progress >= achievement.condition_value
  const unlocked_at = unlocked ? new Date().toISOString() : null

  await supabase.from('user_achievements').upsert(
    {
      user_id: userId,
      achievement_id: achievementId,
      progress,
      unlocked,
      unlocked_at,
    },
    { onConflict: 'user_id,achievement_id' }
  )

  return {
    unlocked,
    xpReward: unlocked ? achievement.xp_reward : 0,
  }
}

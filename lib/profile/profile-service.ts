import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  level: number
  total_xp: number
}

/** レベルアップに必要なXP (レベルが上がるほど多くなる) */
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

/** 現在のXPからレベルと次レベルまでの進捗を計算 */
export function calculateLevel(totalXp: number): {
  level: number
  currentLevelXp: number
  nextLevelXp: number
} {
  let level = 1
  let xpAccumulated = 0

  while (true) {
    const required = xpForLevel(level)
    if (xpAccumulated + required > totalXp) {
      return {
        level,
        currentLevelXp: totalXp - xpAccumulated,
        nextLevelXp: required,
      }
    }
    xpAccumulated += required
    level++
  }
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data as Profile
}

export async function addXp(userId: string, xpAmount: number) {
  const profile = await getProfile(userId)
  if (!profile) return { error: 'Profile not found' }

  const newTotalXp = profile.total_xp + xpAmount
  const { level } = calculateLevel(newTotalXp)

  const { error } = await supabase
    .from('profiles')
    .update({ total_xp: newTotalXp, level })
    .eq('id', userId)

  return { error, newTotalXp, level, leveledUp: level > profile.level }
}

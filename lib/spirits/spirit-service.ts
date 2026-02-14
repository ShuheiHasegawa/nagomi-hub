import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export interface Spirit {
  id: string
  name: string
  description: string | null
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
  sprite_url: string | null
  appear_condition: AppearCondition | null
}

export interface AppearCondition {
  theme?: string[]
  ambient?: string
  all_ambient?: boolean
  min_minutes?: number
  total_hours?: number
  time_range?: [number, number]
}

export interface UserSpirit {
  id: string
  user_id: string
  spirit_id: string
  obtained_at: string
  is_favorite: boolean
  spirit: Spirit
}

/** 全精霊マスター取得 */
export async function getAllSpirits(): Promise<Spirit[]> {
  const { data } = await supabase.from('spirits').select('*')
  return (data as Spirit[]) ?? []
}

/** ユーザーの収集済み精霊 */
export async function getUserSpirits(userId: string): Promise<UserSpirit[]> {
  const { data } = await supabase
    .from('user_spirits')
    .select('*, spirit:spirits(*)')
    .eq('user_id', userId)

  if (!data) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({ ...row, spirit: row.spirit }))
}

/** 精霊を獲得 */
export async function obtainSpirit(userId: string, spiritId: string) {
  const { data, error } = await supabase
    .from('user_spirits')
    .upsert({ user_id: userId, spirit_id: spiritId }, { onConflict: 'user_id,spirit_id' })
    .select()
    .single()

  return { data, error }
}

/** お気に入り切替 */
export async function toggleFavorite(userId: string, spiritId: string, isFavorite: boolean) {
  const { error } = await supabase
    .from('user_spirits')
    .update({ is_favorite: isFavorite })
    .eq('user_id', userId)
    .eq('spirit_id', spiritId)

  return { error }
}

const RARITY_WEIGHTS = { common: 0.5, uncommon: 0.3, rare: 0.15, legendary: 0.05 }

export interface SessionContext {
  theme: string
  activeAmbient: string[]
  minutesWorked: number
  totalHoursAllTime: number
}

/** セッション文脈から出現可能な精霊を判定 */
export function getEligibleSpirits(spirits: Spirit[], ctx: SessionContext): Spirit[] {
  const hour = new Date().getHours()

  return spirits.filter((s) => {
    const cond = s.appear_condition
    if (!cond) return true

    if (cond.theme && !cond.theme.includes(ctx.theme)) return false
    if (cond.ambient && !ctx.activeAmbient.includes(cond.ambient)) return false
    if (cond.all_ambient && ctx.activeAmbient.length < 4) return false
    if (cond.min_minutes && ctx.minutesWorked < cond.min_minutes) return false
    if (cond.total_hours && ctx.totalHoursAllTime < cond.total_hours) return false

    if (cond.time_range) {
      const [start, end] = cond.time_range
      if (start < end) {
        if (hour < start || hour >= end) return false
      } else {
        // 22-4 のような深夜帯
        if (hour < start && hour >= end) return false
      }
    }

    return true
  })
}

/** 出現精霊をランダム抽選 (レアリティ加重) */
export function rollSpirit(eligible: Spirit[]): Spirit | null {
  if (eligible.length === 0) return null

  const weighted = eligible.map((s) => ({
    spirit: s,
    weight: RARITY_WEIGHTS[s.rarity],
  }))

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0)
  let random = Math.random() * totalWeight

  for (const w of weighted) {
    random -= w.weight
    if (random <= 0) return w.spirit
  }

  return weighted[0].spirit
}

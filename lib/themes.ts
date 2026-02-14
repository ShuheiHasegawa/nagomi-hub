// カスタムテーマ定義（globals.cssで定義されたテーマのみ）
export const themes = [
  { value: 'light', label: 'ライト', icon: '☀️' },
  { value: 'dark', label: 'ダーク', icon: '🌙' },
  { value: 'komorebi', label: '木漏れ日', icon: '🍃' },
  { value: 'ocean', label: '海', icon: '🌊' },
  { value: 'cupcake', label: 'カップケーキ', icon: '🧁' },
  { value: 'forest', label: '森', icon: '🌲' },
  { value: 'emerald', label: 'エメラルド', icon: '💚' },
  { value: 'night', label: '夜', icon: '✨' },
  { value: 'sunset', label: '夕焼け', icon: '🌅' },
] as const

export type Theme = (typeof themes)[number]['value']

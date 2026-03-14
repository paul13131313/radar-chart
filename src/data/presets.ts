export interface PresetData {
  name: string
  emoji: string
  labels: string[]
  values: number[]
}

export const presets: PresetData[] = [
  {
    name: '栄養成分',
    emoji: '🥗',
    labels: ['タンパク質', '脂質', '炭水化物', 'ビタミン', 'ミネラル', '食物繊維'],
    values: [70, 40, 80, 60, 55, 45],
  },
  {
    name: 'キャラ能力値',
    emoji: '⚔️',
    labels: ['攻撃', '防御', '素早さ', '魔法', '運', '体力'],
    values: [85, 60, 75, 90, 50, 65],
  },
  {
    name: '人物スキル',
    emoji: '💼',
    labels: ['企画', '表現', '技術', 'コミュ', '行動', '分析'],
    values: [80, 70, 55, 85, 75, 60],
  },
  {
    name: '都市比較',
    emoji: '🏙️',
    labels: ['住みやすさ', '交通', 'エンタメ', '自然', '食文化', '安全'],
    values: [75, 90, 85, 40, 80, 70],
  },
  {
    name: '食品比較',
    emoji: '🍎',
    labels: ['タンパク', '脂質', '糖質', '食物繊維', 'ビタミン', 'ミネラル'],
    values: [60, 30, 70, 50, 80, 65],
  },
]

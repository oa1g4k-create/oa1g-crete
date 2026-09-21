export type Mood = 'great' | 'good' | 'okay' | 'tired' | 'bad'

export const MOOD_OPTIONS: { value: Mood; emoji: string; label: string }[] = [
  { value: 'great', emoji: '😄', label: '最高' },
  { value: 'good', emoji: '🙂', label: '良い' },
  { value: 'okay', emoji: '😐', label: 'ふつう' },
  { value: 'tired', emoji: '😪', label: '疲れた' },
  { value: 'bad', emoji: '😞', label: 'しんどい' },
]

export interface Skill {
  id: string
  name: string
  createdAt: string
  /** 直近の自己評価 1-5 */
  currentLevel: number
}

export interface SkillCheck {
  skillId: string
  level: number
}

export interface Goal {
  id: string
  title: string
  createdAt: string
  /** 0-100 */
  progress: number
  archived: boolean
  targetDate?: string
}

export interface NextAction {
  id: string
  text: string
  done: boolean
  createdAt: string
  /** どの振り返りから生まれたか */
  fromEntryId?: string
  goalId?: string
}

export interface JournalEntry {
  id: string
  date: string // YYYY-MM-DD
  createdAt: string
  mood: Mood
  /** 短い一言でOKにするための3問だけのプロンプト */
  win: string
  challenge: string
  gratitude: string
  skillChecks: SkillCheck[]
  goalUpdates: { goalId: string; progress: number }[]
  nextActionText?: string
}

export interface AppState {
  entries: JournalEntry[]
  skills: Skill[]
  goals: Goal[]
  nextActions: NextAction[]
}

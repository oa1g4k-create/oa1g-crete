import type { JournalEntry } from '../types/models'
import { todayISO } from './id'

export function findTodayEntry(entries: JournalEntry[]): JournalEntry | undefined {
  const today = todayISO()
  return entries.find((e) => e.date === today)
}

/** 連続で振り返りを書いた日数（今日を含む） */
export function computeStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0
  const dates = new Set(entries.map((e) => e.date))
  let streak = 0
  const cursor = new Date()
  // 今日書いていなければ、昨日までの連続日数を数える
  if (!dates.has(todayISO())) {
    cursor.setDate(cursor.getDate() - 1)
  }
  for (;;) {
    const iso = cursor.toISOString().slice(0, 10)
    if (!dates.has(iso)) break
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function formatDateJP(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('ja-JP', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

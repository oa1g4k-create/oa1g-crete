import { useState } from 'react'
import { MOOD_OPTIONS } from '../types/models'
import { computeStreak, formatDateJP } from '../lib/selectors'
import { useApp } from '../store/AppContext'

function moodEmoji(mood: string) {
  return MOOD_OPTIONS.find((m) => m.value === mood)?.emoji ?? '🙂'
}

export function HistoryPage() {
  const { state, toggleNextAction, deleteNextAction, deleteEntry } = useApp()
  const streak = computeStreak(state.entries)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const pendingActions = state.nextActions.filter((a) => !a.done)
  const doneActions = state.nextActions.filter((a) => a.done)

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div className="rounded-2xl border border-teal-400/30 bg-teal-400/5 p-4 text-center">
        <p className="text-sm text-slate-300">連続振り返り</p>
        <p className="mt-1 text-2xl font-bold text-teal-300">🔥 {streak} 日</p>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-300">ネクストアクション</h2>
        <div className="flex flex-col gap-2">
          {pendingActions.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-700 p-3 text-center text-xs text-slate-500">
              振り返りの最後に「明日の一歩」を決めると、ここに表示されます
            </p>
          )}
          {pendingActions.map((action) => (
            <label
              key={action.id}
              className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2"
            >
              <input
                type="checkbox"
                checked={action.done}
                onChange={() => toggleNextAction(action.id)}
                className="h-4 w-4 accent-teal-400"
              />
              <span className="flex-1 text-sm text-slate-100">{action.text}</span>
              <button
                type="button"
                onClick={() => deleteNextAction(action.id)}
                className="text-xs text-slate-500 hover:text-red-400"
              >
                削除
              </button>
            </label>
          ))}
          {doneActions.slice(0, 5).map((action) => (
            <label
              key={action.id}
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 opacity-60"
            >
              <input
                type="checkbox"
                checked={action.done}
                onChange={() => toggleNextAction(action.id)}
                className="h-4 w-4 accent-teal-400"
              />
              <span className="flex-1 text-sm text-slate-400 line-through">{action.text}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-300">これまでの振り返り</h2>
        <div className="flex flex-col gap-2">
          {state.entries.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-700 p-4 text-center text-sm text-slate-500">
              まだ記録がありません。今日の振り返りから始めましょう。
            </p>
          )}
          {state.entries.map((entry) => {
            const expanded = expandedId === entry.id
            return (
              <div
                key={entry.id}
                className="rounded-xl border border-slate-700 bg-slate-800/50 p-3"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : entry.id)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{moodEmoji(entry.mood)}</span>
                    <span className="text-sm text-slate-200">{formatDateJP(entry.date)}</span>
                  </span>
                  <span className="text-xs text-slate-500">{expanded ? '閉じる' : '詳細'}</span>
                </button>
                {expanded && (
                  <div className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
                    {entry.win && (
                      <p>
                        <span className="text-slate-500">できたこと：</span>
                        {entry.win}
                      </p>
                    )}
                    {entry.challenge && (
                      <p>
                        <span className="text-slate-500">つまずき：</span>
                        {entry.challenge}
                      </p>
                    )}
                    {entry.gratitude && (
                      <p>
                        <span className="text-slate-500">良かったこと：</span>
                        {entry.gratitude}
                      </p>
                    )}
                    {entry.nextActionText && (
                      <p>
                        <span className="text-slate-500">次の一歩：</span>
                        {entry.nextActionText}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteEntry(entry.id)}
                      className="mt-1 self-start text-xs text-slate-500 hover:text-red-400"
                    >
                      この記録を削除
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

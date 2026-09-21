import { useState } from 'react'
import { ProgressBar } from '../components/ProgressBar'
import { useApp } from '../store/AppContext'

export function GoalsPage() {
  const { state, addGoal, updateGoal, deleteGoal } = useApp()
  const [title, setTitle] = useState('')
  const active = state.goals.filter((g) => !g.archived)
  const archived = state.goals.filter((g) => g.archived)

  function handleAdd() {
    const trimmed = title.trim()
    if (!trimmed) return
    addGoal(trimmed)
    setTitle('')
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">目標</h2>
        <p className="mt-1 text-sm text-slate-400">
          達成度は毎日の振り返りでも更新できます
        </p>
      </div>

      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="新しい目標を追加（例：毎日30分読書）"
          className="flex-1 rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-xl bg-teal-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-teal-300"
        >
          追加
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {active.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-700 p-4 text-center text-sm text-slate-500">
            まだ目標がありません。ひとつ決めてみましょう。
          </p>
        )}
        {active.map((goal) => (
          <div key={goal.id} className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-slate-100">{goal.title}</p>
              <span className="shrink-0 text-sm font-semibold text-teal-300">
                {goal.progress}%
              </span>
            </div>
            <ProgressBar value={goal.progress} />
            <div className="mt-3 flex items-center justify-between">
              <input
                type="range"
                min={0}
                max={100}
                value={goal.progress}
                onChange={(e) => updateGoal(goal.id, { progress: Number(e.target.value) })}
                className="mr-3 w-full accent-teal-400"
              />
              <div className="flex shrink-0 gap-2">
                {goal.progress >= 100 ? (
                  <button
                    type="button"
                    onClick={() => updateGoal(goal.id, { archived: true })}
                    className="rounded-lg px-2 py-1 text-xs text-teal-300 hover:text-teal-200"
                  >
                    達成✓
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => deleteGoal(goal.id)}
                  className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:text-red-400"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {archived.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-400">達成済み</h3>
          <div className="flex flex-col gap-2">
            {archived.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm text-slate-500 line-through"
              >
                <span>{goal.title}</span>
                <button
                  type="button"
                  onClick={() => deleteGoal(goal.id)}
                  className="no-underline hover:text-red-400"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useApp } from '../store/AppContext'

export function SkillsPage() {
  const { state, addSkill, deleteSkill } = useApp()
  const [name, setName] = useState('')

  function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    addSkill(trimmed)
    setName('')
  }

  function historyFor(skillId: string) {
    return state.entries
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .flatMap((e) => e.skillChecks.filter((c) => c.skillId === skillId).map((c) => c.level))
      .slice(-10)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">スキル</h2>
        <p className="mt-1 text-sm text-slate-400">
          伸ばしたいスキルを登録すると、毎日の振り返りで手応えを記録できます
        </p>
      </div>

      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="新しいスキルを追加（例：プレゼン力）"
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
        {state.skills.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-700 p-4 text-center text-sm text-slate-500">
            まだスキルがありません。育てたいスキルを登録してみましょう。
          </p>
        )}
        {state.skills.map((skill) => {
          const history = historyFor(skill.id)
          return (
            <div key={skill.id} className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-100">{skill.name}</p>
                <button
                  type="button"
                  onClick={() => deleteSkill(skill.id)}
                  className="text-xs text-slate-500 hover:text-red-400"
                >
                  削除
                </button>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={`h-2.5 flex-1 rounded-full ${
                      skill.currentLevel >= n ? 'bg-teal-400' : 'bg-slate-700'
                    }`}
                  />
                ))}
                <span className="ml-2 text-xs font-semibold text-teal-300">
                  Lv.{skill.currentLevel}
                </span>
              </div>
              {history.length > 1 && (
                <div className="mt-3 flex items-end gap-1">
                  {history.map((level, i) => (
                    <div
                      key={i}
                      className="w-2 rounded-t bg-teal-400/60"
                      style={{ height: `${level * 5 + 4}px` }}
                      title={`${level}`}
                    />
                  ))}
                  <span className="ml-2 text-[11px] text-slate-500">直近の推移</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

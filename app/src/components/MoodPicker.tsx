import { MOOD_OPTIONS, type Mood } from '../types/models'

export function MoodPicker({
  value,
  onChange,
}: {
  value: Mood | null
  onChange: (mood: Mood) => void
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {MOOD_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex flex-col items-center gap-1 rounded-2xl border py-3 transition ${
            value === opt.value
              ? 'border-teal-400 bg-teal-400/10 shadow-[0_0_0_1px_rgba(45,212,191,0.4)]'
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
          }`}
        >
          <span className="text-2xl">{opt.emoji}</span>
          <span className="text-[11px] text-slate-300">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}

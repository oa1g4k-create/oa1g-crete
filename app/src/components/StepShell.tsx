import type { ReactNode } from 'react'

export function StepShell({
  step,
  total,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel = '次へ',
  nextDisabled = false,
  onSkip,
}: {
  step: number
  total: number
  title: string
  subtitle?: string
  children: ReactNode
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
  nextDisabled?: boolean
  onSkip?: () => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < step ? 'bg-teal-400' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>

      <div>{children}</div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={!onBack}
          className="rounded-xl px-3 py-2 text-sm text-slate-400 hover:text-slate-200 disabled:opacity-0"
        >
          戻る
        </button>
        <div className="flex items-center gap-2">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="rounded-xl px-3 py-2 text-sm text-slate-400 hover:text-slate-200"
            >
              スキップ
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="rounded-xl bg-teal-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

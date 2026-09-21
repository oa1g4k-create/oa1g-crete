import { useMemo, useState } from 'react'
import { MoodPicker } from '../components/MoodPicker'
import { StepShell } from '../components/StepShell'
import { computeStreak, findTodayEntry, formatDateJP } from '../lib/selectors'
import { todayISO } from '../lib/id'
import { useApp } from '../store/AppContext'
import type { Mood, SkillCheck } from '../types/models'

type StepId = 'mood' | 'win' | 'challenge' | 'gratitude' | 'skills' | 'goals' | 'action'

const QUICK_CHIPS = ['特になし', 'まあまあ', '小さく前進']

export function TodayPage() {
  const { state, addEntry, updateSkill, updateGoal, addNextAction } = useApp()
  const todayEntry = findTodayEntry(state.entries)
  const streak = computeStreak(state.entries)
  const activeGoals = state.goals.filter((g) => !g.archived)

  const steps = useMemo<StepId[]>(() => {
    const base: StepId[] = ['mood', 'win', 'challenge', 'gratitude']
    if (state.skills.length > 0) base.push('skills')
    if (activeGoals.length > 0) base.push('goals')
    base.push('action')
    return base
  }, [state.skills.length, activeGoals.length])

  const [stepIndex, setStepIndex] = useState(0)
  const [mood, setMood] = useState<Mood | null>(null)
  const [win, setWin] = useState('')
  const [challenge, setChallenge] = useState('')
  const [gratitude, setGratitude] = useState('')
  const [skillChecks, setSkillChecks] = useState<Record<string, number>>(() =>
    Object.fromEntries(state.skills.map((s) => [s.id, s.currentLevel])),
  )
  const [goalProgress, setGoalProgress] = useState<Record<string, number>>(() =>
    Object.fromEntries(activeGoals.map((g) => [g.id, g.progress])),
  )
  const [nextAction, setNextAction] = useState('')
  const [justFinished, setJustFinished] = useState(false)

  if (todayEntry && !justFinished) {
    return <TodayDoneCard streak={streak} />
  }

  if (justFinished) {
    return <TodayDoneCard streak={streak} celebrate />
  }

  const currentStep = steps[stepIndex]
  const isLast = stepIndex === steps.length - 1

  function goNext() {
    if (isLast) {
      finish()
      return
    }
    setStepIndex((i) => i + 1)
  }

  function goBack() {
    setStepIndex((i) => Math.max(0, i - 1))
  }

  function finish() {
    if (!mood) return
    const entry = addEntry({
      date: todayISO(),
      mood,
      win,
      challenge,
      gratitude,
      skillChecks: Object.entries(skillChecks).map(
        ([skillId, level]): SkillCheck => ({ skillId, level }),
      ),
      goalUpdates: Object.entries(goalProgress).map(([goalId, progress]) => ({
        goalId,
        progress,
      })),
      nextActionText: nextAction || undefined,
    })

    for (const [skillId, level] of Object.entries(skillChecks)) {
      updateSkill(skillId, { currentLevel: level })
    }
    for (const [goalId, progress] of Object.entries(goalProgress)) {
      updateGoal(goalId, { progress })
    }
    if (nextAction.trim()) {
      addNextAction(nextAction.trim(), { fromEntryId: entry.id })
    }
    setJustFinished(true)
  }

  return (
    <div className="mx-auto max-w-md">
      {currentStep === 'mood' && (
        <StepShell
          step={stepIndex + 1}
          total={steps.length}
          title="今日の気分は？"
          subtitle="ひとタップでOK"
          onNext={goNext}
          nextDisabled={!mood}
        >
          <MoodPicker value={mood} onChange={setMood} />
        </StepShell>
      )}

      {currentStep === 'win' && (
        <StepShell
          step={stepIndex + 1}
          total={steps.length}
          title="今日できたことは？"
          subtitle="小さなことでOK。書きたくなければチップを選んでね"
          onBack={goBack}
          onNext={goNext}
          onSkip={goNext}
        >
          <TextStep value={win} onChange={setWin} placeholder="例：朝ちゃんと起きた" />
        </StepShell>
      )}

      {currentStep === 'challenge' && (
        <StepShell
          step={stepIndex + 1}
          total={steps.length}
          title="つまずいたことは？"
          subtitle="なければスキップでOK"
          onBack={goBack}
          onNext={goNext}
          onSkip={goNext}
        >
          <TextStep
            value={challenge}
            onChange={setChallenge}
            placeholder="例：集中が続かなかった"
          />
        </StepShell>
      )}

      {currentStep === 'gratitude' && (
        <StepShell
          step={stepIndex + 1}
          total={steps.length}
          title="良かったこと・感謝したいことは？"
          onBack={goBack}
          onNext={goNext}
          onSkip={goNext}
        >
          <TextStep
            value={gratitude}
            onChange={setGratitude}
            placeholder="例：ランチが美味しかった"
          />
        </StepShell>
      )}

      {currentStep === 'skills' && (
        <StepShell
          step={stepIndex + 1}
          total={steps.length}
          title="スキルの手応えは？"
          subtitle="今日の感覚で1〜5をタップ"
          onBack={goBack}
          onNext={goNext}
          onSkip={goNext}
        >
          <div className="flex flex-col gap-3">
            {state.skills.map((skill) => (
              <div key={skill.id} className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                <p className="mb-2 text-sm font-medium text-slate-200">{skill.name}</p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() =>
                        setSkillChecks((prev) => ({ ...prev, [skill.id]: n }))
                      }
                      className={`h-8 flex-1 rounded-lg text-sm font-semibold transition ${
                        (skillChecks[skill.id] ?? 0) >= n
                          ? 'bg-teal-400 text-slate-900'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </StepShell>
      )}

      {currentStep === 'goals' && (
        <StepShell
          step={stepIndex + 1}
          total={steps.length}
          title="目標の達成度を更新"
          subtitle="今の進み具合にスライドしてね"
          onBack={goBack}
          onNext={goNext}
          onSkip={goNext}
        >
          <div className="flex flex-col gap-4">
            {activeGoals.map((goal) => (
              <div key={goal.id} className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-200">{goal.title}</p>
                  <span className="text-sm font-semibold text-teal-300">
                    {goalProgress[goal.id] ?? goal.progress}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={goalProgress[goal.id] ?? goal.progress}
                  onChange={(e) =>
                    setGoalProgress((prev) => ({
                      ...prev,
                      [goal.id]: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-teal-400"
                />
              </div>
            ))}
          </div>
        </StepShell>
      )}

      {currentStep === 'action' && (
        <StepShell
          step={stepIndex + 1}
          total={steps.length}
          title="明日の小さな一歩は？"
          subtitle="1つだけ、小さいアクションを決めよう"
          onBack={goBack}
          onNext={goNext}
          nextLabel="振り返りを完了"
        >
          <TextStep
            value={nextAction}
            onChange={setNextAction}
            placeholder="例：5分だけ手を付ける"
          />
        </StepShell>
      )}

      {stepIndex > 0 && currentStep !== 'skills' && currentStep !== 'goals' && (
        <QuickChips
          onPick={(text) => {
            if (currentStep === 'win') setWin(text)
            if (currentStep === 'challenge') setChallenge(text)
            if (currentStep === 'gratitude') setGratitude(text)
            if (currentStep === 'action') setNextAction(text)
          }}
        />
      )}
      <p className="mt-4 text-center text-xs text-slate-500">
        現在 {streak} 日連続で振り返り中
      </p>
    </div>
  )
}

function TextStep({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800/50 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400 focus:outline-none"
    />
  )
}

function QuickChips({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {QUICK_CHIPS.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onPick(chip)}
          className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400 hover:border-slate-500 hover:text-slate-200"
        >
          {chip}
        </button>
      ))}
    </div>
  )
}

function TodayDoneCard({ streak, celebrate }: { streak: number; celebrate?: boolean }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-teal-400/30 bg-teal-400/5 p-6 text-center">
      <p className="text-3xl">{celebrate ? '🎉' : '✅'}</p>
      <h2 className="mt-3 text-lg font-semibold text-slate-100">
        {celebrate ? '今日の振り返り、完了！' : '今日はもう振り返り済みです'}
      </h2>
      <p className="mt-1 text-sm text-slate-400">{formatDateJP(todayISO())}</p>
      <p className="mt-4 text-sm text-teal-300">
        🔥 連続 {streak} 日達成中！このまま続けよう
      </p>
    </div>
  )
}

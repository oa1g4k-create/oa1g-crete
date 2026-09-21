import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { makeId } from '../lib/id'
import type {
  AppState,
  Goal,
  JournalEntry,
  NextAction,
  Skill,
} from '../types/models'

const STORAGE_KEY = 'reflect-app:v1'

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { entries: [], skills: [], goals: [], nextActions: [] }
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      entries: parsed.entries ?? [],
      skills: parsed.skills ?? [],
      goals: parsed.goals ?? [],
      nextActions: parsed.nextActions ?? [],
    }
  } catch {
    return { entries: [], skills: [], goals: [], nextActions: [] }
  }
}

interface AppContextValue {
  state: AppState
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => JournalEntry
  updateEntry: (id: string, patch: Partial<JournalEntry>) => void
  deleteEntry: (id: string) => void

  addSkill: (name: string) => Skill
  updateSkill: (id: string, patch: Partial<Skill>) => void
  deleteSkill: (id: string) => void

  addGoal: (title: string, targetDate?: string) => Goal
  updateGoal: (id: string, patch: Partial<Goal>) => void
  deleteGoal: (id: string) => void

  addNextAction: (
    text: string,
    opts?: { fromEntryId?: string; goalId?: string },
  ) => NextAction
  toggleNextAction: (id: string) => void
  deleteNextAction: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo<AppContextValue>(() => {
    return {
      state,

      addEntry: (entry) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: makeId(),
          createdAt: new Date().toISOString(),
        }
        setState((s) => ({ ...s, entries: [newEntry, ...s.entries] }))
        return newEntry
      },
      updateEntry: (id, patch) => {
        setState((s) => ({
          ...s,
          entries: s.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }))
      },
      deleteEntry: (id) => {
        setState((s) => ({ ...s, entries: s.entries.filter((e) => e.id !== id) }))
      },

      addSkill: (name) => {
        const skill: Skill = {
          id: makeId(),
          name,
          createdAt: new Date().toISOString(),
          currentLevel: 3,
        }
        setState((s) => ({ ...s, skills: [...s.skills, skill] }))
        return skill
      },
      updateSkill: (id, patch) => {
        setState((s) => ({
          ...s,
          skills: s.skills.map((sk) => (sk.id === id ? { ...sk, ...patch } : sk)),
        }))
      },
      deleteSkill: (id) => {
        setState((s) => ({ ...s, skills: s.skills.filter((sk) => sk.id !== id) }))
      },

      addGoal: (title, targetDate) => {
        const goal: Goal = {
          id: makeId(),
          title,
          createdAt: new Date().toISOString(),
          progress: 0,
          archived: false,
          targetDate,
        }
        setState((s) => ({ ...s, goals: [...s.goals, goal] }))
        return goal
      },
      updateGoal: (id, patch) => {
        setState((s) => ({
          ...s,
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        }))
      },
      deleteGoal: (id) => {
        setState((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) }))
      },

      addNextAction: (text, opts) => {
        const action: NextAction = {
          id: makeId(),
          text,
          done: false,
          createdAt: new Date().toISOString(),
          fromEntryId: opts?.fromEntryId,
          goalId: opts?.goalId,
        }
        setState((s) => ({ ...s, nextActions: [action, ...s.nextActions] }))
        return action
      },
      toggleNextAction: (id) => {
        setState((s) => ({
          ...s,
          nextActions: s.nextActions.map((a) =>
            a.id === id ? { ...a, done: !a.done } : a,
          ),
        }))
      },
      deleteNextAction: (id) => {
        setState((s) => ({
          ...s,
          nextActions: s.nextActions.filter((a) => a.id !== id),
        }))
      },
    }
  }, [state])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

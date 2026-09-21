import { useState } from 'react'
import { GoalsPage } from './pages/GoalsPage'
import { HistoryPage } from './pages/HistoryPage'
import { SettingsPage } from './pages/SettingsPage'
import { SkillsPage } from './pages/SkillsPage'
import { TodayPage } from './pages/TodayPage'
import { AppProvider } from './store/AppContext'

type Tab = 'today' | 'history' | 'goals' | 'skills' | 'settings'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'today', label: '今日', icon: '📝' },
  { id: 'history', label: '記録', icon: '📅' },
  { id: 'goals', label: '目標', icon: '🎯' },
  { id: 'skills', label: 'スキル', icon: '💡' },
  { id: 'settings', label: '設定', icon: '⚙️' },
]

function AppShell() {
  const [tab, setTab] = useState<Tab>('today')

  return (
    <div className="flex min-h-screen flex-col bg-slate-900">
      <header className="border-b border-slate-800 px-4 py-4">
        <h1 className="mx-auto max-w-md text-base font-semibold tracking-tight text-slate-100">
          ふりかえり伴走
        </h1>
      </header>

      <main className="flex-1 px-4 py-6 pb-24">
        {tab === 'today' && <TodayPage />}
        {tab === 'history' && <HistoryPage />}
        {tab === 'goals' && <GoalsPage />}
        {tab === 'skills' && <SkillsPage />}
        {tab === 'settings' && <SettingsPage />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 border-t border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-stretch justify-between">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-xs transition ${
                tab === t.id ? 'text-teal-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}

export default App

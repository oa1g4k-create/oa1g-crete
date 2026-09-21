import { useEffect, useState } from 'react'
import {
  API_BASE_URL,
  fetchServerSettings,
  getCurrentSubscription,
  isIOS,
  isPushSupported,
  isStandalone,
  subscribeToPush,
  unsubscribeFromPush,
  updateReminderTime,
} from '../lib/push'

type Status = 'checking' | 'subscribed' | 'unsubscribed'

export function SettingsPage() {
  const [status, setStatus] = useState<Status>('checking')
  const [time, setTime] = useState('21:00')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      const [sub, serverSettings] = await Promise.all([
        getCurrentSubscription().catch(() => null),
        fetchServerSettings(),
      ])
      if (serverSettings?.time) setTime(serverSettings.time)
      setStatus(sub ? 'subscribed' : 'unsubscribed')
    })()
  }, [])

  const supported = isPushSupported()
  const needsHomeScreenInstall = isIOS() && !isStandalone()
  const configured = Boolean(API_BASE_URL)

  async function handleEnable() {
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      await subscribeToPush(time)
      setStatus('subscribed')
      setNotice('通知をオンにしました')
    } catch (e) {
      setError(e instanceof Error ? e.message : '通知の設定に失敗しました')
    } finally {
      setBusy(false)
    }
  }

  async function handleDisable() {
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      await unsubscribeFromPush()
      setStatus('unsubscribed')
      setNotice('通知をオフにしました')
    } catch (e) {
      setError(e instanceof Error ? e.message : '解除に失敗しました')
    } finally {
      setBusy(false)
    }
  }

  async function handleTimeChange(newTime: string) {
    setTime(newTime)
    if (status !== 'subscribed') return
    try {
      await updateReminderTime(newTime)
      setNotice('リマインダー時刻を更新しました')
    } catch (e) {
      setError(e instanceof Error ? e.message : '時刻の更新に失敗しました')
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">設定</h2>
        <p className="mt-1 text-sm text-slate-400">
          毎日決まった時刻に「そろそろ振り返りの時間です」という通知を届けます
        </p>
      </div>

      {!configured && (
        <Banner tone="warn">
          通知サーバー(VITE_API_BASE_URL)が未設定です。<code>app/.env</code>{' '}
          を設定してビルドし直してください。
        </Banner>
      )}

      {configured && !supported && (
        <Banner tone="warn">このブラウザはPush通知に対応していません。</Banner>
      )}

      {configured && supported && needsHomeScreenInstall && (
        <Banner tone="info">
          iPhoneで通知を受け取るには、まず共有メニューから
          <strong>「ホーム画面に追加」</strong>
          してアプリとして開いてください(Safariのタブのままでは通知を受け取れません)。
        </Banner>
      )}

      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
        <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="reminder-time">
          リマインダー時刻
        </label>
        <input
          id="reminder-time"
          type="time"
          value={time}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-teal-400 focus:outline-none"
        />

        <div className="mt-4">
          {status === 'checking' && <p className="text-sm text-slate-500">確認中…</p>}
          {status === 'unsubscribed' && (
            <button
              type="button"
              onClick={handleEnable}
              disabled={busy || !configured || !supported}
              className="w-full rounded-xl bg-teal-400 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {busy ? '設定中…' : '通知をオンにする'}
            </button>
          )}
          {status === 'subscribed' && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-teal-300">✓ 通知はオンになっています</p>
              <button
                type="button"
                onClick={handleDisable}
                disabled={busy}
                className="w-full rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-500"
              >
                {busy ? '解除中…' : '通知をオフにする'}
              </button>
            </div>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        {notice && !error && <p className="mt-3 text-sm text-teal-300">{notice}</p>}
      </div>

      <p className="text-xs text-slate-500">
        ホーム画面に追加すると、アプリのようにフルスクリーンで起動できます。
      </p>
    </div>
  )
}

function Banner({ tone, children }: { tone: 'info' | 'warn'; children: React.ReactNode }) {
  const cls =
    tone === 'warn'
      ? 'border-amber-400/30 bg-amber-400/5 text-amber-200'
      : 'border-teal-400/30 bg-teal-400/5 text-teal-100'
  return <div className={`rounded-xl border p-3 text-sm ${cls}`}>{children}</div>
}

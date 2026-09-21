export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined
export const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined

export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

/** iOSでは、ホーム画面に追加(スタンドアロン起動)していないとPushが使えない */
export function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

async function apiFetch(path: string, init?: RequestInit) {
  if (!API_BASE_URL) throw new Error('API_BASE_URL is not configured')
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res
}

export async function fetchServerSettings(): Promise<{
  time: string
  timezone: string
  subscriptionCount: number
} | null> {
  try {
    const res = await apiFetch('/api/settings')
    return await res.json()
  } catch {
    return null
  }
}

export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null
  const registration = await navigator.serviceWorker.ready
  return registration.pushManager.getSubscription()
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
  ])
}

export async function subscribeToPush(time: string): Promise<void> {
  if (!isPushSupported()) throw new Error('このブラウザはPush通知に対応していません')
  if (!VAPID_PUBLIC_KEY) throw new Error('VITE_VAPID_PUBLIC_KEY が設定されていません')

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') throw new Error('通知が許可されませんでした')

  const registration = await navigator.serviceWorker.ready
  const existing = await registration.pushManager.getSubscription()
  const subscription =
    existing ??
    (await withTimeout(
      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      }),
      15000,
      '通知サービスへの接続がタイムアウトしました。通信環境を確認してもう一度お試しください',
    ))

  await withTimeout(
    apiFetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ subscription: subscription.toJSON(), time }),
    }),
    15000,
    '通知サーバーへの接続がタイムアウトしました',
  )
}

export async function updateReminderTime(time: string): Promise<void> {
  await apiFetch('/api/settings', { method: 'PUT', body: JSON.stringify({ time }) })
}

export async function unsubscribeFromPush(): Promise<void> {
  const subscription = await getCurrentSubscription()
  if (!subscription) return
  const endpoint = subscription.endpoint
  await subscription.unsubscribe()
  try {
    await apiFetch('/api/subscribe', { method: 'DELETE', body: JSON.stringify({ endpoint }) })
  } catch {
    // サーバーに届かなくても端末側の購読解除は完了しているので無視する
  }
}

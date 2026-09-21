import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import cron from 'node-cron'
import webpush from 'web-push'
import {
  getSettings,
  listSubscriptions,
  markSent,
  removeSubscription,
  updateSettings,
  upsertSubscription,
} from './db.js'
import { nowInTimezone, shouldSendNow } from './scheduler.js'

const PORT = process.env.PORT || 3001
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:example@example.com'

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error(
    'VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY が設定されていません。' +
      '`npm run generate-vapid-keys` で生成し、.env に設定してください。',
  )
  process.exit(1)
}

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

const app = express()
app.use(cors({ origin: ALLOWED_ORIGIN }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/vapid-public-key', (_req, res) => {
  res.json({ publicKey: VAPID_PUBLIC_KEY })
})

app.get('/api/settings', async (_req, res) => {
  const settings = await getSettings()
  const subscriptions = await listSubscriptions()
  res.json({ ...settings, subscriptionCount: subscriptions.length })
})

app.put('/api/settings', async (req, res) => {
  const { time, timezone } = req.body ?? {}
  if (time && !/^\d{2}:\d{2}$/.test(time)) {
    return res.status(400).json({ error: 'time must be in HH:MM format' })
  }
  const settings = await updateSettings({
    ...(time ? { time } : {}),
    ...(timezone ? { timezone } : {}),
  })
  res.json(settings)
})

app.post('/api/subscribe', async (req, res) => {
  const { subscription, time } = req.body ?? {}
  if (!subscription?.endpoint || !subscription?.keys) {
    return res.status(400).json({ error: 'invalid subscription' })
  }
  const record = await upsertSubscription(subscription)
  if (time) await updateSettings({ time })
  res.status(201).json({ id: record.id })
})

app.delete('/api/subscribe', async (req, res) => {
  const { endpoint } = req.body ?? {}
  if (!endpoint) return res.status(400).json({ error: 'endpoint is required' })
  await removeSubscription(endpoint)
  res.status(204).end()
})

async function tick(now = new Date()) {
  const settings = await getSettings()
  const subscriptions = await listSubscriptions()
  const { dateStr } = nowInTimezone(settings.timezone, now)

  for (const record of subscriptions) {
    if (!shouldSendNow(record, settings, now)) continue
    try {
      await webpush.sendNotification(
        record.subscription,
        JSON.stringify({
          title: 'ふりかえりの時間です',
          body: '今日の一言だけでも記録しませんか？',
        }),
      )
      await markSent(record.id, dateStr)
    } catch (err) {
      if (err.statusCode === 404 || err.statusCode === 410) {
        // 購読が失効している（アンインストール等）ので削除
        await removeSubscription(record.subscription.endpoint)
      } else {
        console.error('push failed for', record.id, err.message)
      }
    }
  }
}

cron.schedule('* * * * *', () => {
  tick().catch((err) => console.error('scheduler tick failed', err))
})

app.listen(PORT, () => {
  console.log(`push server listening on :${PORT}`)
})

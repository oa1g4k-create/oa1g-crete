import { randomUUID } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const DB_PATH = new URL('./db.json', import.meta.url)

const DEFAULT_DB = {
  settings: { time: '21:00', timezone: 'Asia/Tokyo' },
  subscriptions: [],
}

async function load() {
  if (!existsSync(DB_PATH)) return structuredClone(DEFAULT_DB)
  const raw = await readFile(DB_PATH, 'utf-8')
  try {
    const parsed = JSON.parse(raw)
    return {
      settings: { ...DEFAULT_DB.settings, ...parsed.settings },
      subscriptions: parsed.subscriptions ?? [],
    }
  } catch {
    return structuredClone(DEFAULT_DB)
  }
}

async function save(db) {
  await writeFile(DB_PATH, JSON.stringify(db, null, 2))
}

export async function getSettings() {
  const db = await load()
  return db.settings
}

export async function updateSettings(patch) {
  const db = await load()
  db.settings = { ...db.settings, ...patch }
  await save(db)
  return db.settings
}

export async function upsertSubscription(subscription) {
  const db = await load()
  const existing = db.subscriptions.find((s) => s.subscription.endpoint === subscription.endpoint)
  if (existing) {
    existing.subscription = subscription
    await save(db)
    return existing
  }
  const record = {
    id: randomUUID(),
    subscription,
    createdAt: new Date().toISOString(),
    lastSentDate: null,
  }
  db.subscriptions.push(record)
  await save(db)
  return record
}

export async function removeSubscription(endpoint) {
  const db = await load()
  db.subscriptions = db.subscriptions.filter((s) => s.subscription.endpoint !== endpoint)
  await save(db)
}

export async function listSubscriptions() {
  const db = await load()
  return db.subscriptions
}

export async function markSent(id, dateStr) {
  const db = await load()
  const record = db.subscriptions.find((s) => s.id === id)
  if (record) {
    record.lastSentDate = dateStr
    await save(db)
  }
}

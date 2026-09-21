/** 指定タイムゾーンでの現在時刻を HH:MM と YYYY-MM-DD に分解する */
export function nowInTimezone(timezone, date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  const parts = Object.fromEntries(formatter.formatToParts(date).map((p) => [p.type, p.value]))
  const hour = parts.hour === '24' ? '00' : parts.hour
  return {
    hhmm: `${hour}:${parts.minute}`,
    dateStr: `${parts.year}-${parts.month}-${parts.day}`,
  }
}

/** このsubscriptionに今このタイミングで送るべきかを判定する */
export function shouldSendNow(subscription, settings, now = new Date()) {
  const { hhmm, dateStr } = nowInTimezone(settings.timezone, now)
  if (hhmm !== settings.time) return false
  if (subscription.lastSentDate === dateStr) return false
  return true
}

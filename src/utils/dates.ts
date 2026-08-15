const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function dateForOffset(dayOffset: number): Date {
  const d = startOfToday()
  d.setDate(d.getDate() + dayOffset)
  return d
}

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function dayLabel(dayOffset: number): string {
  if (dayOffset === 0) return 'Today'
  if (dayOffset === 1) return 'Tomorrow'
  return DAY_LABELS[dateForOffset(dayOffset).getDay()]
}

export function shortDayNum(dayOffset: number): string {
  return String(dateForOffset(dayOffset).getDate())
}

export function monthLabel(dayOffset: number): string {
  return MONTH_LABELS[dateForOffset(dayOffset).getMonth()]
}

export function groupLabel(dayOffset: number): string {
  if (dayOffset === 0) return 'Today'
  if (dayOffset === 1) return 'Tomorrow'
  const d = dateForOffset(dayOffset)
  return `${DAY_LABELS[d.getDay()]} ${d.getDate()}`
}

export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h${m > 0 ? String(m).padStart(2, '0') : ''}`
}

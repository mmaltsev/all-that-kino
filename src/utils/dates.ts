import type { Language } from '../i18n/LanguageContext'

const DAY_LABELS: Record<Language, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
}
const MONTH_LABELS: Record<Language, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
}
const TODAY_LABEL: Record<Language, string> = { en: 'Today', de: 'Heute' }
const TOMORROW_LABEL: Record<Language, string> = { en: 'Tomorrow', de: 'Morgen' }

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

export function dayLabel(dayOffset: number, language: Language): string {
  if (dayOffset === 0) return TODAY_LABEL[language]
  if (dayOffset === 1) return TOMORROW_LABEL[language]
  return DAY_LABELS[language][dateForOffset(dayOffset).getDay()]
}

export function shortDayNum(dayOffset: number): string {
  return String(dateForOffset(dayOffset).getDate())
}

export function monthLabel(dayOffset: number, language: Language): string {
  return MONTH_LABELS[language][dateForOffset(dayOffset).getMonth()]
}

export function groupLabel(dayOffset: number, language: Language): string {
  if (dayOffset === 0) return TODAY_LABEL[language]
  if (dayOffset === 1) return TOMORROW_LABEL[language]
  const d = dateForOffset(dayOffset)
  return `${DAY_LABELS[language][d.getDay()]} ${d.getDate()}`
}

export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h${m > 0 ? String(m).padStart(2, '0') : ''}`
}

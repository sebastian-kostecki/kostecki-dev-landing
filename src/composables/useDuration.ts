import { careerSince, type CareerKey } from '@/content/career'
import type { Locale } from '@/composables/useLocale'

/** Whole and half years elapsed since a YYYY-MM date, rounded down to the half year. */
export function yearsSince(since: string, now = new Date()): number {
  const [year, month] = since.split('-').map(Number)
  const months = (now.getFullYear() - year!) * 12 + (now.getMonth() + 1 - month!)
  return Math.floor(months / 6) / 2
}

function polishYears(value: number, genitive: boolean) {
  if (!Number.isInteger(value)) return `${String(value).replace('.', ',')} roku`
  if (value === 1) return genitive ? 'roku' : '1 rok'
  const lastTwo = value % 100
  const last = value % 10
  if (!genitive && last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${value} lata`
  return `${value} lat`
}

/**
 * Formats a duration: {years:key} gives "4 lata" / "3,5 roku" / "4 years";
 * {since:key} gives the Polish genitive used after "od" ("Od 4 lat").
 */
export function formatDuration(key: CareerKey, locale: Locale, form: 'years' | 'since') {
  const value = yearsSince(careerSince[key])
  if (locale === 'pl') return polishYears(value, form === 'since')
  const unit = value === 1 ? 'year' : 'years'
  return `${value} ${unit}`
}

const TOKEN = /\{(years|since):(\w+)\}/g

export function fillDurations(text: string, locale: Locale) {
  return text.replace(TOKEN, (match, form: 'years' | 'since', key: string) =>
    key in careerSince ? formatDuration(key as CareerKey, locale, form) : match,
  )
}

/** Deep-copies content, resolving duration tokens in every string. */
export function resolveDurations<T>(value: T, locale: Locale): T {
  if (typeof value === 'string') return fillDurations(value, locale) as T
  if (Array.isArray(value)) return value.map((item) => resolveDurations(item, locale)) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolveDurations(item, locale)]),
    ) as T
  }
  return value
}

export type DateInput = string | number | Date | null | undefined

export type DateFormatPreset =
  | 'date'
  | 'dateTime'
  | 'time'
  | 'shortDate'
  | 'longDate'
  | 'longDateTime'
  | 'weekdayDate'
  | 'monthYear'

export interface FormatDateOptions {
  locale?: string
  timeZone?: string
  fallback?: string
}

const DATE_PRESETS: Record<DateFormatPreset, Intl.DateTimeFormatOptions> = {
  date: { year: 'numeric', month: 'short', day: '2-digit' },
  dateTime: {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  },
  time: { hour: '2-digit', minute: '2-digit' },
  shortDate: { day: '2-digit', month: '2-digit', year: 'numeric' },
  longDate: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  longDateTime: {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
  weekdayDate: { weekday: 'short', month: 'short', day: 'numeric' },
  monthYear: { month: 'long', year: 'numeric' },
}

export function useDateFormatter(defaultLocale: string = 'id-ID', defaultTimeZone?: string) {
  function toValidDate(value: DateInput): Date | null {
    if (value === null || value === undefined || value === '') {
      return null
    }

    const date = value instanceof Date ? value : new Date(value)

    return Number.isNaN(date.getTime()) ? null : date
  }

  function formatDate(
    value: DateInput,
    preset: DateFormatPreset = 'dateTime',
    options?: FormatDateOptions,
  ): string {
    const date = toValidDate(value)
    if (!date) {
      return options?.fallback ?? '-'
    }

    const locale = options?.locale ?? defaultLocale
    const timeZone = options?.timeZone ?? defaultTimeZone

    return new Intl.DateTimeFormat(locale, {
      ...DATE_PRESETS[preset],
      ...(timeZone ? { timeZone } : {}),
    }).format(date)
  }

  return {
    formatDate,
  }
}

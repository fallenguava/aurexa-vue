export interface FormatCurrencyOptions {
  locale?: string
  maximumFractionDigits?: number
}

export function useCurrencyFormatter(defaultCurrency: string = 'IDR', defaultLocale = 'id-ID') {
  function formatCurrency(
    amount: number,
    currency: string = defaultCurrency,
    options?: FormatCurrencyOptions,
  ): string {
    const safeCurrency = currency || defaultCurrency
    const locale = options?.locale ?? (safeCurrency === 'IDR' ? 'id-ID' : defaultLocale)
    const maximumFractionDigits = options?.maximumFractionDigits ?? (safeCurrency === 'IDR' ? 0 : 2)

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: safeCurrency,
      maximumFractionDigits,
    }).format(amount)
  }

  return {
    formatCurrency,
  }
}

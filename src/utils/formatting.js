const CURRENCY_META = {
  NGN: { locale: 'en-NG', symbol: '₦' },
  USD: { locale: 'en-US', symbol: '$' },
  EUR: { locale: 'de-DE', symbol: '€' },
  GBP: { locale: 'en-GB', symbol: '£' },
  GHS: { locale: 'en-GH', symbol: 'GH₵' },
  KES: { locale: 'en-KE', symbol: 'KSh' },
  ZAR: { locale: 'en-ZA', symbol: 'R' },
  CAD: { locale: 'en-CA', symbol: 'CA$' },
}

export const CURRENCIES = Object.keys(CURRENCY_META)

export function getCurrencySymbol(currency) {
  return CURRENCY_META[currency]?.symbol ?? currency
}

export function formatMoney(amount, currency) {
  const meta = CURRENCY_META[currency] ?? CURRENCY_META.NGN
  const n = isFinite(amount) ? amount : 0
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n)
  } catch {
    return `${meta.symbol}${n.toFixed(2)}`
  }
}

export function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return isoDate(d)
}

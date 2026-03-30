/** Matches marketing “Our Pricing” and default_discount.discount_pct display rules */

export function discountedAmount(price: number, discountPct: number | null | undefined): number {
  const pct = discountPct ?? 0
  if (!pct || pct <= 0) return price
  return Math.round((price * (100 - pct)) / 100)
}

export function formatInr(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(n)
}

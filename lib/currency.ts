/**
 * Format number as Indonesian Rupiah (IDR)
 * Uses Rp prefix with Indonesian locale (period for thousands separator)
 */
export function formatIDR(value: number, options?: { compact?: boolean }): string {
  if (options?.compact && Math.abs(value) >= 1_000_000) {
    const millions = value / 1_000_000
    return `Rp ${millions.toFixed(1)}jt`
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

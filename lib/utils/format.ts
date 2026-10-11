// lib/utils/format.ts
import Decimal from "decimal.js";

/**
 * Format a number as Indian Rupees with Indian number system (lakhs/crores).
 * Example: 125000 => "₹1,25,000"
 */
export function formatINR(
  amount: number | string | Decimal,
  options: { showDecimals?: boolean; compact?: boolean } = {},
): string {
  const { showDecimals = false, compact = false } = options;
  const value = new Decimal(amount.toString()).toNumber();

  if (compact && Math.abs(value) >= 100000) {
    const lakhs = value / 100000;
    if (Math.abs(lakhs) >= 100) {
      return `₹${(lakhs / 100).toFixed(2)}Cr`;
    }
    return `₹${lakhs.toFixed(2)}L`;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(value);
}

/**
 * Format a date range for display headers.
 */
export function formatDateRange(start: Date, end: Date): string {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${formatter.format(start)} — ${formatter.format(end)}`;
}

/**
 * Format a percentage.
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

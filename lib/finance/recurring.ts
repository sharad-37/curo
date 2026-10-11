// lib/finance/recurring.ts
import Decimal from "decimal.js";

export interface RecurringCandidate {
  merchantName: string;
  estimatedAmount: Decimal;
  frequency: "MONTHLY" | "YEARLY" | "WEEKLY";
  observedCount: number;
  lastObservedDate: Date;
  nextExpectedDate: Date;
  categorySlug: string;
}

export function detectRecurringExpenses(
  transactions: Array<{
    normalizedMerchant: string;
    amount: Decimal | string | number;
    date: Date;
    type: string;
    category?: { slug: string } | null;
  }>,
): RecurringCandidate[] {
  const debitTxs = transactions.filter((t) => t.type === "DEBIT");
  const grouped = new Map<
    string,
    Array<{ amount: Decimal; date: Date; categorySlug: string }>
  >();

  for (const tx of debitTxs) {
    const merchant = tx.normalizedMerchant;
    const existing = grouped.get(merchant) || [];
    existing.push({
      amount: new Decimal(tx.amount.toString()),
      date: new Date(tx.date),
      categorySlug: tx.category?.slug || "other",
    });
    grouped.set(merchant, existing);
  }

  const results: RecurringCandidate[] = [];

  for (const [merchant, txs] of grouped.entries()) {
    if (txs.length < 2) continue; // Must occur at least twice

    // Sort chronologically
    txs.sort((a, b) => a.date.getTime() - b.date.getTime());

    const latest = txs[txs.length - 1]!;
    const previous = txs[txs.length - 2]!;

    const daysDiff = Math.abs(
      (latest.date.getTime() - previous.date.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Monthly pattern: 25 to 35 days apart
    if (daysDiff >= 25 && daysDiff <= 35) {
      const nextDate = new Date(latest.date);
      nextDate.setDate(nextDate.getDate() + 30);

      results.push({
        merchantName: merchant,
        estimatedAmount: latest.amount,
        frequency: "MONTHLY",
        observedCount: txs.length,
        lastObservedDate: latest.date,
        nextExpectedDate: nextDate,
        categorySlug: latest.categorySlug,
      });
    }
  }

  return results;
}

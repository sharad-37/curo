// lib/finance/calculations.ts
import Decimal from "decimal.js";

export interface CategorySummary {
  categorySlug: string;
  categoryName: string;
  colorHex: string;
  totalAmount: Decimal;
  percentage: number;
  transactionCount: number;
}

export interface FinancialOverview {
  totalIncome: Decimal;
  totalExpenses: Decimal;
  netCashFlow: Decimal;
  savingsRate: number; // Percentage 0 - 100
  categorySummaries: CategorySummary[];
}

export function calculateFinancialOverview(
  transactions: Array<{
    amount: Decimal | string | number;
    type: "DEBIT" | "CREDIT" | "TRANSFER";
    category?: { slug: string; name: string; colorHex?: string | null } | null;
  }>,
): FinancialOverview {
  let totalIncome = new Decimal(0);
  let totalExpenses = new Decimal(0);
  const categoryMap = new Map<
    string,
    { name: string; colorHex: string; total: Decimal; count: number }
  >();

  for (const tx of transactions) {
    const amt = new Decimal(tx.amount.toString());

    if (tx.type === "CREDIT") {
      totalIncome = totalIncome.plus(amt);
    } else if (tx.type === "DEBIT") {
      totalExpenses = totalExpenses.plus(amt);

      const slug = tx.category?.slug || "other";
      const name = tx.category?.name || "Other & Unclassified";
      const colorHex = tx.category?.colorHex || "#D7D1C7";

      const existing = categoryMap.get(slug) || {
        name,
        colorHex,
        total: new Decimal(0),
        count: 0,
      };

      categoryMap.set(slug, {
        name,
        colorHex,
        total: existing.total.plus(amt),
        count: existing.count + 1,
      });
    }
  }

  const netCashFlow = totalIncome.minus(totalExpenses);
  const savingsRate = totalIncome.greaterThan(0)
    ? netCashFlow.dividedBy(totalIncome).times(100).toNumber()
    : 0;

  const categorySummaries: CategorySummary[] = Array.from(
    categoryMap.entries(),
  ).map(([slug, data]) => ({
    categorySlug: slug,
    categoryName: data.name,
    colorHex: data.colorHex,
    totalAmount: data.total,
    percentage: totalExpenses.greaterThan(0)
      ? data.total.dividedBy(totalExpenses).times(100).toNumber()
      : 0,
    transactionCount: data.count,
  }));

  // Sort categories descending by amount spent
  categorySummaries.sort((a, b) =>
    b.totalAmount.minus(a.totalAmount).toNumber(),
  );

  return {
    totalIncome,
    totalExpenses,
    netCashFlow,
    savingsRate: Math.max(0, Math.round(savingsRate * 10) / 10),
    categorySummaries,
  };
}

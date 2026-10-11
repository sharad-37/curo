// lib/finance/forecasting.ts
import Decimal from "decimal.js";

export interface ForecastResult {
  currentSpent: Decimal;
  daysElapsed: number;
  totalDaysInMonth: number;
  dailyRunRate: Decimal;
  projectedMonthEndSpent: Decimal;
  historicalAvgMonthlySpent: Decimal | null;
  riskLevel: "LOW" | "MODERATE" | "HIGH";
  overrunPercentage: number;
}

export function calculateMonthEndForecast(
  currentMonthExpenses: Array<{
    amount: Decimal | string | number;
    date: Date;
  }>,
  historicalMonthlyAverages: Array<Decimal | number> = [],
): ForecastResult {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysElapsed = Math.max(1, now.getDate());

  let totalSpent = new Decimal(0);
  for (const tx of currentMonthExpenses) {
    totalSpent = totalSpent.plus(new Decimal(tx.amount.toString()));
  }

  const dailyRunRate = totalSpent.dividedBy(daysElapsed);
  const remainingDays = totalDaysInMonth - daysElapsed;
  const projectedMonthEndSpent = totalSpent.plus(
    dailyRunRate.times(remainingDays),
  );

  // Historical Baseline comparison
  let historicalAvg: Decimal | null = null;
  if (historicalMonthlyAverages.length > 0) {
    let sum = new Decimal(0);
    for (const avg of historicalMonthlyAverages) {
      sum = sum.plus(new Decimal(avg.toString()));
    }
    historicalAvg = sum.dividedBy(historicalMonthlyAverages.length);
  }

  let riskLevel: "LOW" | "MODERATE" | "HIGH" = "LOW";
  let overrunPercentage = 0;

  if (historicalAvg && historicalAvg.greaterThan(0)) {
    const ratio = projectedMonthEndSpent.dividedBy(historicalAvg);
    overrunPercentage = ratio.minus(1).times(100).toNumber();

    if (ratio.greaterThan(1.25)) {
      riskLevel = "HIGH";
    } else if (ratio.greaterThan(1.05)) {
      riskLevel = "MODERATE";
    }
  }

  return {
    currentSpent: totalSpent,
    daysElapsed,
    totalDaysInMonth,
    dailyRunRate,
    projectedMonthEndSpent,
    historicalAvgMonthlySpent: historicalAvg,
    riskLevel,
    overrunPercentage: Math.round(overrunPercentage * 10) / 10,
  };
}

// lib/finance/insights.ts
import Decimal from "decimal.js";
import { FinancialOverview } from "./calculations";
import { ForecastResult } from "./forecasting";
import { RecurringCandidate } from "./recurring";

export interface GeneratedInsight {
  type:
    | "SPENDING_SPIKE"
    | "RECURRING_COMMITMENT"
    | "BUDGET_WARNING"
    | "CATEGORY_SHIFT";
  title: string;
  summary: string;
  evidence: {
    label: string;
    value: string;
    comparisonLabel?: string;
  };
}

export function generateStructuredInsights(
  overview: FinancialOverview,
  forecast: ForecastResult,
  recurring: RecurringCandidate[],
): GeneratedInsight[] {
  const insights: GeneratedInsight[] = [];

  // 1. Forecast Overrun Warning
  if (forecast.riskLevel === "HIGH" || forecast.riskLevel === "MODERATE") {
    insights.push({
      type: "BUDGET_WARNING",
      title: "Month-end expenditure trajectory alert",
      summary: `At your current daily run-rate of ₹${forecast.dailyRunRate.toFixed(0)}/day, month-end expenses are projected to reach ₹${forecast.projectedMonthEndSpent.toFixed(0)}, exceeding your baseline by ${forecast.overrunPercentage}%.`,
      evidence: {
        label: "Projected Month-End",
        value: `₹${forecast.projectedMonthEndSpent.toFixed(0)}`,
        comparisonLabel: `+${forecast.overrunPercentage}% over baseline`,
      },
    });
  }

  // 2. Dominant Category Spike
  if (overview.categorySummaries.length > 0) {
    const topCategory = overview.categorySummaries[0]!;
    if (topCategory.percentage >= 30) {
      insights.push({
        type: "SPENDING_SPIKE",
        title: `High concentration in ${topCategory.categoryName}`,
        summary: `${topCategory.categoryName} represents ${topCategory.percentage.toFixed(1)}% of your total spending across ${topCategory.transactionCount} transactions.`,
        evidence: {
          label: topCategory.categoryName,
          value: `₹${topCategory.totalAmount.toFixed(0)}`,
          comparisonLabel: `${topCategory.percentage.toFixed(1)}% of total expenses`,
        },
      });
    }
  }

  // 3. Recurring Subscriptions Detected
  if (recurring.length > 0) {
    let totalRecurring = new Decimal(0);
    for (const r of recurring)
      totalRecurring = totalRecurring.plus(r.estimatedAmount);

    insights.push({
      type: "RECURRING_COMMITMENT",
      title: `${recurring.length} recurring commitments detected`,
      summary: `We identified recurring monthly charges including ${recurring
        .slice(0, 3)
        .map((r) => r.merchantName)
        .join(", ")}, totaling ₹${totalRecurring.toFixed(0)}/month.`,
      evidence: {
        label: "Fixed Monthly",
        value: `₹${totalRecurring.toFixed(0)}`,
        comparisonLabel: `${recurring.length} active subscriptions`,
      },
    });
  }

  return insights;
}

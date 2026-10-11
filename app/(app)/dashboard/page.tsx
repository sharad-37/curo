// app/(app)/dashboard/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { formatINR } from "@/lib/utils/format";
import { calculateFinancialOverview } from "@/lib/finance/calculations";
import { calculateMonthEndForecast } from "@/lib/finance/forecasting";
import { detectRecurringExpenses } from "@/lib/finance/recurring";
import { generateStructuredInsights } from "@/lib/finance/insights";
import {
  Upload,
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  Repeat,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Dashboard",
  description: "Your personalized financial intelligence summary.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  const overview = calculateFinancialOverview(transactions);

  // Compute ML/Algorithmic Intelligence
  const currentMonthTxs = transactions.filter((t) => {
    const d = new Date(t.date);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });

  const forecast = calculateMonthEndForecast(
    currentMonthTxs.map((t) => ({
      amount: t.amount.toString(),
      date: new Date(t.date),
    })),
  );

  const recurring = detectRecurringExpenses(
    transactions.map((t) => ({
      normalizedMerchant: t.normalizedMerchant,
      amount: t.amount.toString(),
      date: new Date(t.date),
      type: t.type,
      category: t.category,
    })),
  );

  const insights = generateStructuredInsights(overview, forecast, recurring);
  const firstName = session.user.name?.split(" ")[0] || "there";

  return (
    <div className="mx-auto w-full max-w-6xl p-8 lg:p-12">
      {/* Header */}
      <header className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-light text-curo-text">
            Good morning, {firstName}.
          </h1>
          <p className="mt-1 text-curo-text-secondary">
            Financial intelligence summary from {transactions.length} processed
            records.
          </p>
        </div>

        {!transactions.length && (
          <Link
            href="/transactions/import"
            className="inline-flex items-center gap-2 rounded-full bg-curo-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-curo-primary-hover"
          >
            <Upload size={16} />
            Import CSV Statement
          </Link>
        )}
      </header>

      {/* KPI Cards */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-curo-border bg-curo-surface p-6 shadow-sm">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-curo-text-muted">
            Total Income
          </p>
          <p className="tabular-nums text-3xl font-light text-curo-text">
            {formatINR(overview.totalIncome.toString())}
          </p>
        </div>

        <div className="rounded-2xl border border-curo-border bg-curo-surface p-6 shadow-sm">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-curo-text-muted">
            Total Expenses
          </p>
          <p className="tabular-nums text-3xl font-light text-curo-text">
            {formatINR(overview.totalExpenses.toString())}
          </p>
        </div>

        <div className="rounded-2xl border border-curo-border bg-curo-surface p-6 shadow-sm">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-curo-text-muted">
            Net Cash Flow
          </p>
          <p
            className={`tabular-nums text-3xl font-light ${overview.netCashFlow.greaterThanOrEqualTo(0) ? "text-curo-positive" : "text-curo-negative"}`}
          >
            {formatINR(overview.netCashFlow.toString())}
          </p>
        </div>
      </div>

      {/* AI Structured Insights Section */}
      {insights.length > 0 && (
        <div className="mb-10 rounded-2xl border border-curo-border bg-curo-surface p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="text-curo-primary" size={20} />
            <h2 className="text-lg font-medium text-curo-text">
              Evidence-Based Financial Insights
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {insights.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-curo-border/60 bg-curo-background/60 p-5"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-curo-text-muted">
                    {item.type.replace("_", " ")}
                  </span>
                  <span className="font-mono text-xs font-medium text-curo-primary">
                    {item.evidence.comparisonLabel}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-medium text-curo-text">
                  {item.title}
                </h3>
                <p className="text-xs text-curo-text-secondary leading-relaxed">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Month-End Forecast Widget */}
      {transactions.length > 0 && (
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="rounded-2xl border border-curo-border bg-curo-surface p-8 shadow-sm md:col-span-7">
            <h2 className="mb-2 text-lg font-medium text-curo-text">
              Month-End Expenditure Forecast
            </h2>
            <p className="mb-6 text-xs text-curo-text-secondary">
              Based on {forecast.daysElapsed} days of actual spending data at a
              run-rate of ₹{forecast.dailyRunRate.toFixed(0)}/day.
            </p>

            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-sm font-medium text-curo-text-secondary">
                Projected Total
              </span>
              <span className="tabular-nums font-mono text-2xl font-light text-curo-text">
                {formatINR(forecast.projectedMonthEndSpent.toString())}
              </span>
            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-curo-muted-surface">
              <div
                className={`h-full transition-all duration-500 ${forecast.riskLevel === "HIGH" ? "bg-curo-negative" : "bg-curo-primary"}`}
                style={{
                  width: `${Math.min(100, (forecast.daysElapsed / forecast.totalDaysInMonth) * 100)}%`,
                }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-curo-text-muted">
              <span>
                Day {forecast.daysElapsed} of {forecast.totalDaysInMonth}
              </span>
              <span>
                Run-Rate: {formatINR(forecast.dailyRunRate.toString())}/day
              </span>
            </div>
          </div>

          {/* Recurring Subscriptions Widget */}
          <div className="rounded-2xl border border-curo-border bg-curo-surface p-8 shadow-sm md:col-span-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-curo-text">
                Detected Commitments
              </h2>
              <Repeat size={18} className="text-curo-primary" />
            </div>

            {!recurring.length ? (
              <p className="text-xs text-curo-text-muted">
                No recurring monthly charges detected yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recurring.map((rec) => (
                  <div
                    key={rec.merchantName}
                    className="flex items-center justify-between border-b border-curo-border/40 pb-2.5 text-xs"
                  >
                    <div>
                      <p className="font-medium text-curo-text">
                        {rec.merchantName}
                      </p>
                      <p className="text-curo-text-muted">
                        Next:{" "}
                        {rec.nextExpectedDate.toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span className="font-mono tabular-nums font-medium text-curo-text">
                      {formatINR(rec.estimatedAmount.toString())}/mo
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {overview.categorySummaries.length > 0 && (
        <div className="rounded-2xl border border-curo-border bg-curo-surface p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium text-curo-text">
              Category Spending Breakdown
            </h2>
            <Link
              href="/transactions"
              className="flex items-center gap-1 text-xs font-medium text-curo-primary hover:underline"
            >
              View All Transactions <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="space-y-5">
            {overview.categorySummaries.slice(0, 6).map((cat) => (
              <div key={cat.categorySlug}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-curo-text">
                    {cat.categoryName}
                  </span>
                  <span className="tabular-nums font-mono text-curo-text-secondary">
                    {formatINR(cat.totalAmount.toString())} (
                    {cat.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-curo-muted-surface">
                  <div
                    className="h-full bg-curo-primary transition-all duration-500"
                    style={{ width: `${Math.min(100, cat.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

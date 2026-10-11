// app/(app)/analytics/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { calculateFinancialOverview } from "@/lib/finance/calculations";
import { formatINR } from "@/lib/utils/format";
import { SpendingTrendChart } from "@/components/charts/SpendingTrendChart";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: "asc" },
  });

  const overview = calculateFinancialOverview(transactions);

  // Group transactions by date for Area Chart
  const trendMap = new Map<string, { income: number; expense: number }>();
  for (const t of transactions) {
    const dateKey = new Date(t.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
    const existing = trendMap.get(dateKey) || { income: 0, expense: 0 };
    const amt = parseFloat(t.amount.toString());

    if (t.type === "CREDIT") {
      existing.income += amt;
    } else {
      existing.expense += amt;
    }
    trendMap.set(dateKey, existing);
  }

  const trendData = Array.from(trendMap.entries()).map(([date, vals]) => ({
    date,
    income: vals.income,
    expense: vals.expense,
  }));

  // Map category data for Donut Chart
  const pieData = overview.categorySummaries.map((cat) => ({
    name: cat.categoryName,
    value: cat.totalAmount.toNumber(),
    color: cat.colorHex,
  }));

  // Top Merchants Leaderboard
  const merchantMap = new Map<string, number>();
  for (const t of transactions.filter((tx) => tx.type === "DEBIT")) {
    const current = merchantMap.get(t.normalizedMerchant) || 0;
    merchantMap.set(
      t.normalizedMerchant,
      current + parseFloat(t.amount.toString()),
    );
  }

  const topMerchants = Array.from(merchantMap.entries())
    .map(([merchant, total]) => ({ merchant, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-6xl p-8 lg:p-12">
      <header className="mb-10">
        <h1 className="text-3xl font-light text-curo-text">
          Financial Analytics
        </h1>
        <p className="mt-1 text-curo-text-secondary">
          Deep-dive trends and spending velocity across {transactions.length}{" "}
          transactions.
        </p>
      </header>

      {/* Charts Grid */}
      <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Trend Area Chart */}
        <div className="rounded-2xl border border-curo-border bg-curo-surface p-8 shadow-sm lg:col-span-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-curo-text">
                Cash Flow Velocity
              </h2>
              <p className="text-xs text-curo-text-muted mt-0.5">
                Income vs Expenses timeline
              </p>
            </div>
          </div>
          <SpendingTrendChart data={trendData} />
        </div>

        {/* Category Pie Chart */}
        <div className="rounded-2xl border border-curo-border bg-curo-surface p-8 shadow-sm lg:col-span-4">
          <h2 className="text-lg font-medium text-curo-text mb-1">
            Category Mix
          </h2>
          <p className="text-xs text-curo-text-muted mb-4">Expense breakdown</p>
          <CategoryPieChart data={pieData} />
        </div>
      </div>

      {/* Top Merchants Leaderboard */}
      <div className="rounded-2xl border border-curo-border bg-curo-surface p-8 shadow-sm">
        <h2 className="text-lg font-medium text-curo-text mb-6">
          Top Outflow Merchants
        </h2>
        {!topMerchants.length ? (
          <p className="text-xs text-curo-text-muted">
            No merchant records available.
          </p>
        ) : (
          <div className="space-y-4">
            {topMerchants.map((m, idx) => (
              <div
                key={m.merchant}
                className="flex items-center justify-between border-b border-curo-border/40 pb-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-curo-muted-surface text-xs font-mono font-medium text-curo-text-secondary">
                    0{idx + 1}
                  </span>
                  <span className="font-medium text-curo-text">
                    {m.merchant}
                  </span>
                </div>
                <span className="font-mono tabular-nums font-medium text-curo-text">
                  {formatINR(m.total)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

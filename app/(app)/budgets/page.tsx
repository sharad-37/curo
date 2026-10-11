// app/(app)/budgets/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { formatINR } from "@/lib/utils/format";
import { calculateFinancialOverview } from "@/lib/finance/calculations";
import { BudgetFormModal } from "@/components/app/BudgetFormModal";

export default async function BudgetsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [categories, budgets, transactions] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.budget.findMany({ where: { userId } }),
    prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
    }),
  ]);

  const overview = calculateFinancialOverview(transactions);
  const budgetMap = new Map(
    budgets.map((b) => [b.categoryId, parseFloat(b.amount.toString())]),
  );

  return (
    <div className="mx-auto w-full max-w-6xl p-8 lg:p-12">
      <header className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-light text-curo-text">
            Category Budgets
          </h1>
          <p className="mt-1 text-curo-text-secondary">
            Set monthly spending limits and monitor budget overruns.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {categories.map((cat) => {
          const limit = budgetMap.get(cat.id) || 0;
          const summary = overview.categorySummaries.find(
            (s) => s.categorySlug === cat.slug,
          );
          const spent = summary ? summary.totalAmount.toNumber() : 0;
          const percentage = limit > 0 ? (spent / limit) * 100 : 0;

          return (
            <div
              key={cat.id}
              className="rounded-2xl border border-curo-border bg-curo-surface p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-curo-text">{cat.name}</h3>
                  <p className="text-xs text-curo-text-muted mt-0.5">
                    Spent:{" "}
                    <span className="font-mono font-medium text-curo-text">
                      {formatINR(spent)}
                    </span>
                  </p>
                </div>
                <BudgetFormModal
                  categoryId={cat.id}
                  categoryName={cat.name}
                  currentLimit={limit}
                />
              </div>

              {limit > 0 ? (
                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-curo-text-secondary">
                      Limit: {formatINR(limit)}
                    </span>
                    <span
                      className={`font-mono font-medium ${percentage > 100 ? "text-curo-negative" : "text-curo-primary"}`}
                    >
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-curo-muted-surface">
                    <div
                      className={`h-full transition-all duration-500 ${percentage > 100 ? "bg-curo-negative" : "bg-curo-primary"}`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs italic text-curo-text-muted">
                  No limit configured.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

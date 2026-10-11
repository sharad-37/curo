// app/(app)/recurring/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { detectRecurringExpenses } from "@/lib/finance/recurring";
import { formatINR } from "@/lib/utils/format";
import { Repeat, Calendar } from "lucide-react";

export default async function RecurringPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  const recurring = detectRecurringExpenses(
    transactions.map((t) => ({
      normalizedMerchant: t.normalizedMerchant,
      amount: t.amount.toString(),
      date: new Date(t.date),
      type: t.type,
      category: t.category,
    })),
  );

  let totalMonthlyCommitment = 0;
  for (const r of recurring) {
    totalMonthlyCommitment += r.estimatedAmount.toNumber();
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-8 lg:p-12">
      <header className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-light text-curo-text">
            Recurring Commitments
          </h1>
          <p className="mt-1 text-curo-text-secondary">
            Detected subscriptions and fixed monthly obligations.
          </p>
        </div>

        <div className="rounded-2xl border border-curo-border bg-curo-surface px-6 py-3 text-right">
          <p className="text-[11px] font-medium uppercase tracking-wider text-curo-text-muted">
            Fixed Monthly Outflow
          </p>
          <p className="font-mono text-2xl font-light tabular-nums text-curo-text">
            {formatINR(totalMonthlyCommitment)}/mo
          </p>
        </div>
      </header>

      {!recurring.length ? (
        <div className="rounded-2xl border border-dashed border-curo-border bg-curo-surface p-12 text-center">
          <Repeat className="mx-auto mb-4 text-curo-text-muted" size={32} />
          <p className="text-curo-text-secondary">
            No recurring subscriptions detected yet.
          </p>
          <p className="mt-1 text-xs text-curo-text-muted">
            Import at least two months of statements to auto-detect
            subscriptions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {recurring.map((rec) => (
            <div
              key={rec.merchantName}
              className="rounded-2xl border border-curo-border bg-curo-surface p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-curo-primary-light text-curo-primary font-medium">
                    {rec.merchantName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-curo-text">
                      {rec.merchantName}
                    </h3>
                    <span className="inline-block rounded bg-curo-muted-surface px-2 py-0.5 text-[10px] uppercase font-medium text-curo-text-muted">
                      {rec.frequency}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-lg font-medium text-curo-text">
                  {formatINR(rec.estimatedAmount.toNumber())}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-curo-border/40 pt-4 text-xs text-curo-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-curo-text-muted" />
                  Next bill:{" "}
                  {rec.nextExpectedDate.toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>Observed {rec.observedCount} times</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

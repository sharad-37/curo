// app/(app)/transactions/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { formatINR } from "@/lib/utils/format";
import { Upload } from "lucide-react";
import { CategoryDropdown } from "@/components/app/CategoryDropdown";

export default async function TransactionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [transactions, categories] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId: session.user.id },
      include: { category: true },
      orderBy: { date: "desc" },
      take: 500,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl p-8 lg:p-12">
      <header className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-light text-curo-text">Transactions</h1>
          <p className="mt-1 text-curo-text-secondary">
            {transactions.length} records · categorized with confidence scores
          </p>
        </div>
        <Link
          href="/transactions/import"
          className="inline-flex items-center gap-2 rounded-full bg-curo-text px-5 py-2.5 text-sm font-medium text-curo-background hover:bg-curo-primary"
        >
          <Upload size={16} />
          Import CSV
        </Link>
      </header>

      {!transactions.length ? (
        <div className="rounded-2xl border border-dashed border-curo-border bg-curo-surface p-12 text-center">
          <p className="text-curo-text-secondary">No transactions yet.</p>
          <Link
            href="/transactions/import"
            className="mt-4 inline-flex rounded-full bg-curo-primary px-5 py-2.5 text-sm font-medium text-white"
          >
            Import your first statement
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-curo-border bg-curo-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-curo-border/60 bg-curo-muted-surface/40 text-[11px] uppercase tracking-wider text-curo-text-muted">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Merchant</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Confidence</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-curo-border/40">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-curo-muted-surface/20">
                    <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-curo-text-muted">
                      {new Date(tx.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-curo-text">
                        {tx.normalizedMerchant}
                      </p>
                      <p className="max-w-sm truncate text-xs text-curo-text-muted">
                        {tx.description}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <CategoryDropdown
                        transactionId={tx.id}
                        currentCategoryId={tx.categoryId}
                        categories={categories}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          (tx.confidenceScore ?? 0) >= 0.85
                            ? "bg-curo-primary-light text-curo-primary"
                            : (tx.confidenceScore ?? 0) >= 0.6
                              ? "bg-curo-warning-light text-curo-warning"
                              : "bg-curo-negative-light text-curo-negative"
                        }`}
                      >
                        {Math.round((tx.confidenceScore ?? 0) * 100)}%
                      </span>
                    </td>
                    <td
                      className={`whitespace-nowrap px-5 py-3 text-right font-mono tabular-nums ${
                        tx.type === "CREDIT"
                          ? "text-curo-positive"
                          : "text-curo-text"
                      }`}
                    >
                      {tx.type === "CREDIT" ? "+" : "−"}
                      {formatINR(tx.amount.toString(), { showDecimals: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

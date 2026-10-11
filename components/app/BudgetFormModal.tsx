// components/app/BudgetFormModal.tsx
"use client";

import { useState, useTransition } from "react";
import { setBudgetAction } from "@/app/actions/budget-actions";

interface BudgetFormModalProps {
  categoryId: string;
  categoryName: string;
  currentLimit: number;
}

export function BudgetFormModal({
  categoryId,
  categoryName,
  currentLimit,
}: BudgetFormModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(
    currentLimit ? currentLimit.toString() : "",
  );
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val < 0) return;

    startTransition(async () => {
      await setBudgetAction(categoryId, val);
      setOpen(false);
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border border-curo-border bg-curo-background px-3 py-1 text-xs font-medium text-curo-text hover:bg-curo-muted-surface"
      >
        {currentLimit ? "Edit Budget" : "Set Limit"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-curo-border bg-curo-surface p-6 shadow-lg">
            <h3 className="text-lg font-medium text-curo-text mb-1">
              Set Monthly Limit for {categoryName}
            </h3>
            <p className="text-xs text-curo-text-secondary mb-6">
              You will receive overrun warnings on your dashboard when this
              threshold is crossed.
            </p>

            <form onSubmit={handleSubmit}>
              <label className="block text-xs font-medium text-curo-text-secondary mb-2">
                Monthly Budget Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 10000"
                className="w-full rounded-xl border border-curo-border bg-curo-background p-3 font-mono text-sm mb-6"
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-4 py-2 text-xs font-medium text-curo-text-secondary hover:text-curo-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full bg-curo-text px-5 py-2 text-xs font-medium text-curo-background hover:bg-curo-primary"
                >
                  {isPending ? "Saving..." : "Save Limit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

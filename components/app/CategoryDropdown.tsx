// components/app/CategoryDropdown.tsx
"use client";

import { useTransition } from "react";
import { updateTransactionCategoryAction } from "@/app/actions/transaction-actions";

interface CategoryDropdownProps {
  transactionId: string;
  currentCategoryId: string | null;
  categories: Array<{ id: string; name: string }>;
}

export function CategoryDropdown({
  transactionId,
  currentCategoryId,
  categories,
}: CategoryDropdownProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    startTransition(async () => {
      await updateTransactionCategoryAction(transactionId, newId);
    });
  };

  return (
    <select
      value={currentCategoryId || ""}
      onChange={handleChange}
      disabled={isPending}
      className="bg-curo-background/80 hover:bg-curo-muted-surface border border-curo-border/60 rounded-md px-2.5 py-1 text-xs font-medium text-curo-text transition-colors cursor-pointer disabled:opacity-50"
    >
      <option value="" disabled>
        Select category
      </option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

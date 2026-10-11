// app/actions/privacy-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/db/prisma";

/**
 * Exports complete backup of user transactions and accounts (GDPR/DPDP Compliant).
 */
export async function exportUserDataAction() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  const [user, transactions, budgets] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.transaction.findMany({ where: { userId } }),
    prisma.budget.findMany({ where: { userId } }),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    user: { name: user?.name, email: user?.email },
    transactionCount: transactions.length,
    transactions,
    budgets,
  };
}

/**
 * Permanent account & data wipe (Irreversible).
 */
export async function deleteUserDataAndAccountAction() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  // Cascade delete all user records
  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/");
  return { success: true };
}

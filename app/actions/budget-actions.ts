// app/actions/budget-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export async function setBudgetAction(categoryId: string, amount: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  await prisma.budget.upsert({
    where: {
      userId_categoryId_period: {
        userId,
        categoryId,
        period: "MONTHLY",
      },
    },
    update: { amount },
    create: {
      userId,
      categoryId,
      amount,
      period: "MONTHLY",
    },
  });

  revalidatePath("/budgets");
  revalidatePath("/dashboard");
  return { success: true };
}

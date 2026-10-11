// app/actions/transaction-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import {
  normalizeMerchant,
  generateDeduplicationHash,
} from "@/lib/finance/normalizer";
import { categorizeTransaction } from "@/lib/finance/categorizer";
import { ensureSystemCategories } from "@/lib/finance/categories";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

async function getOrCreatePrimaryAccount(userId: string) {
  let account = await prisma.financialAccount.findFirst({ where: { userId } });
  if (!account) {
    account = await prisma.financialAccount.create({
      data: {
        userId,
        institution: "Imported statements",
        accountName: "Primary",
        accountType: "SAVINGS",
        currency: "INR",
      },
    });
  }
  return account;
}

export async function importParsedCsvAction(
  rows: Array<{
    date: string;
    description: string;
    amount: number;
    type: "DEBIT" | "CREDIT";
  }>,
  filename = "Uploaded_Statement.csv",
) {
  const userId = await requireUserId();
  await ensureSystemCategories();
  const account = await getOrCreatePrimaryAccount(userId);

  const categories = await prisma.category.findMany({
    where: { OR: [{ isSystem: true }, { userId }] },
  });
  const bySlug = new Map(categories.map((c) => [c.slug, c.id]));

  const batch = await prisma.importBatch.create({
    data: {
      userId,
      filename,
      totalRows: rows.length,
      status: "PROCESSING",
    },
  });

  let success = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      if (!row.description || !row.date || !Number.isFinite(row.amount)) {
        failed++;
        continue;
      }

      const amount = Math.abs(Number(row.amount));
      const type = row.type === "CREDIT" ? "CREDIT" : "DEBIT";
      const dateStr = row.date.slice(0, 10);

      const { merchantName } = normalizeMerchant(row.description);
      const cat = categorizeTransaction(merchantName, row.description, type);
      const categoryId =
        bySlug.get(cat.categorySlug) ?? bySlug.get("other") ?? null;

      const deduplicationHash = generateDeduplicationHash(
        userId,
        dateStr,
        amount.toFixed(2),
        row.description,
      );

      await prisma.transaction.upsert({
        where: {
          userId_deduplicationHash: { userId, deduplicationHash },
        },
        update: {},
        create: {
          userId,
          financialAccountId: account.id,
          importBatchId: batch.id,
          categoryId,
          date: new Date(dateStr),
          amount,
          currency: "INR",
          type,
          description: row.description,
          normalizedMerchant: merchantName,
          confidenceScore: cat.confidenceScore,
          isReviewed: false,
          deduplicationHash,
        },
      });
      success++;
    } catch {
      failed++;
    }
  }

  await prisma.importBatch.update({
    where: { id: batch.id },
    data: {
      status: "COMPLETED",
      successfulRows: success,
      failedRows: failed,
      completedAt: new Date(),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/analytics");

  return { success: true, imported: success, failed, batchId: batch.id };
}

export async function updateTransactionCategoryAction(
  transactionId: string,
  newCategoryId: string,
) {
  const userId = await requireUserId();

  const tx = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
  });
  if (!tx) throw new Error("Transaction not found");

  await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      categoryId: newCategoryId,
      isReviewed: true,
      confidenceScore: 1,
    },
  });

  await prisma.userCategoryCorrection.create({
    data: {
      userId,
      transactionId,
      rawDescription: tx.description,
      oldCategoryId: tx.categoryId,
      newCategoryId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/analytics");
  return { success: true };
}

export async function deleteAllMyTransactionsAction() {
  const userId = await requireUserId();
  await prisma.transaction.deleteMany({ where: { userId } });
  await prisma.importBatch.deleteMany({ where: { userId } });
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return { success: true };
}

// tests/finance.test.ts
import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import {
  normalizeMerchant,
  generateDeduplicationHash,
} from "@/lib/finance/normalizer";
import { categorizeTransaction } from "@/lib/finance/categorizer";
import { calculateFinancialOverview } from "@/lib/finance/calculations";

describe("Curo Financial Normalizer & Deduplication", () => {
  it("cleans cryptic Indian UPI narrations to human-readable merchants", () => {
    const rawUpi = "UPI-SWIGGY-REST-PAY-BANGALORE-99128312";
    const result = normalizeMerchant(rawUpi);
    expect(result.merchantName).toBe("Swiggy");
  });

  it("normalizes quick-commerce vendors (Zepto, Blinkit)", () => {
    const zepto = "UPI-ZEPTO-BANGALORE-GROCERY-88";
    const blinkit = "UPI-BLINKIT-DELIVERY-DELHI-12";
    expect(normalizeMerchant(zepto).merchantName).toBe("Zepto");
    expect(normalizeMerchant(blinkit).merchantName).toBe("Blinkit");
  });

  it("generates idempotent SHA-256 deduplication hashes", () => {
    const userId = "user-123";
    const date = "2025-01-15";
    const amount = "340.00";
    const desc = "UPI-SWIGGY-REST-PAY";

    const hash1 = generateDeduplicationHash(userId, date, amount, desc);
    const hash2 = generateDeduplicationHash(userId, date, amount, desc);
    const hashDifferentUser = generateDeduplicationHash(
      "user-456",
      date,
      amount,
      desc,
    );

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hashDifferentUser);
    expect(hash1).toHaveLength(64); // Valid SHA-256 string
  });
});

describe("Curo Categorization Engine Baseline", () => {
  it("categorizes food and grocery merchants accurately", () => {
    const swiggy = categorizeTransaction(
      "Swiggy",
      "UPI-SWIGGY-REST-PAY",
      "DEBIT",
    );
    const zepto = categorizeTransaction("Zepto", "UPI-ZEPTO-GROCERY", "DEBIT");

    expect(swiggy.categorySlug).toBe("food-dining");
    expect(swiggy.confidenceScore).toBeGreaterThanOrEqual(0.9);

    expect(zepto.categorySlug).toBe("groceries");
    expect(zepto.confidenceScore).toBeGreaterThanOrEqual(0.9);
  });

  it("handles income credits correctly", () => {
    const salary = categorizeTransaction(
      "ACME Corp",
      "ACH-ACME-SALARY-CREDIT",
      "CREDIT",
    );
    expect(salary.categorySlug).toBe("income");
    expect(salary.confidenceScore).toBeGreaterThanOrEqual(0.9);
  });
});

describe("Curo Precision Financial Calculation Engine", () => {
  it("calculates exact income, expense, and net cash flow with Decimal arithmetic", () => {
    const transactions = [
      {
        amount: "85000.00",
        type: "CREDIT" as const,
        category: { slug: "income", name: "Salary", colorHex: "#4A7057" },
      },
      {
        amount: "22000.00",
        type: "DEBIT" as const,
        category: { slug: "housing", name: "Housing", colorHex: "#3C3C3C" },
      },
      {
        amount: "340.50",
        type: "DEBIT" as const,
        category: {
          slug: "food-dining",
          name: "Food & Dining",
          colorHex: "#4A7057",
        },
      },
      {
        amount: "485.50",
        type: "DEBIT" as const,
        category: { slug: "groceries", name: "Groceries", colorHex: "#8CA68F" },
      },
    ];

    const overview = calculateFinancialOverview(transactions);

    expect(overview.totalIncome.toString()).toBe("85000");
    expect(overview.totalExpenses.toString()).toBe("22826");
    expect(overview.netCashFlow.toString()).toBe("62174");
    expect(overview.savingsRate).toBeGreaterThan(70);
  });

  it("avoids JavaScript floating point drift (0.1 + 0.2 precision problem)", () => {
    const floatDriftTxs = [
      { amount: "0.10", type: "DEBIT" as const },
      { amount: "0.20", type: "DEBIT" as const },
    ];

    const overview = calculateFinancialOverview(floatDriftTxs);
    expect(overview.totalExpenses.toString()).toBe("0.3"); // Not 0.30000000000000004
  });
});

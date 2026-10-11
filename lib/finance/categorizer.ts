// lib/finance/categorizer.ts

export interface CategorizationResult {
  categorySlug: string;
  confidenceScore: number;
}

/**
 * High-precision rule engine for Indian financial transactions.
 * Returns default categories with confidence scores (0.0 to 1.0).
 */
export function categorizeTransaction(
  merchantName: string,
  rawDescription: string,
  type: "DEBIT" | "CREDIT",
): CategorizationResult {
  if (type === "CREDIT") {
    if (/SALARY|ACME|INCOME|PAYROLL/i.test(rawDescription)) {
      return { categorySlug: "income", confidenceScore: 0.98 };
    }
    if (/REFUND|CASHBACK|REVERSAL/i.test(rawDescription)) {
      return { categorySlug: "other", confidenceScore: 0.85 };
    }
    return { categorySlug: "income", confidenceScore: 0.7 };
  }

  const desc = `${merchantName} ${rawDescription}`.toLowerCase();

  // Rule match mappings
  if (
    /swiggy|zomato|starbucks|coffee|restaurant|dine|eat|mcdonald|kfc|domino|burger/i.test(
      desc,
    )
  ) {
    return { categorySlug: "food-dining", confidenceScore: 0.95 };
  }

  if (
    /zepto|blinkit|grofers|bigbasket|instamart|grocery|supermarket|more retail|nature/i.test(
      desc,
    )
  ) {
    return { categorySlug: "groceries", confidenceScore: 0.95 };
  }

  if (
    /uber|ola|rapido|namma yatri|metro|petrol|fuel|shell|hpcl|bpcl|irctc/i.test(
      desc,
    )
  ) {
    return { categorySlug: "transport", confidenceScore: 0.92 };
  }

  if (/nobroker|rent|landlord|housing|maintenance/i.test(desc)) {
    return { categorySlug: "housing", confidenceScore: 0.95 };
  }

  if (
    /airtel|jio|electricity|bescom|bescom|gas|water|broadband|wifi/i.test(desc)
  ) {
    return { categorySlug: "utilities", confidenceScore: 0.92 };
  }

  if (
    /netflix|spotify|youtube|apple|hotstar|prime video|cult\.fit|gym/i.test(
      desc,
    )
  ) {
    return { categorySlug: "subscriptions", confidenceScore: 0.96 };
  }

  if (
    /amazon|flipkart|myntra|zara|uniqlo|retail|shopping|decathlon/i.test(desc)
  ) {
    return { categorySlug: "shopping", confidenceScore: 0.88 };
  }

  if (/zerodha|groww|indmoney|sip|mutual fund|smallcase|coins/i.test(desc)) {
    return { categorySlug: "investments", confidenceScore: 0.95 };
  }

  if (/pharmacy|apollo|1mg|practo|hospital|clinic|doctor|medplus/i.test(desc)) {
    return { categorySlug: "healthcare", confidenceScore: 0.92 };
  }

  return { categorySlug: "other", confidenceScore: 0.4 };
}

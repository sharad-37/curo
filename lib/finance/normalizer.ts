// lib/finance/normalizer.ts
import crypto from "crypto";

export interface NormalizedTransactionInput {
  rawDescription: string;
  dateStr: string; // ISO date string YYYY-MM-DD
  amount: number | string;
  type: "DEBIT" | "CREDIT";
}

export interface CleanedMerchantResult {
  merchantName: string;
  cleanDescription: string;
}

/**
 * Normalizes Indian bank statement description strings (UPI, ACH, NEFT, IMPS, Card).
 * Example: "UPI-SWIGGY-REST-PAY-BANGALORE-9912" -> "Swiggy"
 */
export function normalizeMerchant(
  rawDescription: string,
): CleanedMerchantResult {
  const desc = rawDescription.trim();
  const upper = desc.toUpperCase();

  // Known Indian Merchant Patterns
  const merchantRules: Array<{ pattern: RegExp; name: string }> = [
    { pattern: /SWIGGY/i, name: "Swiggy" },
    { pattern: /ZOMATO/i, name: "Zomato" },
    { pattern: /ZEPTO/i, name: "Zepto" },
    { pattern: /BLINKIT|GROFERS/i, name: "Blinkit" },
    { pattern: /BIGBASKET/i, name: "BigBasket" },
    { pattern: /INSTAMART/i, name: "Swiggy Instamart" },
    { pattern: /UBER/i, name: "Uber" },
    { pattern: /OLA\s*CABS/i, name: "Ola" },
    { pattern: /NAMMA\s*YATRI|YATRI/i, name: "Namma Yatri" },
    { pattern: /RAPIDO/i, name: "Rapido" },
    { pattern: /AMAZON|AMZN/i, name: "Amazon India" },
    { pattern: /FLIPKART/i, name: "Flipkart" },
    { pattern: /MYNTRA/i, name: "Myntra" },
    { pattern: /NOBROKER/i, name: "NoBroker" },
    { pattern: /CRED/i, name: "CRED" },
    { pattern: /NETFLIX/i, name: "Netflix" },
    { pattern: /SPOTIFY/i, name: "Spotify" },
    { pattern: /PRIME\s*VIDEO|AMAZON\s*PRIME/i, name: "Amazon Prime" },
    { pattern: /HOTSTAR|DISNEY/i, name: "Disney+ Hotstar" },
    { pattern: /ZERODHA/i, name: "Zerodha" },
    { pattern: /GROWW/i, name: "Groww" },
    { pattern: /INDMONEY/i, name: "INDmoney" },
    { pattern: /PAYTM/i, name: "Paytm" },
    { pattern: /PHONEPE/i, name: "PhonePe" },
    { pattern: /AIRTEL|AIRTELXSTREAM/i, name: "Airtel" },
    { pattern: /JIO|JIOPAY/i, name: "Jio" },
    { pattern: /CULT\.FIT|CULTFIT/i, name: "Cult.fit" },
    { pattern: /STARBUCKS/i, name: "Starbucks" },
    { pattern: /THIRD\s*WAVE/i, name: "Third Wave Coffee" },
    { pattern: /SALARY|ACH.*SALARY/i, name: "Salary Income" },
  ];

  for (const rule of merchantRules) {
    if (rule.pattern.test(desc)) {
      return {
        merchantName: rule.name,
        cleanDescription: `${rule.name} (${desc.slice(0, 30)})`,
      };
    }
  }

  // Fallback: Strip common prefix noise (UPI/, NEFT-, ACH-, POS-)
  let cleaned = upper
    .replace(/^(UPI|NEFT|IMPS|ACH|POS|CARD|INF|TRANSFER)[-/\s]+/, "")
    .replace(
      /[-/\s]+(BANGALORE|BENGALURU|MUMBAI|DELHI|GURGAON|HYDERABAD|PUNE|IN|INDIA).*$/,
      "",
    )
    .replace(/[0-9]{6,}/g, "") // Strip transaction reference numbers
    .trim();

  // Capitalize Title Case
  cleaned = cleaned
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    merchantName: cleaned || "Unknown Merchant",
    cleanDescription: desc,
  };
}

/**
 * Computes an idempotent SHA-256 hash for deduplication.
 * Prevents identical transactions from being ingested twice across imports.
 */
export function generateDeduplicationHash(
  userId: string,
  dateStr: string,
  amount: string,
  rawDescription: string,
): string {
  const payload = `${userId}:${dateStr}:${parseFloat(amount).toFixed(2)}:${rawDescription.trim().toLowerCase()}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

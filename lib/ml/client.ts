// lib/ml/client.ts
import { categorizeTransaction } from "@/lib/finance/categorizer";

const PYTHON_ML_URL =
  process.env.PYTHON_ML_SERVICE_URL || "http://127.0.0.1:8000";

export interface MLPrediction {
  categorySlug: string;
  confidenceScore: number;
  isLowConfidence: boolean;
}

/**
 * Calls the Python FastAPI ML microservice.
 * Automatically falls back to deterministic rule engine if service is offline.
 */
export function classifyWithML(
  description: string,
  merchant: string,
  amount: number,
  type: "DEBIT" | "CREDIT",
): Promise<MLPrediction> {
  return fetch(`${PYTHON_ML_URL}/api/v1/categorize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, merchant, amount, type }),
    signal: AbortSignal.timeout(1500), // 1.5s fast timeout
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("ML service error");
      const data = await res.json();
      return {
        categorySlug: data.category_slug,
        confidenceScore: data.confidence_score,
        isLowConfidence: data.is_low_confidence,
      };
    })
    .catch(() => {
      // Deterministic Fallback
      const fallback = categorizeTransaction(merchant, description, type);
      return {
        categorySlug: fallback.categorySlug,
        confidenceScore: fallback.confidenceScore,
        isLowConfidence: fallback.confidenceScore < 0.6,
      };
    });
}

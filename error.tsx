// app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, log to Sentry or Datadog here
    console.error("Curo Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F1EEE9] px-6 text-[#3C3C3C]">
      <Logo variant="symbol" className="mb-8 h-12 w-12 text-[#B87070]" />

      <div className="flex items-center gap-2 text-[#B87070] mb-4">
        <AlertTriangle size={20} />
        <h2 className="text-sm font-medium uppercase tracking-widest">
          System Error
        </h2>
      </div>

      <h1 className="mb-4 text-3xl font-light text-center">
        Something went wrong.
      </h1>

      <p className="mb-10 max-w-md text-center text-sm text-[#6B6560]">
        A technical issue prevented this page from loading. Your financial data
        remains secure.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 rounded-full bg-[#3C3C3C] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4A7057]"
        >
          <RefreshCcw size={16} />
          Try again
        </button>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-full border border-[#D7D1C7] px-6 py-2.5 text-sm font-medium transition-colors hover:bg-[#E7E2DA]"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

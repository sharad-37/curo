// components/marketing/CookieBanner.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("curo-cookie-consent");
    if (!consent) setIsVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("curo-cookie-consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:bottom-8 md:left-8 md:right-auto md:max-w-sm rounded-xl border border-[#D7D1C7] bg-[#F1EEE9] p-5 shadow-lg">
      <div className="flex items-start justify-between">
        <p className="text-xs text-[#6B6560] leading-relaxed pr-4">
          We use strictly necessary cookies to keep your session secure.
          Analytics are anonymized. Read our{" "}
          <Link href="/privacy" className="underline hover:text-[#3C3C3C]">
            Privacy Policy
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="text-[#9B9590] hover:text-[#3C3C3C]"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          onClick={accept}
          className="rounded-full bg-[#3C3C3C] px-4 py-2 text-xs font-medium text-white hover:bg-[#4A7057]"
        >
          Accept & Close
        </button>
      </div>
    </div>
  );
}

// components/marketing/Footer.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("You're on the list. Quiet updates only.");
    setEmail("");
  };

  return (
    /* Full-bleed dark shell (Astralis navy → Curo charcoal) */
    <footer className="w-full bg-[#2F2F2F] px-3 pb-3 pt-8 sm:px-5 sm:pb-5 sm:pt-12 lg:px-8 lg:pb-8 lg:pt-16">
      {/* Floating white card */}
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[24px] bg-[#FFFCFA] text-[#3C3C3C] shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:rounded-[32px]">
        {/* ── TOP: 4 columns ── */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 px-6 py-10 sm:px-10 sm:py-12 md:grid-cols-4 lg:gap-x-12 lg:px-14 lg:py-14">
          {/* Brand statement */}
          <div className="col-span-2 md:col-span-1">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#9B9590]">
              Brand statement
            </p>
            <p className="mb-4 text-[13px] leading-[1.65] text-[#5C5854]">
              A calm financial intelligence layer for modern India — clarity
              through patterns, not noise.
            </p>
            <p className="text-[13px] leading-[1.65] text-[#5C5854]">
              Private by design. Evidence over guesswork. Built for how you
              actually spend.
            </p>

            <div className="mt-8 flex items-center gap-5">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="text-[#7A7570] transition-colors hover:text-[#4A7057]"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="text-[#7A7570] transition-colors hover:text-[#4A7057]"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-[#7A7570] transition-colors hover:text-[#4A7057]"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#9B9590]">
              Navigation
            </p>
            <ul className="space-y-2.5 text-[13px] text-[#5C5854]">
              {[
                ["Product", "/#product"],
                ["Features", "/#features"],
                ["How it works", "/#how"],
                ["Privacy", "/privacy"],
                ["Terms", "/terms"],
                ["Contact", "mailto:hello@curo.money"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="transition-colors hover:text-[#3C3C3C]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Intelligence / Collections equivalent */}
          <div>
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#9B9590]">
              Intelligence
            </p>
            <ul className="space-y-2.5 text-[13px] text-[#5C5854]">
              {[
                ["Dashboard", "/dashboard"],
                ["Transactions", "/transactions"],
                ["Analytics", "/analytics"],
                ["Budgets", "/budgets"],
                ["Subscriptions", "/recurring"],
                ["Import CSV", "/transactions/import"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="transition-colors hover:text-[#3C3C3C]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Join */}
          <div className="col-span-2 md:col-span-1">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#9B9590]">
              Stay in the loop
            </p>
            <form onSubmit={handleSubscribe} className="mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="min-w-0 flex-1 rounded-full border border-[#D7D1C7] bg-white px-4 py-2.5 text-[13px] text-[#3C3C3C] outline-none placeholder:text-[#9B9590] focus:border-[#4A7057]"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-[#3C3C3C] px-4 py-2.5 text-[13px] font-medium text-[#FFFCFA] transition-colors hover:bg-[#4A7057]"
                >
                  Join
                </button>
              </div>
            </form>
            <p className="text-[13px] leading-[1.65] text-[#5C5854]">
              Product notes on money clarity. No spam — ever.
            </p>
            <a
              href="mailto:hello@curo.money"
              className="mt-4 inline-block text-[13px] font-medium text-[#4A7057] hover:underline"
            >
              hello@curo.money
            </a>
          </div>
        </div>

        {/* ── HUGE BRAND LOCKUP (Astralis-style) ── */}
        <div className="border-t border-[#E8E2DA] px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <Link
            href="/"
            className="group flex items-center gap-3 sm:gap-5"
            aria-label="Curo home"
          >
            {/* Leaf mark — scaled large like the Astralis horse */}
            <Logo
              variant="symbol"
              className="h-[clamp(3.5rem,10vw,7rem)] w-[clamp(3.5rem,10vw,7rem)] shrink-0 transition-opacity group-hover:opacity-80"
            />
            {/* Oversized wordmark */}
            <span
              className="select-none font-medium leading-none tracking-[-0.05em] text-[#2A2A2A] transition-opacity group-hover:opacity-80"
              style={{
                fontSize: "clamp(3.75rem, 14vw, 9rem)",
                fontFamily: "Switzer, var(--font-sans), system-ui, sans-serif",
                fontWeight: 500,
              }}
            >
              curo
            </span>
          </Link>
        </div>

        {/* ── BOTTOM LEGAL BAR ── */}
        <div className="flex flex-col gap-2 border-t border-[#E8E2DA] px-6 py-4 text-[11px] text-[#9B9590] sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
          <p>© {year} Curo. Designed for financial clarity.</p>
          <p className="sm:text-right">
            Private intelligence for modern India — no bank logins, no noise.
          </p>
        </div>
      </div>
    </footer>
  );
}

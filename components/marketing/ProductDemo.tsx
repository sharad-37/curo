// components/marketing/ProductDemo.tsx
"use client";

import { motion } from "motion/react";
import { FadeIn } from "@/components/motion/FadeIn";
import { formatINR } from "@/lib/utils/format";

const demoTransactions = [
  {
    merchant: "Swiggy",
    category: "Food & Dining",
    amount: 340,
    color: "#4A7057",
  },
  { merchant: "Zepto", category: "Groceries", amount: 485, color: "#8CA68F" },
  { merchant: "Uber", category: "Transport", amount: 320, color: "#C4956A" },
  {
    merchant: "Netflix",
    category: "Subscriptions",
    amount: 649,
    color: "#B87070",
  },
  { merchant: "Amazon", category: "Shopping", amount: 4500, color: "#9B9590" },
];

export function ProductDemo() {
  return (
    <section id="product" className="bg-curo-muted-surface/30 py-32 lg:py-48">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-24 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <FadeIn className="lg:col-span-3">
            <span className="text-label text-curo-text-secondary">
              In practice
            </span>
          </FadeIn>
          <div className="lg:col-span-9 lg:col-start-4">
            <FadeIn>
              <h2 className="text-display-lg text-curo-text">
                <span className="block">Raw statements become</span>
                <span className="block font-light italic text-curo-primary">
                  a clear picture.
                </span>
              </h2>
            </FadeIn>
          </div>
        </div>

        <FadeIn delay={0.15}>
          <div className="relative overflow-hidden rounded-2xl border border-curo-border/50 bg-curo-surface shadow-lg">
            <div className="flex items-center justify-between border-b border-curo-border/50 p-8 lg:p-12">
              <div>
                <p className="text-label text-curo-text-muted">January 2025</p>
                <p className="mt-2 text-3xl font-light tabular-nums text-curo-text">
                  {formatINR(42850, { showDecimals: true })}
                </p>
                <p className="mt-1 text-sm text-curo-text-secondary">
                  Total spending
                </p>
              </div>
              <div className="hidden md:block">
                <span className="inline-flex items-center gap-2 rounded-full bg-curo-primary-light px-3 py-1.5 text-xs font-medium text-curo-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-curo-primary" />
                  Demo data
                </span>
              </div>
            </div>

            <div className="p-8 lg:p-12">
              <p className="mb-6 text-label text-curo-text-muted">
                Automatically categorized
              </p>
              <div className="space-y-1">
                {demoTransactions.map((tx, i) => (
                  <motion.div
                    key={tx.merchant}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      delay: i * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-center justify-between border-b border-curo-border/30 py-4 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-white"
                        style={{ backgroundColor: tx.color }}
                      >
                        {tx.merchant.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-curo-text">
                          {tx.merchant}
                        </p>
                        <p className="text-xs text-curo-text-secondary">
                          {tx.category}
                        </p>
                      </div>
                    </div>
                    <p className="font-mono text-sm tabular-nums text-curo-text">
                      −{formatINR(tx.amount, { showDecimals: true })}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

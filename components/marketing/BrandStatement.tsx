// components/marketing/BrandStatement.tsx
"use client";

import { FadeIn } from "@/components/motion/FadeIn";

export function BrandStatement() {
  return (
    <section className="border-t border-curo-border/50 py-32 lg:py-48">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <FadeIn className="lg:col-span-3">
            <span className="text-label text-curo-text-secondary">
              Our Philosophy
            </span>
          </FadeIn>

          <div className="lg:col-span-9 lg:col-start-4">
            <FadeIn>
              <h2 className="text-display-md text-curo-text">
                <span className="block">
                  Most finance apps show you numbers.
                </span>
                <span className="mt-2 block font-light italic text-curo-text-secondary">
                  Curo shows you meaning.
                </span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.15} className="mt-16 grid gap-10 md:grid-cols-2">
              <p className="text-body-md text-curo-text-secondary">
                Your bank statement is a transcript of your life — your morning
                chai, your Zepto groceries, the subscription you forgot about
                three months ago. But raw transactions are noise.
              </p>
              <p className="text-body-md text-curo-text-secondary">
                Curo listens to the patterns. It tells you where your money
                actually went, which commitments repeat, and what tomorrow is
                likely to cost — in plain language, with evidence.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

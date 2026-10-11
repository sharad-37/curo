// components/marketing/Features.tsx
"use client";

import { FadeIn } from "@/components/motion/FadeIn";
import { Sparkles, LineChart, Target, Repeat } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI categorization",
    description:
      "Transactions sorted automatically into clear categories — groceries, rent, subscriptions, that late-night Swiggy order.",
    detail: "Trained on Indian transaction patterns.",
  },
  {
    icon: LineChart,
    title: "Pattern recognition",
    description:
      "See where your money shifts month over month. Understand why this month felt tighter than last.",
    detail: "Evidence-based, not vibes.",
  },
  {
    icon: Repeat,
    title: "Recurring intelligence",
    description:
      "Detect subscriptions and fixed commitments you forgot about. Review what you're actually paying for.",
    detail: "Catches hidden Netflix, iCloud, gym fees.",
  },
  {
    icon: Target,
    title: "Honest forecasts",
    description:
      "Projections for month-end spending based on your actual history — never promises, always evidence.",
    detail: "With clear uncertainty.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-32 lg:py-48">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-24 grid grid-cols-1 gap-8 lg:mb-32 lg:grid-cols-12">
          <FadeIn className="lg:col-span-3">
            <span className="text-label text-curo-text-secondary">
              What Curo does
            </span>
          </FadeIn>
          <div className="lg:col-span-7 lg:col-start-4">
            <FadeIn>
              <h2 className="text-display-lg text-curo-text">
                <span className="block">Four quiet systems,</span>
                <span className="block font-light italic text-curo-primary">
                  working together.
                </span>
              </h2>
            </FadeIn>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-curo-border/50 bg-curo-border/50 md:grid-cols-2">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.08}>
              <div className="group h-full bg-curo-background p-10 transition-colors duration-500 hover:bg-curo-muted-surface/40 lg:p-14">
                <feature.icon
                  size={24}
                  className="mb-10 text-curo-primary"
                  strokeWidth={1.5}
                />
                <h3 className="mb-4 text-2xl font-normal tracking-tight text-curo-text">
                  {feature.title}
                </h3>
                <p className="mb-6 max-w-md text-curo-text-secondary">
                  {feature.description}
                </p>
                <p className="text-label text-curo-text-muted">
                  {feature.detail}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

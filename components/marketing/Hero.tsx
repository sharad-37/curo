// components/marketing/Hero.tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.8,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <section className="relative flex min-h-screen flex-col justify-end overflow-hidden pb-20 pt-32 lg:pb-32">
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
        {/* Top label */}
        <motion.div
          {...fadeUp(0.1)}
          className="mb-16 flex items-center gap-3 lg:mb-24"
        >
          <div className="h-px w-12 bg-curo-text" />
          <span className="text-label text-curo-text-secondary">
            Financial Intelligence · Est. 2025
          </span>
        </motion.div>

        {/* Hero headline */}
        <div className="max-w-[1100px]">
          <motion.h1
            {...fadeUp(0.2)}
            className="text-display-xl text-curo-text"
          >
            <span className="block">Your money</span>
            <span className="block font-light italic text-curo-primary">
              has a story.
            </span>
            <span className="block">Let&apos;s make</span>
            <span className="block">sense of it.</span>
          </motion.h1>
        </div>

        {/* Supporting content */}
        <div className="mt-16 grid grid-cols-1 items-end gap-8 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          <motion.div
            {...fadeUp(0.45)}
            className="lg:col-span-5 lg:col-start-7"
          >
            <p className="text-body-lg max-w-md text-curo-text-secondary">
              Understand your spending, anticipate upcoming expenses, and make
              more confident financial decisions with AI-powered insights built
              for how you actually spend.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-curo-text px-7 py-4 text-sm font-medium text-curo-background transition-all hover:bg-curo-primary"
              >
                Explore your finances
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="#how"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-curo-border px-7 py-4 text-sm font-medium text-curo-text transition-colors hover:bg-curo-muted-surface"
              >
                See how it works
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative scroll indicator - Restored */}
      <motion.div
        {...fadeUp(0.8)}
        className="absolute bottom-10 right-10 hidden flex-col items-center gap-3 lg:flex"
      >
        <span className="origin-center rotate-90 text-label text-curo-text-muted">
          Scroll
        </span>
        <motion.div
          className="h-16 w-px bg-curo-border"
          animate={{ scaleY: prefersReducedMotion ? 1 : [0.3, 1, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}

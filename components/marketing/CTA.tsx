// components/marketing/CTA.tsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

export function CTA() {
  return (
    <section className="bg-curo-text py-32 text-curo-background lg:py-48">
      <div className="mx-auto max-w-[1400px] px-6 text-center lg:px-10">
        <FadeIn>
          <h2 className="text-display-xl mx-auto max-w-4xl font-light">
            <span className="block">Understand</span>
            <span className="block italic text-curo-secondary">
              your money.
            </span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="text-body-lg mx-auto mt-12 max-w-xl text-curo-background/70">
            Free to start. No credit card. No bank login. Just drop a statement.
          </p>

          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-curo-background px-8 py-4 text-sm font-medium text-curo-text transition-all hover:bg-curo-secondary hover:text-curo-background"
            >
              Get started free
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

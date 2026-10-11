// components/marketing/Privacy.tsx
"use client";

import { Shield, Lock, FileText, Trash2 } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

const principles = [
  {
    icon: Shield,
    title: "No bank logins",
    description:
      "We never ask for your bank credentials. Upload a statement file — nothing more.",
  },
  {
    icon: Lock,
    title: "Encrypted at rest",
    description:
      "Your financial data is encrypted and isolated per user. We never share or sell it.",
  },
  {
    icon: FileText,
    title: "Minimal AI exposure",
    description:
      "Only aggregated, anonymized data touches AI models. Your transaction details stay local.",
  },
  {
    icon: Trash2,
    title: "Delete anytime",
    description:
      "Full data export and permanent deletion are one click away in settings.",
  },
];

export function Privacy() {
  return (
    <section className="border-t border-curo-border/50 py-32 lg:py-48">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-24 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <FadeIn className="lg:col-span-3">
            <span className="text-label text-curo-text-secondary">
              Privacy by design
            </span>
          </FadeIn>
          <div className="lg:col-span-9 lg:col-start-4">
            <FadeIn>
              <h2 className="text-display-lg text-curo-text">
                <span className="block">Financial data is</span>
                <span className="block font-light italic text-curo-primary">
                  the most personal data.
                </span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="text-body-md mt-8 max-w-xl text-curo-text-secondary">
                We built Curo for the India where privacy breaches have real
                consequences. These are our commitments.
              </p>
            </FadeIn>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.08}>
              <div className="h-full">
                <p.icon
                  size={24}
                  strokeWidth={1.5}
                  className="mb-6 text-curo-primary"
                />
                <h3 className="mb-3 text-lg font-medium text-curo-text">
                  {p.title}
                </h3>
                <p className="text-sm text-curo-text-secondary">
                  {p.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

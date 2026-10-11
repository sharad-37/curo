// components/marketing/Nav.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Privacy", href: "/privacy" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[100] transition-all duration-300",
        scrolled
          ? "border-b border-[#D7D1C7]/60 bg-[#F1EEE9]/90 backdrop-blur-md"
          : "border-b border-transparent bg-[#F1EEE9]/80 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:h-20 lg:px-10">
        <Link
          href="/"
          className="relative z-[101] flex items-center"
          aria-label="Curo home"
        >
          <Logo variant="full" className="h-7 w-auto lg:h-8" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#6B6560] transition-colors hover:text-[#3C3C3C]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="px-3 py-2 text-sm font-medium text-[#6B6560] transition-colors hover:text-[#3C3C3C]"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#3C3C3C] px-5 py-2.5 text-sm font-medium text-[#F1EEE9] transition-colors hover:bg-[#4A7057]"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          className="relative z-[101] rounded-md p-2 text-[#3C3C3C] md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#D7D1C7] bg-[#F1EEE9] px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg text-[#3C3C3C]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="pt-2 text-[#6B6560]"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="rounded-full bg-[#3C3C3C] px-5 py-3 text-center text-sm font-medium text-[#F1EEE9]"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

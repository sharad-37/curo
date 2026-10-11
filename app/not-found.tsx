// app/not-found.tsx
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F1EEE9] px-6 text-center text-[#3C3C3C]">
      <Logo variant="symbol" className="mb-8 h-16 w-16 opacity-50" />
      <h1 className="mb-2 font-mono text-sm font-medium tracking-widest text-[#9B9590] uppercase">
        404 — Not Found
      </h1>
      <h2 className="mb-6 text-5xl font-light tracking-tight sm:text-7xl">
        Lost in the ledger.
      </h2>
      <p className="mb-10 max-w-md text-lg text-[#6B6560]">
        We couldn't find the page you're looking for. It might have been moved
        or deleted.
      </p>
      <Link
        href="/"
        className="rounded-full bg-[#3C3C3C] px-8 py-3.5 text-sm font-medium text-[#F1EEE9] transition-colors hover:bg-[#4A7057]"
      >
        Return to Home
      </Link>
    </div>
  );
}

// app/(auth)/signup/page.tsx
import Link from "next/link";
import { signIn } from "@/auth";
import { Logo } from "@/components/brand/Logo";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your Curo financial dashboard.",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-curo-background p-6">
      <div className="w-full max-w-md rounded-2xl border border-curo-border bg-curo-surface p-8 sm:p-10 shadow-sm">
        {/* Brand Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <Link href="/">
            <Logo variant="full" className="mb-6 h-9 w-auto" />
          </Link>
          <h1 className="text-2xl font-light text-curo-text">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-curo-text-secondary">
            Understand your money with clear, evidence-based AI insights.
          </p>
        </div>

        {/* Real GitHub OAuth Registration */}
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-full bg-curo-primary py-3.5 text-sm font-medium text-curo-surface transition-all hover:bg-curo-primary-hover"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            Sign up with GitHub
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-curo-text-muted">
          By signing up, you agree to Curo&apos;s{" "}
          <Link href="/privacy" className="underline hover:text-curo-text">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="underline hover:text-curo-text">
            Terms of Service
          </Link>
          .
        </p>

        <div className="mt-8 border-t border-curo-border/60 pt-6 text-center">
          <p className="text-xs text-curo-text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-curo-text underline hover:text-curo-primary"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

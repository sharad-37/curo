// app/layout.tsx
import type { Metadata } from "next";
import { Toaster } from "sonner"; // Beautiful success/error messages
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Curo — Your money, understood.",
    template: "%s | Curo",
  },
  description:
    "AI-powered financial intelligence. Understand your spending and make confident decisions.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      {/* overflow-x-hidden prevents mobile horizontal scroll glitches */}
      <body className="min-h-screen max-w-[100vw] overflow-x-hidden bg-[#F1EEE9] text-[#3C3C3C] antialiased">
        {children}
        {/* Global Success/Error Toast Provider */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: "#3C3C3C", color: "#F1EEE9", border: "none" },
          }}
        />
      </body>
    </html>
  );
}

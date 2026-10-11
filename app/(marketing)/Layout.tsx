// app/(marketing)/layout.tsx
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F1EEE9]">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

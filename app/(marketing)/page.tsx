// app/(marketing)/page.tsx
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/Hero";
import { BrandStatement } from "@/components/marketing/BrandStatement";
import { ProductDemo } from "@/components/marketing/ProductDemo";
import { Features } from "@/components/marketing/Features";
import { Privacy } from "@/components/marketing/Privacy";
import { CTA } from "@/components/marketing/CTA";
import { CookieBanner } from "@/components/marketing/CookieBanner";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F1EEE9] text-[#3C3C3C]">
      {/* 1. Header Navigation */}
      <Nav />

      {/* 2. Main Editorial Sections */}
      <main>
        <Hero />
        <BrandStatement />
        <ProductDemo />
        <Features />
        <Privacy />
        <CTA />
      </main>

      {/* 3. Footer */}
      <CookieBanner />
      <Footer />
      {/* Sticky Mobile CTA (Only visible on small screens when scrolling past hero) */}
      <div className="fixed bottom-4 left-4 right-4 z-[90] md:hidden">
        <a
          href="/signup"
          className="flex w-full items-center justify-center rounded-full bg-[#4A7057] py-4 text-sm font-medium text-white shadow-xl hover:bg-[#3A5A45]"
        >
          Get started for free
        </a>
      </div>
    </div>
  );
}

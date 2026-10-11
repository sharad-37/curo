// lib/finance/categories.ts
import { prisma } from "@/lib/db/prisma";

export const SYSTEM_CATEGORIES = [
  {
    name: "Food & Dining",
    slug: "food-dining",
    icon: "Utensils",
    colorHex: "#4A7057",
  },
  {
    name: "Groceries",
    slug: "groceries",
    icon: "ShoppingBag",
    colorHex: "#8CA68F",
  },
  { name: "Transport", slug: "transport", icon: "Car", colorHex: "#C4956A" },
  {
    name: "Housing & Rent",
    slug: "housing",
    icon: "Home",
    colorHex: "#3C3C3C",
  },
  {
    name: "Utilities & Bills",
    slug: "utilities",
    icon: "Zap",
    colorHex: "#6B6560",
  },
  { name: "Shopping", slug: "shopping", icon: "Package", colorHex: "#9B9590" },
  {
    name: "Subscriptions",
    slug: "subscriptions",
    icon: "Film",
    colorHex: "#B87070",
  },
  {
    name: "Healthcare",
    slug: "healthcare",
    icon: "Activity",
    colorHex: "#7A9E7E",
  },
  {
    name: "Education",
    slug: "education",
    icon: "BookOpen",
    colorHex: "#3D5A80",
  },
  {
    name: "Income",
    slug: "income",
    icon: "ArrowDownLeft",
    colorHex: "#4A7057",
  },
  {
    name: "Investments",
    slug: "investments",
    icon: "TrendingUp",
    colorHex: "#3D5A80",
  },
  {
    name: "Transfers",
    slug: "transfers",
    icon: "ArrowLeftRight",
    colorHex: "#9B9590",
  },
  { name: "Other", slug: "other", icon: "HelpCircle", colorHex: "#D7D1C7" },
] as const;

export async function ensureSystemCategories() {
  for (const cat of SYSTEM_CATEGORIES) {
    const existing = await prisma.category.findFirst({
      where: { slug: cat.slug, isSystem: true },
    });
    if (!existing) {
      await prisma.category.create({
        data: {
          userId: null,
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          colorHex: cat.colorHex,
          isSystem: true,
        },
      });
    }
  }
}

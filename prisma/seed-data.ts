// prisma/seed-data.ts

export const DEFAULT_SYSTEM_CATEGORIES = [
  {
    name: "Food & Dining",
    slug: "food-dining",
    icon: "Utensils",
    colorHex: "#4A7057",
  },
  {
    name: "Groceries & Quick-Commerce",
    slug: "groceries",
    icon: "ShoppingBag",
    colorHex: "#8CA68F",
  },
  {
    name: "Transport & Commute",
    slug: "transport",
    icon: "Car",
    colorHex: "#C4956A",
  },
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
  {
    name: "Shopping & E-Commerce",
    slug: "shopping",
    icon: "Package",
    colorHex: "#9B9590",
  },
  {
    name: "Entertainment & Subscriptions",
    slug: "subscriptions",
    icon: "Film",
    colorHex: "#B87070",
  },
  {
    name: "Health & Fitness",
    slug: "healthcare",
    icon: "Activity",
    colorHex: "#7A9E7E",
  },
  {
    name: "Salary & Income",
    slug: "income",
    icon: "ArrowDownLeft",
    colorHex: "#4A7057",
  },
  {
    name: "Investments & Savings",
    slug: "investments",
    icon: "TrendingUp",
    colorHex: "#3D5A80",
  },
  {
    name: "Other & Unclassified",
    slug: "other",
    icon: "HelpCircle",
    colorHex: "#D7D1C7",
  },
];

export const SYNTHETIC_INDIAN_TRANSACTIONS = [
  // Salary
  {
    date: "2025-01-01",
    amount: 85000.0,
    type: "CREDIT",
    description: "ACH-ACME CORP-SALARY-JAN2025",
    merchant: "ACME Corp",
    categorySlug: "income",
  },
  // Rent
  {
    date: "2025-01-02",
    amount: 22000.0,
    type: "DEBIT",
    description: "UPI-NOBROKER-RENT-PAYMENT-9921",
    merchant: "NoBroker Rent",
    categorySlug: "housing",
  },
  // Quick Commerce & Groceries
  {
    date: "2025-01-03",
    amount: 485.0,
    type: "DEBIT",
    description: "UPI-ZEPTO-BANGALORE-8812",
    merchant: "Zepto",
    categorySlug: "groceries",
  },
  {
    date: "2025-01-05",
    amount: 1240.0,
    type: "DEBIT",
    description: "UPI-BLINKIT-GROCERY-BLR",
    merchant: "Blinkit",
    categorySlug: "groceries",
  },
  // Food Delivery
  {
    date: "2025-01-04",
    amount: 340.0,
    type: "DEBIT",
    description: "UPI-SWIGGY-REST-PAY-1102",
    merchant: "Swiggy",
    categorySlug: "food-dining",
  },
  {
    date: "2025-01-06",
    amount: 590.0,
    type: "DEBIT",
    description: "UPI-ZOMATO-FOOD-DELIVERY",
    merchant: "Zomato",
    categorySlug: "food-dining",
  },
  // Subscriptions
  {
    date: "2025-01-07",
    amount: 649.0,
    type: "DEBIT",
    description: "CARD-NETFLIX-DIGITAL-SUBSCRIPTION",
    merchant: "Netflix",
    categorySlug: "subscriptions",
  },
  {
    date: "2025-01-10",
    amount: 119.0,
    type: "DEBIT",
    description: "UPI-SPOTIFY-INDIA-RECURRING",
    merchant: "Spotify India",
    categorySlug: "subscriptions",
  },
  // Transport
  {
    date: "2025-01-08",
    amount: 320.0,
    type: "DEBIT",
    description: "UPI-UBER-TRIP-BANGALORE-901",
    merchant: "Uber",
    categorySlug: "transport",
  },
  {
    date: "2025-01-09",
    amount: 180.0,
    type: "DEBIT",
    description: "UPI-NAMA-YATRI-AUTO-PAY",
    merchant: "Namma Yatri",
    categorySlug: "transport",
  },
  // Shopping
  {
    date: "2025-01-12",
    amount: 4500.0,
    type: "DEBIT",
    description: "AMAZON-PAY-IN-RETAIL-ORDER-882",
    merchant: "Amazon India",
    categorySlug: "shopping",
  },
  // Investments
  {
    date: "2025-01-15",
    amount: 10000.0,
    type: "DEBIT",
    description: "ACH-ZERODHA-BROKING-SIP",
    merchant: "Zerodha Mutual Fund SIP",
    categorySlug: "investments",
  },
];

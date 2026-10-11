// components/app/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Analytics", href: "/analytics", icon: PieChart },
  { name: "Goals", href: "/goals", icon: Target },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-curo-border bg-curo-surface h-screen flex flex-col hidden md:flex sticky top-0">
      <div className="h-20 flex items-center px-8 border-b border-curo-border/50">
        <Link href="/dashboard">
          <Logo variant="full" className="h-6 w-auto" />
        </Link>
      </div>

      <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
        <p className="px-4 text-[11px] font-medium uppercase tracking-wider text-curo-text-muted mb-2">
          Menu
        </p>

        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-curo-primary-light text-curo-primary"
                  : "text-curo-text-secondary hover:bg-curo-muted-surface hover:text-curo-text",
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-curo-border/50 flex flex-col gap-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-curo-text-secondary hover:bg-curo-muted-surface transition-colors"
        >
          <Settings size={18} />
          Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-curo-negative hover:bg-curo-negative-light transition-colors text-left"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

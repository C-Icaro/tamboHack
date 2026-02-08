"use client";

import {
  LayoutDashboard,
  FileText,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/notes", label: "My Notes", icon: FileText },
  { href: "/tambo-poc", label: "Tambo PoC", icon: Sparkles, badge: "PoC" },
  { href: "/chat", label: "Chat", icon: MessageCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 border-r border-wellness-border bg-wellness-surface flex flex-col">
      <div className="p-6 border-b border-wellness-border">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold text-wellness-primary">
            Wellness
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200",
                isActive
                  ? "bg-wellness-accent/50 text-wellness-primary"
                  : "text-wellness-muted hover:bg-wellness-muted/20 hover:text-wellness-text"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-md bg-wellness-calm/40 text-wellness-text">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-wellness-border">
        <p className="text-xs text-wellness-muted text-center">Take care.</p>
      </div>
    </aside>
  );
}

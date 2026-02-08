"use client";

import { Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/layout/ThemeProvider";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/notes": "My Notes",
  "/tambo-poc": "Tambo PoC",
  "/chat": "Chat",
};

export function Header({ title }: { title?: string }) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const displayTitle = title ?? pageTitles[pathname ?? "/"] ?? "Wellness";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-wellness-border bg-wellness-surface/95 px-6 backdrop-blur">
      <h1 className="text-lg font-semibold text-wellness-text">{displayTitle}</h1>
      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="rounded-lg p-2 text-wellness-muted hover:bg-wellness-muted/20 hover:text-wellness-text transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    </header>
  );
}

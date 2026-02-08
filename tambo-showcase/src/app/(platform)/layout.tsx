"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-wellness-bg">
        <Sidebar />
        <div className="pl-60">
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}

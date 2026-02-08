"use client";

import { cn } from "@/lib/utils";

interface GentlePromptProps {
  message?: string;
  className?: string;
}

export function GentlePrompt({
  message = "How about exploring your notes today?",
  className,
}: GentlePromptProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-wellness-border bg-wellness-surface/50 p-6 text-center",
        className
      )}
    >
      <p className="text-wellness-muted text-sm leading-relaxed">{message}</p>
    </div>
  );
}

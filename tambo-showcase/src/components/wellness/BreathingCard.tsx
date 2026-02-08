"use client";

import { cn } from "@/lib/utils";

interface BreathingCardProps {
  message?: string;
  className?: string;
}

export function BreathingCard({
  message = "Breathe. You're doing well.",
  className,
}: BreathingCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-wellness-border bg-wellness-surface p-6 shadow-sm",
        "transition-shadow duration-200 hover:shadow-md",
        className
      )}
    >
      <p className="text-wellness-text text-base leading-relaxed">
        {message}
      </p>
    </div>
  );
}

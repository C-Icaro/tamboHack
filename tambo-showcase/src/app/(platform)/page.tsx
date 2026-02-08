"use client";

import { ApiKeyCheck } from "@/components/ApiKeyCheck";
import { ApiKeySettings } from "@/components/ApiKeySettings";
import { BreathingCard } from "@/components/wellness/BreathingCard";
import Link from "next/link";
import { FileText, Sparkles, MessageCircle } from "lucide-react";

const cards = [
  {
    href: "/notes",
    label: "My Notes",
    description: "Explore your personal notes with AI",
    icon: FileText,
  },
  {
    href: "/tambo-poc",
    label: "Tambo PoC",
    description: "Tambo AI proof of concept",
    icon: Sparkles,
    badge: "PoC",
  },
  {
    href: "/chat",
    label: "Chat",
    description: "Full conversation with MCP",
    icon: MessageCircle,
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8">
      <section>
        <h2 className="text-2xl font-semibold text-wellness-text mb-1">
          Hello, how are you?
        </h2>
        <p className="text-wellness-muted text-base">
          Welcome to your platform. Choose where to start.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-wellness-border bg-wellness-surface p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-wellness-accent/50"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-wellness-accent/20 p-3 text-wellness-primary">
                <card.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-wellness-text group-hover:text-wellness-primary transition-colors">
                    {card.label}
                  </h3>
                  {card.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-wellness-calm/30 text-wellness-text">
                      {card.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-wellness-muted mt-1">
                  {card.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section>
        <BreathingCard message="Breathe. You're doing well." />
      </section>

      <section className="rounded-2xl border border-wellness-border bg-wellness-surface p-6">
        <h3 className="text-lg font-semibold text-wellness-text mb-2">
          What is Tambo?
        </h3>
        <p className="text-wellness-muted text-sm leading-relaxed mb-4">
          Tambo is an open-source toolkit for building generative UI interfaces
          with React. The AI chooses and renders components based on what you
          ask in natural language.
        </p>
        <ApiKeyCheck>
          <Link
            href="/tambo-poc"
            className="inline-flex items-center gap-2 text-wellness-primary font-medium hover:underline"
          >
            View proof of concept
            <Sparkles className="h-4 w-4" />
          </Link>
        </ApiKeyCheck>
      </section>

      <section>
        <ApiKeySettings />
      </section>
    </div>
  );
}

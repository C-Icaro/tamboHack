"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod/v3";
import { InsightCard } from "./InsightCard";

const insightItemSchema = z.object({
  type: z.string(),
  text: z.string(),
  noteTitle: z.string().optional(),
});

export const insightsListSchema = z.object({
  insights: z.array(insightItemSchema).describe("List of insights to display"),
  title: z
    .string()
    .optional()
    .describe("Optional title for the list"),
});

export type InsightsListProps = z.infer<typeof insightsListSchema>;

export const InsightsList = React.forwardRef<HTMLDivElement, InsightsListProps>(
  ({ insights, title }, ref) => {
    if (!insights || insights.length === 0) {
      return (
        <div
          ref={ref}
          className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-500"
        >
          No insights found.
        </div>
      );
    }

    return (
      <div ref={ref} className="w-full space-y-4">
        {title && (
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
        )}
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <InsightCard
              key={i}
              type={insight.type}
              text={insight.text}
              noteTitle={insight.noteTitle}
            />
          ))}
        </div>
      </div>
    );
  }
);

InsightsList.displayName = "InsightsList";

"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod/v3";

export const summaryCardSchema = z.object({
  title: z.string().describe("Title of the summary card"),
  content: z.string().describe("Main content or body text of the summary"),
  highlight: z
    .string()
    .optional()
    .describe("Optional highlighted text or key takeaway"),
});

export type SummaryCardProps = z.infer<typeof summaryCardSchema>;

export const SummaryCard = React.forwardRef<HTMLDivElement, SummaryCardProps>(
  ({ title, content, highlight }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-gray-200 bg-white p-5 shadow-sm",
          "transition-shadow hover:shadow-md"
        )}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
        {highlight && (
          <div className="mt-4 p-3 rounded-md bg-amber-50 border border-amber-200">
            <p className="text-sm font-medium text-amber-900">{highlight}</p>
          </div>
        )}
      </div>
    );
  }
);

SummaryCard.displayName = "SummaryCard";

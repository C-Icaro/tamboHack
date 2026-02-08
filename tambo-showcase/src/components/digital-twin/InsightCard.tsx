"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod/v3";

export const insightCardSchema = z.object({
  type: z.string().describe("Type of insight (e.g. insight, goals, habits, reflections)"),
  text: z.string().describe("The insight text content"),
  noteTitle: z
    .string()
    .optional()
    .describe("Title of the note this insight belongs to"),
});

export type InsightCardProps = z.infer<typeof insightCardSchema>;

export const InsightCard = React.forwardRef<HTMLDivElement, InsightCardProps>(
  ({ type, text, noteTitle }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm",
          "transition-shadow hover:shadow-md"
        )}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-800">
            {type}
          </span>
          {noteTitle && (
            <span className="text-xs text-gray-500 truncate">{noteTitle}</span>
          )}
        </div>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {text}
        </p>
      </div>
    );
  }
);

InsightCard.displayName = "InsightCard";

"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod/v3";

const insightSchema = z.object({
  type: z.string(),
  text: z.string(),
});

export const noteDetailSchema = z.object({
  note: z.object({
    id: z.number(),
    title: z.string().optional(),
    content: z.string(),
    folderPath: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
  insights: z
    .array(insightSchema)
    .optional()
    .describe("Insights generated for this note"),
});

export type NoteDetailProps = z.infer<typeof noteDetailSchema>;

export const NoteDetail = React.forwardRef<HTMLDivElement, NoteDetailProps>(
  ({ note, insights }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden"
        )}
      >
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {note.title || "Untitled"}
          </h2>
          {note.folderPath && (
            <p className="text-sm text-gray-500 mb-2">{note.folderPath}</p>
          )}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {note.content}
          </div>
        </div>
        {insights && insights.length > 0 && (
          <div className="p-5 bg-gray-50">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              AI Insights
            </h3>
            <div className="space-y-3">
              {insights.map((insight, i) => (
                <div
                  key={i}
                  className="rounded-md border border-gray-200 bg-white p-3"
                >
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {insight.type}
                  </span>
                  <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                    {insight.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

NoteDetail.displayName = "NoteDetail";

"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod/v3";

export const noteCardSchema = z.object({
  title: z.string().describe("Title of the note"),
  excerpt: z.string().describe("Short preview of the note content (first 150 chars)"),
  tags: z
    .array(z.string())
    .optional()
    .describe("Tags associated with the note"),
  folderPath: z
    .string()
    .optional()
    .describe("Folder path where the note is stored"),
  noteId: z.number().describe("ID of the note for linking to details"),
});

export type NoteCardProps = z.infer<typeof noteCardSchema>;

export const NoteCard = React.forwardRef<HTMLDivElement, NoteCardProps>(
  ({ title, excerpt, tags, folderPath, noteId }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm",
          "transition-shadow hover:shadow-md hover:border-gray-300"
        )}
      >
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
          {title || "Untitled"}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-2">
          {excerpt}
        </p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {folderPath && (
          <p className="text-xs text-gray-400 truncate">{folderPath}</p>
        )}
        <span className="text-xs text-gray-400">ID: {noteId}</span>
      </div>
    );
  }
);

NoteCard.displayName = "NoteCard";

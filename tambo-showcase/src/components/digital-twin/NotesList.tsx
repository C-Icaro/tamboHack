"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod/v3";
import { NoteCard } from "./NoteCard";

const noteItemSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()).optional(),
  folderPath: z.string().optional(),
  noteId: z.number(),
});

export const notesListSchema = z.object({
  notes: z.array(noteItemSchema).describe("List of notes to display"),
  title: z
    .string()
    .optional()
    .describe("Optional title for the list (e.g. 'Sentiment notes')"),
});

export type NotesListProps = z.infer<typeof notesListSchema>;

export const NotesList = React.forwardRef<HTMLDivElement, NotesListProps>(
  ({ notes, title }, ref) => {
    if (!notes || notes.length === 0) {
      return (
        <div
          ref={ref}
          className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-500"
        >
          No notes found.
        </div>
      );
    }

    return (
      <div ref={ref} className="w-full space-y-4">
        {title && (
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {notes.map((note) => (
            <NoteCard
              key={note.noteId}
              title={note.title}
              excerpt={note.excerpt}
              tags={note.tags}
              folderPath={note.folderPath}
              noteId={note.noteId}
            />
          ))}
        </div>
      </div>
    );
  }
);

NotesList.displayName = "NotesList";

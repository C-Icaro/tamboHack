"use client";

import { cn } from "@/lib/utils";
import { withInteractable } from "@tambo-ai/react";
import { useEffect, useState } from "react";
import { z } from "zod/v3";

export const notePropsSchema = z.object({
  title: z.string().describe("Title of the note"),
  content: z.string().describe("Content of the note"),
  color: z
    .enum(["white", "yellow", "blue", "green"])
    .optional()
    .describe("Background color of the note"),
});

export type NoteProps = z.infer<typeof notePropsSchema>;

const colorClasses: Record<string, string> = {
  white: "bg-white border-gray-200",
  yellow: "bg-amber-50 border-amber-200",
  blue: "bg-blue-50 border-blue-200",
  green: "bg-emerald-50 border-emerald-200",
};

function NoteBase({ title, content, color = "white" }: NoteProps) {
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  return (
    <div
      className={cn(
        "rounded-lg border-2 p-4 min-h-[120px] transition-colors",
        colorClasses[color] ?? colorClasses.white
      )}
    >
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <textarea
        value={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        className="w-full min-h-[80px] text-sm text-gray-700 bg-transparent border-none resize-none focus:outline-none focus:ring-0"
        placeholder="Add content..."
      />
    </div>
  );
}

export const InteractableNote = withInteractable(NoteBase, {
  componentName: "Note",
  description:
    "A note component for recording ideas. Can change title, content, and background color (white, yellow, blue, green).",
  propsSchema: notePropsSchema,
});

"use client";

import { Upload, FileText, Loader2 } from "lucide-react";
import { useState } from "react";

interface NotesUploadProps {
  onImport?: () => void;
  className?: string;
}

export function NotesUpload({ onImport, className = "" }: NotesUploadProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const submit = async (payload: { text?: string; file?: File }) => {
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      if (payload.file) {
        formData.set("file", payload.file);
      } else if (payload.text?.trim()) {
        formData.set("text", payload.text);
      } else {
        setMessage({ type: "error", text: "Enter markdown or select a file." });
        setLoading(false);
        return;
      }

      const res = await fetch("/api/notes", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({
          type: "error",
          text: data.error ?? "Import failed",
        });
        setLoading(false);
        return;
      }

      setMessage({
        type: "success",
        text: `Imported ${data.imported} note(s).`,
      });
      setText("");
      onImport?.();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Import failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      submit({ file });
      e.target.value = "";
    }
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ text });
  };

  return (
    <div
      className={`rounded-2xl border border-wellness-border bg-wellness-surface p-6 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Upload className="h-5 w-5 text-wellness-primary" />
        <h3 className="text-lg font-semibold text-wellness-text">
          Import notes
        </h3>
      </div>
      <p className="text-sm text-wellness-muted mb-4">
        Paste markdown or upload .md files. No vault required. Supports
        frontmatter (title, tags) and <code className="text-xs">---</code>{" "}
        separators for multiple notes.
      </p>

      <form onSubmit={handlePasteSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste markdown here...&#10;&#10;---&#10;title: My Note&#10;tags: estudo, reflexão&#10;---&#10;&#10;Content..."
          className="w-full h-32 px-4 py-3 rounded-lg border border-wellness-border bg-wellness-bg text-wellness-text placeholder:text-wellness-muted focus:outline-none focus:ring-2 focus:ring-wellness-primary/50 text-sm resize-y"
          disabled={loading}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-wellness-primary text-white font-medium hover:bg-wellness-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            Import from text
          </button>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-wellness-border text-wellness-text font-medium hover:bg-wellness-muted/20 cursor-pointer transition-colors">
            <Upload className="h-4 w-4" />
            Upload .md file
            <input
              type="file"
              accept=".md,.markdown,text/markdown"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
          </label>
        </div>
      </form>

      {message && (
        <p
          className={`mt-4 text-sm ${
            message.type === "success"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}

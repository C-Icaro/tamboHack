import {
  getNotes,
  insertNote,
  isLocalMode,
} from "@/lib/digital-twin-db";
import { parseMarkdownNote, parseMarkdownNotes } from "@/lib/parse-markdown-note";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as "sentimento" | "estudo" | "all" | null;
    const search = searchParams.get("search") ?? undefined;
    const limit = searchParams.get("limit");
    const notes = getNotes({
      category: category ?? "all",
      search,
      limit: limit ? parseInt(limit, 10) : 50,
    });
    return NextResponse.json(notes);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch notes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isLocalMode()) {
      return NextResponse.json(
        {
          error:
            "Upload not available when using vault. Remove DIGITAL_TWIN_DB_PATH to use in-app storage.",
        },
        { status: 400 }
      );
    }

    let raw: string;

    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const text = formData.get("text") as string | null;

      if (file) {
        raw = await file.text();
      } else if (text?.trim()) {
        raw = text;
      } else {
        return NextResponse.json(
          { error: "Provide 'file' or 'text' in the request" },
          { status: 400 }
        );
      }
    } else {
      const body = await request.json();
      if (typeof body.content !== "string" && typeof body.text !== "string") {
        return NextResponse.json(
          { error: "Provide 'content' or 'text' in the request body" },
          { status: 400 }
        );
      }
      raw = body.content ?? body.text;
    }

    const multi = raw.includes("\n\n---\n\n");
    const parsed = multi ? parseMarkdownNotes(raw) : [parseMarkdownNote(raw)];

    const ids: number[] = [];
    for (const note of parsed) {
      if (!note.content.trim()) continue;
      const id = insertNote({
        title: note.title,
        content: note.content,
        tags: note.tags ? JSON.stringify(note.tags) : null,
        folder_path: note.folder_path,
      });
      ids.push(id);
    }

    return NextResponse.json({
      imported: ids.length,
      ids,
      message: `Imported ${ids.length} note(s)`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to import notes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

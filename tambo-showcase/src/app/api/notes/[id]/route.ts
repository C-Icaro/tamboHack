import { getNoteById } from "@/lib/digital-twin-db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const noteId = parseInt(id, 10);
    if (isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }
    const note = getNoteById(noteId);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json(note);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch note";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

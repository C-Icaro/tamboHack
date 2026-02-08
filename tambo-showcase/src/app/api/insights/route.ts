import { getInsights } from "@/lib/digital-twin-db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") ?? undefined;
    const noteId = searchParams.get("note_id");
    const limit = searchParams.get("limit");
    const insights = getInsights({
      type,
      noteId: noteId ? parseInt(noteId, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : 50,
    });
    return NextResponse.json(insights);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch insights";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

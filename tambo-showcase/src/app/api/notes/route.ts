import { getNotes } from "@/lib/digital-twin-db";
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

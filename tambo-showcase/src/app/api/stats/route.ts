import { getStats, isLocalMode } from "@/lib/digital-twin-db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stats = getStats();
    return NextResponse.json({
      ...stats,
      supportsUpload: isLocalMode(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

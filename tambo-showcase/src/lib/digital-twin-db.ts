/**
 * Digital Twin SQLite client.
 * Reads from the Digital Twin database (processed_notes, insights).
 */

import Database from "better-sqlite3";

function getDbPath(): string {
  const envPath = process.env.DIGITAL_TWIN_DB_PATH;
  if (envPath) return envPath;
  throw new Error(
    "DIGITAL_TWIN_DB_PATH is required. Set it in .env.local pointing to your digital_twin.db file."
  );
}

export function getDbConnection(): Database.Database {
  const dbPath = getDbPath();
  try {
    return new Database(dbPath, { readonly: true });
  } catch (err) {
    throw new Error(
      `Failed to open Digital Twin database at ${dbPath}. Set DIGITAL_TWIN_DB_PATH in .env.local.`
    );
  }
}

// Category heuristics: keywords that indicate sentiment vs study
const SENTIMENT_KEYWORDS = [
  "sentimento",
  "emoção",
  "reflexão",
  "reflexoes",
  "pessoal",
  "diário",
  "diario",
  "humor",
  "sentir",
  "reflections",
];
const ESTUDO_KEYWORDS = [
  "estudo",
  "estudos",
  "livro",
  "curso",
  "learning",
  "profissional",
  "documentos",
  "modelos",
];

function matchesCategory(
  text: string | null | undefined,
  category: "sentimento" | "estudo"
): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  const keywords =
    category === "sentimento" ? SENTIMENT_KEYWORDS : ESTUDO_KEYWORDS;
  return keywords.some((k) => lower.includes(k));
}

function parseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export interface NoteRow {
  id: number;
  title: string | null;
  content: string;
  body_content: string | null;
  tags: string | null;
  folder_path: string | null;
  frontmatter: string | null;
  processed_at: string | null;
}

export interface InsightRow {
  id: number;
  note_id: number;
  insight_type: string;
  insight_text: string;
  created_at: string | null;
}

export function getNotes(
  options: {
    category?: "sentimento" | "estudo" | "all";
    search?: string;
    limit?: number;
  } = {}
): NoteRow[] {
  const { category = "all", search, limit = 50 } = options;
  const db = getDbConnection();

  try {
    const query =
      "SELECT id, title, content, body_content, tags, folder_path, frontmatter, processed_at FROM processed_notes ORDER BY processed_at DESC LIMIT ?";
    const fetchLimit = category !== "all" || search ? 500 : limit;
    const stmt = db.prepare(query);
    let rows = stmt.all(fetchLimit) as NoteRow[];

    if (category !== "all") {
      rows = rows.filter((row) => {
        const tagsStr = row.tags ? parseJson<string[]>(row.tags)?.join(" ") ?? "" : "";
        const folderPath = row.folder_path ?? "";
        const combined = `${tagsStr} ${folderPath}`;
        return matchesCategory(combined, category);
      });
    }

    if (search && search.trim()) {
      const searchLower = search.trim().toLowerCase();
      rows = rows.filter(
        (row) =>
          (row.title ?? "").toLowerCase().includes(searchLower) ||
          (row.content ?? "").toLowerCase().includes(searchLower) ||
          (row.body_content ?? "").toLowerCase().includes(searchLower)
      );
    }

    return rows.slice(0, limit);
  } finally {
    db.close();
  }
}

export function getNoteById(id: number): (NoteRow & { insights: InsightRow[] }) | null {
  const db = getDbConnection();

  try {
    const noteStmt = db.prepare(`
      SELECT id, title, content, body_content, tags, folder_path, frontmatter, processed_at
      FROM processed_notes WHERE id = ?
    `);
    const note = noteStmt.get(id) as NoteRow | undefined;
    if (!note) return null;

    const insightsStmt = db.prepare(`
      SELECT id, note_id, insight_type, insight_text, created_at
      FROM insights WHERE note_id = ? ORDER BY created_at DESC
    `);
    const insights = insightsStmt.all(id) as InsightRow[];

    return { ...note, insights };
  } finally {
    db.close();
  }
}

export function getInsights(options: {
  type?: string;
  noteId?: number;
  limit?: number;
} = {}): (InsightRow & { note_title?: string })[] {
  const { type, noteId, limit = 50 } = options;
  const db = getDbConnection();

  try {
    let query = `
      SELECT i.id, i.note_id, i.insight_type, i.insight_text, i.created_at, n.title as note_title
      FROM insights i
      LEFT JOIN processed_notes n ON i.note_id = n.id
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (type) {
      query += " AND i.insight_type = ?";
      params.push(type);
    }
    if (noteId) {
      query += " AND i.note_id = ?";
      params.push(noteId);
    }

    query += " ORDER BY i.created_at DESC LIMIT ?";
    params.push(limit);

    const stmt = db.prepare(query);
    return stmt.all(...params) as (InsightRow & { note_title?: string })[];
  } finally {
    db.close();
  }
}

export function getStats(): {
  totalNotes: number;
  totalInsights: number;
  byCategory: { sentimento: number; estudo: number };
} {
  const db = getDbConnection();

  try {
    const notesCount = (db.prepare("SELECT COUNT(*) as c FROM processed_notes").get() as { c: number }).c;
    const insightsCount = (db.prepare("SELECT COUNT(*) as c FROM insights").get() as { c: number }).c;

    const allNotes = db.prepare(
      "SELECT id, tags, folder_path FROM processed_notes"
    ).all() as { id: number; tags: string | null; folder_path: string | null }[];

    let sentimento = 0;
    let estudo = 0;
    for (const n of allNotes) {
      const tagsStr = n.tags ? parseJson<string[]>(n.tags)?.join(" ") ?? "" : "";
      const combined = `${tagsStr} ${n.folder_path ?? ""}`;
      if (matchesCategory(combined, "sentimento")) sentimento++;
      if (matchesCategory(combined, "estudo")) estudo++;
    }

    return {
      totalNotes: notesCount,
      totalInsights: insightsCount,
      byCategory: { sentimento, estudo },
    };
  } finally {
    db.close();
  }
}

/**
 * Parse markdown content into note fields (title, tags, body).
 */

export interface ParsedNote {
  title: string | null;
  content: string;
  tags: string[] | null;
  folder_path: string | null;
}

export function parseMarkdownNote(raw: string): ParsedNote {
  let content = raw.trim();
  let title: string | null = null;
  let tags: string[] | null = null;
  let folder_path: string | null = null;

  // Frontmatter
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (frontmatterMatch) {
    const fm = frontmatterMatch[1];
    content = content.slice(frontmatterMatch[0].length);

    const titleMatch = fm.match(/^title:\s*(.+)$/m);
    if (titleMatch) title = titleMatch[1].trim().replace(/^["']|["']$/g, "");

    const tagsMatch = fm.match(/^tags?:\s*(.+)$/m);
    if (tagsMatch) {
      const tagStr = tagsMatch[1].trim();
      tags = tagStr.split(/[,\s]+/).filter(Boolean);
    }

    const folderMatch = fm.match(/^folder_path:\s*(.+)$/m);
    if (folderMatch) folder_path = folderMatch[1].trim();
  }

  // Fallback: first # heading as title
  if (!title) {
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
      title = h1Match[1].trim();
      content = content.replace(/^#\s+.+$/m, "").trim();
    }
  }

  return {
    title,
    content: content.trim() || raw,
    tags: tags?.length ? tags : null,
    folder_path,
  };
}

/** Parse multiple notes from a single markdown string. Uses \n\n---\n\n as note separator. */
export function parseMarkdownNotes(raw: string): ParsedNote[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  // Split by blank-line-separated --- (avoids splitting frontmatter ---)
  const chunks = trimmed.split(/\n\n---+\n\n/).filter((c) => c.trim());
  if (chunks.length > 1) {
    return chunks.map(parseMarkdownNote);
  }

  return [parseMarkdownNote(trimmed)];
}

/**
 * Legal Text Normalizer Service
 * Ensures extracted text from PDF and DOCX documents is cleaned of extraction artifacts,
 * line-break noise, and spacing anomalies while preserving 100% of original legal wording.
 */

export function normalizeLegalText(rawText: string): string {
  if (!rawText) return "";

  let text = rawText;

  // 1. Normalize line endings (CRLF / CR -> LF)
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // 2. Normalize non-breaking spaces and special unicode spaces to standard space
  text = text.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ");

  // 3. Remove non-printable control characters except line feeds (\n) and tabs (\t)
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // 4. Repair line-break hyphenated words (e.g. "indemni-\nfication" -> "indemnification")
  text = text.replace(/([a-zA-Z]{2,})-\n([a-zA-Z]{2,})/g, "$1$2");

  // 5. Trim horizontal whitespace at start and end of each line
  text = text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n");

  // 6. Cap consecutive blank lines to at most 2 newlines (preserving paragraph structure)
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

/**
 * Splits normalized document text into structured paragraphs/chunks for downstream AI processing
 */
export function chunkNormalizedText(
  text: string,
  pageNumber?: number
): { id: string; heading?: string; text: string; charCount: number; wordCount: number; pageNumber?: number }[] {
  if (!text || !text.trim()) return [];

  const paragraphs = text.split(/\n\s*\n/);
  const chunks: { id: string; heading?: string; text: string; charCount: number; wordCount: number; pageNumber?: number }[] = [];

  paragraphs.forEach((p, idx) => {
    const trimmed = p.trim();
    if (!trimmed) return;

    // Check if paragraph starts with a section heading (e.g., "SECTION 1", "1. DEFINITIONS", "CLAUSE 4")
    let heading: string | undefined;
    const headingMatch = trimmed.match(/^(SECTION\s+\d+|ARTICLE\s+[IVXLCDM\d]+|\d+\.\s+[A-Z\s]{3,})/i);
    if (headingMatch) {
      heading = headingMatch[0];
    }

    chunks.push({
      id: `chunk_${pageNumber ? `p${pageNumber}_` : ""}${idx + 1}`,
      heading,
      text: trimmed,
      charCount: trimmed.length,
      wordCount: countWords(trimmed),
      pageNumber,
    });
  });

  return chunks;
}

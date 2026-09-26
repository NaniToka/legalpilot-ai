import mammoth from "mammoth";
import { normalizeLegalText, countWords, chunkNormalizedText } from "./textNormalizer";
import { DocumentPage, DocumentChunk } from "@/types";

export interface DOCXExtractionResult {
  text: string;
  pageCount: number;
  pages: DocumentPage[];
  chunks: DocumentChunk[];
  warnings: string[];
}

export async function parseDOCXBuffer(buffer: Buffer): Promise<DOCXExtractionResult> {
  const warnings: string[] = [];

  try {
    const result = await mammoth.extractRawText({ buffer });

    if (result.messages && result.messages.length > 0) {
      result.messages.forEach((msg) => {
        if (msg.type === "warning") {
          warnings.push(`DOCX Parser Notice: ${msg.message}`);
        }
      });
    }

    const normalizedText = normalizeLegalText(result.value || "");
    const chunks = chunkNormalizedText(normalizedText);

    // Estimate page count based on average 350 words per legal page
    const totalWords = countWords(normalizedText);
    const estimatedPageCount = Math.max(1, Math.ceil(totalWords / 350));

    // Construct synthetic page objects from paragraph groups
    const pages: DocumentPage[] = [];
    const paragraphs = normalizedText.split(/\n\s*\n/);
    const paragraphsPerPage = Math.max(1, Math.ceil(paragraphs.length / estimatedPageCount));

    for (let p = 0; p < estimatedPageCount; p++) {
      const pageParagraphs = paragraphs.slice(p * paragraphsPerPage, (p + 1) * paragraphsPerPage);
      const pageText = pageParagraphs.join("\n\n").trim();
      pages.push({
        pageNumber: p + 1,
        text: pageText,
        charCount: pageText.length,
        wordCount: countWords(pageText),
      });
    }

    return {
      text: normalizedText,
      pageCount: estimatedPageCount,
      pages,
      chunks,
      warnings,
    };
  } catch (err: any) {
    throw new Error(`DOCX Parsing Failure: ${err.message || "Corrupted or invalid DOCX document."}`);
  }
}

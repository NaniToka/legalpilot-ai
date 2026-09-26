import pdfParse from "pdf-parse";
import { normalizeLegalText, countWords, chunkNormalizedText } from "./textNormalizer";
import { DocumentPage, DocumentChunk } from "@/types";

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  pages: DocumentPage[];
  chunks: DocumentChunk[];
  warnings: string[];
  isScannedOrImage: boolean;
}

export async function parsePDFBuffer(buffer: Buffer): Promise<PDFExtractionResult> {
  const warnings: string[] = [];
  let rawText = "";
  let pageCount = 0;
  const pages: DocumentPage[] = [];
  const chunks: DocumentChunk[] = [];

  try {
    // Custom pager callback to track page boundaries
    const pageTexts: string[] = [];

    const pdfData = await pdfParse(buffer, {
      pagerender: function (pageData: any) {
        return pageData.getTextContent().then(function (textContent: any) {
          let lastY = -1;
          let text = "";
          for (const item of textContent.items) {
            if (lastY !== item.transform[5] && lastY !== -1) {
              text += "\n";
            }
            text += item.str + " ";
            lastY = item.transform[5];
          }
          pageTexts.push(text);
          return text;
        });
      },
    });

    rawText = pdfData.text || pageTexts.join("\n\n");
    pageCount = pdfData.numpages || pageTexts.length || 1;

    // Process individual pages
    if (pageTexts.length > 0) {
      pageTexts.forEach((pText, index) => {
        const normPageText = normalizeLegalText(pText);
        const pPageNum = index + 1;
        const pCharCount = normPageText.length;
        const pWordCount = countWords(normPageText);

        pages.push({
          pageNumber: pPageNum,
          text: normPageText,
          charCount: pCharCount,
          wordCount: pWordCount,
        });

        const pChunks = chunkNormalizedText(normPageText, pPageNum);
        chunks.push(...pChunks);
      });
    }

    const normalizedFullText = normalizeLegalText(rawText);

    // Fallback if pageTexts were empty
    if (pages.length === 0 && normalizedFullText) {
      pages.push({
        pageNumber: 1,
        text: normalizedFullText,
        charCount: normalizedFullText.length,
        wordCount: countWords(normalizedFullText),
      });
      chunks.push(...chunkNormalizedText(normalizedFullText, 1));
    }

    // Check for scanned / image-based PDF
    const totalChars = normalizedFullText.length;
    const totalWords = countWords(normalizedFullText);
    const isScannedOrImage = totalChars < 50 || totalWords < 10;

    if (isScannedOrImage) {
      warnings.push(
        "This document appears to contain scanned or image-based pages. Text extraction is not currently available for this document."
      );
    }

    return {
      text: normalizedFullText,
      pageCount,
      pages,
      chunks,
      warnings,
      isScannedOrImage,
    };
  } catch (err: any) {
    throw new Error(`PDF Parsing Failure: ${err.message || "Corrupted or invalid PDF file structure."}`);
  }
}

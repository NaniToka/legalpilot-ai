import { parsePDFBuffer } from "./pdfParser";
import { parseDOCXBuffer } from "./docxParser";
import { validateLegalDocument, formatFileSize } from "@/lib/fileValidation";
import { ProcessedDocumentPayload, DocumentFileType } from "@/types";
import { countWords } from "./textNormalizer";

export async function processLegalDocument(
  fileBuffer: Buffer,
  filename: string,
  declaredMimeType?: string
): Promise<ProcessedDocumentPayload> {
  const documentId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const fileSize = fileBuffer.length;
  const formattedSize = formatFileSize(fileSize);
  const processedAt = new Date().toISOString();

  // Convert Buffer to Uint8Array for W3C File BlobPart compatibility
  const uint8Array = new Uint8Array(fileBuffer);
  const mockFile = new File([uint8Array], filename, { type: declaredMimeType || "" });
  const validation = validateLegalDocument(mockFile);

  if (!validation.isValid || !validation.fileType) {
    return {
      documentId,
      filename,
      fileType: (filename.endsWith(".pdf") ? "pdf" : "docx") as DocumentFileType,
      fileSize,
      formattedSize,
      processedAt,
      status: "failed",
      extractedText: "",
      characterCount: 0,
      wordCount: 0,
      pageCount: 0,
      pages: [],
      chunks: [],
      warnings: [],
      errors: [validation.error || "Document validation failed."],
    };
  }

  const fileType: DocumentFileType = validation.fileType;

  try {
    let extractedText = "";
    let pageCount = 1;
    let pages: any[] = [];
    let chunks: any[] = [];
    const warnings: string[] = [];

    if (fileType === "pdf") {
      const pdfResult = await parsePDFBuffer(fileBuffer);
      extractedText = pdfResult.text;
      pageCount = pdfResult.pageCount;
      pages = pdfResult.pages;
      chunks = pdfResult.chunks;
      warnings.push(...pdfResult.warnings);
    } else if (fileType === "docx") {
      const docxResult = await parseDOCXBuffer(fileBuffer);
      extractedText = docxResult.text;
      pageCount = docxResult.pageCount;
      pages = docxResult.pages;
      chunks = docxResult.chunks;
      warnings.push(...docxResult.warnings);
    }

    const charCount = extractedText.length;
    const totalWords = countWords(extractedText);

    if (charCount === 0 && warnings.length === 0) {
      warnings.push("No extractable text was found in the document.");
    }

    return {
      documentId,
      filename,
      fileType,
      fileSize,
      formattedSize,
      processedAt,
      status: "completed",
      extractedText,
      characterCount: charCount,
      wordCount: totalWords,
      pageCount,
      pages,
      chunks,
      warnings,
      errors: [],
    };
  } catch (err: any) {
    return {
      documentId,
      filename,
      fileType,
      fileSize,
      formattedSize,
      processedAt,
      status: "failed",
      extractedText: "",
      characterCount: 0,
      wordCount: 0,
      pageCount: 0,
      pages: [],
      chunks: [],
      warnings: [],
      errors: [err.message || "An unexpected error occurred during document extraction."],
    };
  }
}

/**
 * Document Parser Service Interface Stub
 * Will handle text extraction for PDF, DOCX, and TXT files in future steps.
 */

import { DocumentMetadata } from "@/types";

export interface ParsedDocument {
  metadata: DocumentMetadata;
  extractedText: string;
}

export async function parseDocumentFile(file: File): Promise<ParsedDocument> {
  // Service stub for Step 1
  throw new Error("Document parsing service will be implemented in Step 2.");
}

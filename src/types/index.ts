/**
 * LegalPilot AI - Master Data Types Index
 */

export * from "./ai";

export type DocumentFileType = "pdf" | "docx";

export type ProcessingStatus = "idle" | "validating" | "processing" | "completed" | "failed";

export interface DocumentPage {
  pageNumber: number;
  text: string;
  charCount: number;
  wordCount: number;
}

export interface DocumentChunk {
  id: string;
  heading?: string;
  text: string;
  charCount: number;
  wordCount: number;
  pageNumber?: number;
}

export interface ProcessedDocumentPayload {
  documentId: string;
  filename: string;
  fileType: DocumentFileType;
  fileSize: number;
  formattedSize: string;
  processedAt: string;
  status: ProcessingStatus;
  extractedText: string;
  characterCount: number;
  wordCount: number;
  pageCount: number;
  pages: DocumentPage[];
  chunks: DocumentChunk[];
  warnings: string[];
  errors: string[];
}

export interface DocumentMetadata {
  id: string;
  filename: string;
  fileSize: number;
  fileType: DocumentFileType;
  uploadedAt: string;
  charCount?: number;
}

export interface PreparedDocument {
  id: string;
  file: File;
  filename: string;
  fileType: DocumentFileType;
  fileSize: number;
  formattedSize: string;
  uploadedAt: string;
  status: "idle" | "selected" | "ready" | "preparing" | "error";
}

export interface LegalSummary {
  documentId: string;
  title: string;
  overview: string;
  keyParties: string[];
  governingLaw?: string;
  effectiveDate?: string;
  terminationDate?: string;
  keyTakeaways: string[];
}

export type RiskSeverity = "low" | "medium" | "high" | "critical";

export interface LegalRiskClause {
  id: string;
  clauseTitle: string;
  originalText: string;
  severity: RiskSeverity;
  explanation: string;
  recommendation: string;
  category: "liability" | "termination" | "payment" | "intellectual-property" | "confidentiality" | "other";
}

export interface QAMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  referencedClauses?: string[];
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: "obligation" | "deadline" | "signing" | "review";
  isCompleted: boolean;
}

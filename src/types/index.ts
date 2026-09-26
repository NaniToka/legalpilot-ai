/**
 * LegalPilot AI - Data Types & Interfaces
 */

export type DocumentFileType = "pdf" | "docx" | "txt";

export interface DocumentMetadata {
  id: string;
  filename: string;
  fileSize: number;
  fileType: DocumentFileType;
  uploadedAt: string;
  charCount?: number;
}

export type UploadStatus = "idle" | "selected" | "ready" | "preparing" | "error";

export interface PreparedDocument {
  id: string;
  file: File;
  filename: string;
  fileType: DocumentFileType;
  fileSize: number;
  formattedSize: string;
  uploadedAt: string;
  status: UploadStatus;
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

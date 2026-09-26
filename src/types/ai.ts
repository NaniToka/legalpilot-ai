/**
 * LegalPilot AI - AI Service Types & Contracts
 */

export type AIErrorType =
  | "MISSING_API_KEY"
  | "INVALID_CONFIG"
  | "RATE_LIMIT_EXCEEDED"
  | "PROVIDER_UNAVAILABLE"
  | "TIMEOUT"
  | "MALFORMED_OUTPUT"
  | "INVALID_REQUEST"
  | "UNKNOWN_ERROR";

export interface AIError {
  code: AIErrorType;
  message: string;
  userMessage: string;
}

export interface AIGroundedContext {
  documentText?: string;
  pages?: { pageNumber: number; text: string }[];
  chunks?: { id: string; heading?: string; text: string; pageNumber?: number }[];
  filename?: string;
}

export interface AIRequestOptions {
  task: "health_check" | "summarize" | "analyze_clauses" | "detect_risks" | "qa" | "compare" | "checklist" | string;
  systemInstruction?: string;
  userInput?: string;
  documentContext?: AIGroundedContext;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  responseSchema?: Record<string, any>;
  timeoutMs?: number;
}

export interface AIUsageStats {
  promptTokens?: number;
  candidatesTokens?: number;
  totalTokens?: number;
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  rawContent: string;
  task: string;
  model: string;
  provider: string;
  usage?: AIUsageStats;
  durationMs: number;
  error?: AIError;
}

export interface StructuredLegalAnalysisContract {
  summary?: {
    overview: string;
    keyParties: string[];
    governingLaw?: string;
    effectiveDate?: string;
  };
  keyPoints?: string[];
  clauses?: {
    title: string;
    originalText: string;
    explanation: string;
  }[];
  risks?: {
    severity: "low" | "medium" | "high" | "critical";
    clauseTitle: string;
    explanation: string;
    recommendation: string;
  }[];
  questions?: string[];
  nextSteps?: string[];
}

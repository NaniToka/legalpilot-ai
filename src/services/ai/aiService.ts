/**
 * AI Service Interface Stub
 * Will handle LLM API integration (Gemini / OpenAI / Anthropic) for legal document analysis in future steps.
 */

import { LegalSummary, LegalRiskClause, QAMessage, ActionItem } from "@/types";

export interface AIAnalysisResult {
  summary: LegalSummary;
  risks: LegalRiskClause[];
  actionItems: ActionItem[];
}

export async function analyzeLegalText(extractedText: string): Promise<AIAnalysisResult> {
  // Service stub for Step 1
  throw new Error("AI Analysis service will be configured in future steps.");
}

export async function askLegalQuestion(documentText: string, question: string, history: QAMessage[]): Promise<string> {
  // Service stub for Step 1
  throw new Error("AI Q&A service will be configured in future steps.");
}

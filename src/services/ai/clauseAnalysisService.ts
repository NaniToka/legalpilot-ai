import { ProcessedDocumentPayload, StructuredClauseAnalysisResult } from "@/types";
import { executeAIRequest } from "./aiService";
import {
  buildClauseAnalysisTaskInstruction,
  CLAUSE_ANALYSIS_RESPONSE_SCHEMA,
  validateClauseAnalysisResult,
} from "./prompts/clauseAnalysisPrompt";

export async function analyzeImportantClauses(
  payload: ProcessedDocumentPayload
): Promise<StructuredClauseAnalysisResult> {
  if (!payload || !payload.extractedText || !payload.extractedText.trim()) {
    throw new Error("Cannot analyze clauses: Document text is empty or missing.");
  }

  const systemInstruction = buildClauseAnalysisTaskInstruction();

  const response = await executeAIRequest<StructuredClauseAnalysisResult>({
    task: "analyze_clauses",
    systemInstruction,
    documentContext: {
      filename: payload.filename,
      pages: payload.pages,
      chunks: payload.chunks,
      documentText: payload.extractedText,
    },
    userInput: `Analyze the uploaded document (${payload.filename}) for key clauses, obligations, rights, attention points, deadlines, and financial commitments.`,
    temperature: 0.1,
    responseSchema: CLAUSE_ANALYSIS_RESPONSE_SCHEMA,
  });

  if (!response.success || response.error) {
    throw new Error(response.error?.userMessage || "AI clause analysis failed. Please try again.");
  }

  if (response.data) {
    return validateClauseAnalysisResult(response.data, payload.documentId);
  }

  try {
    const cleaned = response.rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return validateClauseAnalysisResult(parsed, payload.documentId);
  } catch (err: any) {
    throw new Error("Failed to validate structured AI clause analysis. Please retry your request.");
  }
}

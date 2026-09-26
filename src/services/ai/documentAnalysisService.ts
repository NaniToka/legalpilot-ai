import { ProcessedDocumentPayload, StructuredLegalDocumentAnalysis } from "@/types";
import { executeAIRequest } from "./aiService";
import {
  buildDocumentUnderstandingTaskInstruction,
  DOCUMENT_UNDERSTANDING_RESPONSE_SCHEMA,
  validateDocumentUnderstandingAnalysis,
} from "./prompts/documentUnderstandingPrompt";

export async function analyzeDocumentUnderstanding(
  payload: ProcessedDocumentPayload
): Promise<StructuredLegalDocumentAnalysis> {
  if (!payload || !payload.extractedText || !payload.extractedText.trim()) {
    throw new Error("Cannot analyze document: Document text is empty or missing.");
  }

  const systemInstruction = buildDocumentUnderstandingTaskInstruction();

  const response = await executeAIRequest<StructuredLegalDocumentAnalysis>({
    task: "document_understanding",
    systemInstruction,
    documentContext: {
      filename: payload.filename,
      pages: payload.pages,
      chunks: payload.chunks,
      documentText: payload.extractedText,
    },
    userInput: `Analyze the uploaded document (${payload.filename}) and extract a comprehensive structured legal overview.`,
    temperature: 0.1,
    responseSchema: DOCUMENT_UNDERSTANDING_RESPONSE_SCHEMA,
  });

  if (!response.success || response.error) {
    throw new Error(response.error?.userMessage || "AI document analysis failed. Please try again.");
  }

  if (response.data) {
    return validateDocumentUnderstandingAnalysis(response.data, payload.documentId);
  }

  // Fallback parsing if data is unparsed raw string
  try {
    const cleaned = response.rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return validateDocumentUnderstandingAnalysis(parsed, payload.documentId);
  } catch (err: any) {
    throw new Error("Failed to validate structured AI output. Please retry document analysis.");
  }
}

import {
  ProcessedDocumentPayload,
  StructuredConsultationBriefResult,
} from "@/types";
import { executeAIRequest } from "./aiService";
import {
  buildConsultationTaskInstruction,
  CONSULTATION_RESPONSE_SCHEMA,
  validateConsultationBriefResult,
} from "./prompts/consultationPrompt";

export async function generateConsultationBrief(
  payload: ProcessedDocumentPayload,
  comparisonContextText?: string
): Promise<StructuredConsultationBriefResult> {
  if (!payload || !payload.extractedText || !payload.extractedText.trim()) {
    throw new Error("Cannot generate consultation brief: Document text is empty or missing.");
  }

  const systemInstruction = buildConsultationTaskInstruction();

  let inputPrompt = `Analyze the uploaded document (${payload.filename}) and prepare a concise, structured consultation brief for a legal professional.`;
  if (comparisonContextText && comparisonContextText.trim()) {
    inputPrompt += `\n\nVERSION COMPARISON HIGHLIGHTS:\n${comparisonContextText.trim()}`;
  }

  const response = await executeAIRequest<StructuredConsultationBriefResult>({
    task: "consultation_brief",
    systemInstruction,
    documentContext: {
      filename: payload.filename,
      pages: payload.pages,
      chunks: payload.chunks,
      documentText: payload.extractedText,
    },
    userInput: inputPrompt,
    temperature: 0.1,
    responseSchema: CONSULTATION_RESPONSE_SCHEMA,
  });

  if (!response.success || response.error) {
    throw new Error(response.error?.userMessage || "Failed to generate consultation brief. Please try again.");
  }

  if (response.data) {
    return validateConsultationBriefResult(response.data, payload);
  }

  try {
    const cleaned = response.rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return validateConsultationBriefResult(parsed, payload);
  } catch (err: any) {
    throw new Error("Failed to validate structured AI consultation brief output. Please retry.");
  }
}

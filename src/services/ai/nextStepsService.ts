import {
  ProcessedDocumentPayload,
  StructuredNextStepsResult,
} from "@/types";
import { executeAIRequest } from "./aiService";
import {
  buildNextStepsTaskInstruction,
  NEXT_STEPS_RESPONSE_SCHEMA,
  validateNextStepsResult,
} from "./prompts/nextStepsPrompt";

export async function generateDocumentNextSteps(
  payload: ProcessedDocumentPayload
): Promise<StructuredNextStepsResult> {
  if (!payload || !payload.extractedText || !payload.extractedText.trim()) {
    throw new Error("Cannot generate next steps: Document text is empty or missing.");
  }

  const systemInstruction = buildNextStepsTaskInstruction();

  const response = await executeAIRequest<StructuredNextStepsResult>({
    task: "checklist",
    systemInstruction,
    documentContext: {
      filename: payload.filename,
      pages: payload.pages,
      chunks: payload.chunks,
      documentText: payload.extractedText,
    },
    userInput: `Analyze the uploaded document (${payload.filename}) and extract an actionable checklist of next steps, obligations, deadlines, and questions for a legal professional.`,
    temperature: 0.1,
    responseSchema: NEXT_STEPS_RESPONSE_SCHEMA,
  });

  if (!response.success || response.error) {
    throw new Error(response.error?.userMessage || "Failed to generate next steps checklist. Please try again.");
  }

  if (response.data) {
    return validateNextStepsResult(response.data, payload);
  }

  try {
    const cleaned = response.rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return validateNextStepsResult(parsed, payload);
  } catch (err: any) {
    throw new Error("Failed to validate structured AI next steps checklist. Please retry.");
  }
}

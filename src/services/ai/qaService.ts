import {
  ProcessedDocumentPayload,
  StructuredQAResult,
  QAMessageItem,
} from "@/types";
import { executeAIRequest } from "./aiService";
import {
  buildQATaskInstruction,
  QA_RESPONSE_SCHEMA,
  validateQAResult,
  selectRelevantDocumentContext,
} from "./prompts/qaPrompt";

export async function answerLegalQuestion(
  payload: ProcessedDocumentPayload,
  question: string,
  conversationHistory: QAMessageItem[] = []
): Promise<StructuredQAResult> {
  const trimmedQuestion = question ? question.trim() : "";

  if (!trimmedQuestion) {
    throw new Error("Question cannot be empty.");
  }

  if (trimmedQuestion.length > 1000) {
    throw new Error("Question exceeds maximum limit of 1000 characters.");
  }

  if (!payload || !payload.extractedText || !payload.extractedText.trim()) {
    throw new Error("Cannot answer question: Document text is empty or missing.");
  }

  const documentContext = selectRelevantDocumentContext(payload, trimmedQuestion);
  const systemInstruction = buildQATaskInstruction();

  let contextPrompt = `USER QUESTION: "${trimmedQuestion}"`;
  if (conversationHistory.length > 0) {
    const recentHistory = conversationHistory
      .slice(-3)
      .map((item) => `Q: ${item.question}\nA: ${item.result.answer}`)
      .join("\n\n");
    contextPrompt = `PREVIOUS RECENT CONVERSATION:\n${recentHistory}\n\nCURRENT QUESTION: "${trimmedQuestion}"`;
  }

  const response = await executeAIRequest<StructuredQAResult>({
    task: "qa",
    systemInstruction,
    documentContext,
    userInput: contextPrompt,
    temperature: 0.1,
    responseSchema: QA_RESPONSE_SCHEMA,
  });

  if (!response.success || response.error) {
    throw new Error(response.error?.userMessage || "Failed to process question. Please try again.");
  }

  if (response.data) {
    return validateQAResult(response.data, trimmedQuestion);
  }

  try {
    const cleaned = response.rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return validateQAResult(parsed, trimmedQuestion);
  } catch (err: any) {
    throw new Error("Failed to validate structured AI response. Please retry your question.");
  }
}

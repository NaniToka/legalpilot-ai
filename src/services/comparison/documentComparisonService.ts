import {
  ProcessedDocumentPayload,
  StructuredDocumentComparisonResult,
} from "@/types";
import { executeAIRequest } from "@/services/ai/aiService";
import { computeDeterministicDiff } from "./deterministicDiff";
import {
  buildComparisonTaskInstruction,
  COMPARISON_RESPONSE_SCHEMA,
  validateDocumentComparisonResult,
} from "@/services/ai/prompts/comparisonPrompt";

export async function compareLegalDocuments(
  payloadA: ProcessedDocumentPayload,
  payloadB: ProcessedDocumentPayload
): Promise<StructuredDocumentComparisonResult> {
  if (!payloadA || !payloadA.extractedText || !payloadA.extractedText.trim()) {
    throw new Error("Cannot compare documents: Document A (Original) text is empty or missing.");
  }

  if (!payloadB || !payloadB.extractedText || !payloadB.extractedText.trim()) {
    throw new Error("Cannot compare documents: Document B (New Version) text is empty or missing.");
  }

  // 1. Compute deterministic text & structural diff first
  const deterministicDiff = computeDeterministicDiff(payloadA, payloadB);

  // 2. Build system instruction
  const systemInstruction = buildComparisonTaskInstruction();

  // 3. Format grounded input prompt incorporating deterministic diff summary + document texts
  const diffSummaryText = `
DETERMINISTIC TEXT DIFF SUMMARY:
- Original Document (Document A): ${payloadA.filename} (${payloadA.chunks.length} chunks)
- New Version (Document B): ${payloadB.filename} (${payloadB.chunks.length} chunks)
- Added Chunks Count: ${deterministicDiff.addedChunksCount}
- Removed Chunks Count: ${deterministicDiff.removedChunksCount}
- Modified Chunks Count: ${deterministicDiff.modifiedChunksCount}
- Unchanged Chunks Count: ${deterministicDiff.unchangedChunksCount}

DOCUMENT A (ORIGINAL) TEXT EXCERPT:
${payloadA.extractedText.slice(0, 10000)}

DOCUMENT B (NEW VERSION) TEXT EXCERPT:
${payloadB.extractedText.slice(0, 10000)}
`.trim();

  const response = await executeAIRequest<StructuredDocumentComparisonResult>({
    task: "compare",
    systemInstruction,
    documentContext: {
      filename: `${payloadA.filename} vs ${payloadB.filename}`,
      documentText: diffSummaryText,
    },
    userInput: `Compare Document A (${payloadA.filename}) and Document B (${payloadB.filename}) based on the deterministic diff and text provided. Identify all added, removed, and modified clauses, obligations, financial terms, dates, and termination conditions.`,
    temperature: 0.1,
    responseSchema: COMPARISON_RESPONSE_SCHEMA,
  });

  if (!response.success || response.error) {
    throw new Error(response.error?.userMessage || "Failed to complete document comparison. Please try again.");
  }

  if (response.data) {
    return validateDocumentComparisonResult(response.data, payloadA, payloadB);
  }

  try {
    const cleaned = response.rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return validateDocumentComparisonResult(parsed, payloadA, payloadB);
  } catch (err: any) {
    throw new Error("Failed to validate structured AI document comparison output. Please retry.");
  }
}

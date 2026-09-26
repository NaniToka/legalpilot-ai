import {
  StructuredQAResult,
  QAAnswerType,
  QAConfidenceLevel,
  ProcessedDocumentPayload,
  AIGroundedContext,
} from "@/types";
import { buildGroundedSystemInstruction } from "./legalSystemPrompts";

export function buildQATaskInstruction(): string {
  return buildGroundedSystemInstruction(`
EVIDENCE-GROUNDED LEGAL Q&A INSTRUCTIONS:
Answer the user's specific question regarding the supplied legal document context.

CRITICAL OPERATIONAL & SAFETY RULES:
1. STRICT DOCUMENT EVIDENCE: Rely ONLY on explicit statements, terms, and context present in the supplied document text.
2. NO FABRICATION / NO INVENTED FACTS: Do NOT invent missing document terms, dates, monetary amounts, obligations, parties, or penalties.
3. INSUFFICIENT INFORMATION BEHAVIOR: If the document does not contain sufficient facts to answer the question, set answerType to "insufficient_information", confidence to "Insufficient document evidence", and state clearly: "I couldn't find enough information in the uploaded document to answer that question."
4. DISTINGUISH FACTS FROM EXPLANATIONS: Set answerType to "document_fact" when quoting/paraphrasing direct provisions, and "document_explanation" when summarizing context.
5. EVIDENCE CONFIDENCE: Classify confidence as one of:
   - "Strongly supported by document" (Direct explicit match)
   - "Partially supported by document" (Inferred directly from explicit provisions)
   - "Insufficient document evidence" (Missing from document)
6. SOURCE REFERENCES: Provide page numbers, section headers, and brief excerpts (under 100 characters) for supporting text when available. Do NOT fabricate page numbers.
7. NO GUARANTEED LEGAL CONCLUSIONS: Inform the user that responses provide informational document breakdown, not formal legal advice.
8. SUGGESTED FOLLOW-UPS: Provide 2-3 relevant follow-up questions tailored to the answer.
`.trim());
}

export const QA_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    answer: { type: "STRING" },
    answerType: { type: "STRING" },
    confidence: { type: "STRING" },
    sources: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          pageNumber: { type: "INTEGER" },
          sectionHeader: { type: "STRING" },
          excerpt: { type: "STRING" },
        },
      },
    },
    limitations: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    suggestedFollowUps: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
  },
  required: ["answer", "answerType", "confidence", "sources", "limitations", "suggestedFollowUps"],
};

export function validateQAResult(raw: any, question: string): StructuredQAResult {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid Q&A output: Expected structured object payload.");
  }

  const validAnswerTypes: QAAnswerType[] = [
    "document_fact",
    "document_explanation",
    "insufficient_information",
  ];

  let answerType: QAAnswerType = "document_explanation";
  if (typeof raw.answerType === "string") {
    const match = validAnswerTypes.find((t) => t === raw.answerType.toLowerCase());
    if (match) answerType = match;
  }

  const validConfidences: QAConfidenceLevel[] = [
    "Strongly supported by document",
    "Partially supported by document",
    "Insufficient document evidence",
  ];

  let confidence: QAConfidenceLevel = "Strongly supported by document";
  if (typeof raw.confidence === "string") {
    const match = validConfidences.find((c) => c.toLowerCase() === raw.confidence.toLowerCase());
    if (match) confidence = match;
  }

  if (answerType === "insufficient_information") {
    confidence = "Insufficient document evidence";
  }

  const sources = Array.isArray(raw.sources)
    ? raw.sources.map((s: any) => ({
        pageNumber: typeof s.pageNumber === "number" ? s.pageNumber : undefined,
        sectionHeader: typeof s.sectionHeader === "string" && s.sectionHeader.trim() ? s.sectionHeader : undefined,
        excerpt: typeof s.excerpt === "string" && s.excerpt.trim() ? s.excerpt.slice(0, 150) : undefined,
      }))
    : [];

  const limitations = Array.isArray(raw.limitations)
    ? raw.limitations.filter((l: any) => typeof l === "string" && l.trim())
    : [];

  const suggestedFollowUps = Array.isArray(raw.suggestedFollowUps)
    ? raw.suggestedFollowUps.filter((f: any) => typeof f === "string" && f.trim())
    : [
        "What are my main obligations under this agreement?",
        "When can this agreement be terminated?",
      ];

  const answerText = typeof raw.answer === "string" && raw.answer.trim()
    ? raw.answer
    : "I couldn't find enough information in the uploaded document to answer that question.";

  return {
    question: question.trim(),
    answer: answerText,
    answerType,
    confidence,
    sources,
    limitations,
    suggestedFollowUps,
    answeredAt: new Date().toISOString(),
  };
}

export function selectRelevantDocumentContext(
  payload: ProcessedDocumentPayload,
  question: string
): AIGroundedContext {
  if (!payload.extractedText || !payload.extractedText.trim()) {
    return {
      filename: payload.filename,
      documentText: "",
      pages: [],
      chunks: [],
    };
  }

  // If document is under 15,000 chars, send full text
  if (payload.extractedText.length <= 15000) {
    return {
      filename: payload.filename,
      documentText: payload.extractedText,
      pages: payload.pages,
      chunks: payload.chunks,
    };
  }

  // For larger documents, select chunks matching question keywords
  const keywords = question
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const matchedChunks = payload.chunks.filter((chunk) => {
    const chunkLower = chunk.text.toLowerCase();
    return keywords.some((kw) => chunkLower.includes(kw));
  });

  // Always include leading chunks + matched chunks
  const leadingChunks = payload.chunks.slice(0, 3);
  const combinedChunksMap = new Map();

  leadingChunks.forEach((c) => combinedChunksMap.set(c.id, c));
  matchedChunks.forEach((c) => combinedChunksMap.set(c.id, c));

  const selectedChunks = Array.from(combinedChunksMap.values()).slice(0, 10);
  const combinedText = selectedChunks.map((c) => c.text).join("\n\n");

  return {
    filename: payload.filename,
    documentText: combinedText,
    pages: payload.pages,
    chunks: selectedChunks,
  };
}

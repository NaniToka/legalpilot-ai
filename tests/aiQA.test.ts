import { describe, it, expect, beforeEach } from "vitest";
import {
  buildQATaskInstruction,
  validateQAResult,
  selectRelevantDocumentContext,
} from "../src/services/ai/prompts/qaPrompt";
import { answerLegalQuestion } from "../src/services/ai/qaService";
import { setAIProviderAdapter } from "../src/services/ai/aiService";
import { AIProviderAdapter } from "../src/services/ai/adapters/geminiAdapter";
import { ProcessedDocumentPayload, AIRequestOptions, AIResponse, QAMessageItem } from "../src/types";

describe("Step 9 — Evidence-Grounded Legal Q&A Pipeline", () => {
  describe("1. Grounding Prompt & Safety Instructions", () => {
    it("should build grounded task instructions adhering to Step 9 rules", () => {
      const instruction = buildQATaskInstruction();

      expect(instruction).toContain("EVIDENCE-GROUNDED LEGAL Q&A INSTRUCTIONS");
      expect(instruction).toContain("STRICT DOCUMENT EVIDENCE");
      expect(instruction).toContain("NO FABRICATION / NO INVENTED FACTS");
      expect(instruction).toContain("INSUFFICIENT INFORMATION BEHAVIOR");
      expect(instruction).toContain("I couldn't find enough information in the uploaded document to answer that question.");
      expect(instruction).toContain("EVIDENCE CONFIDENCE");
      expect(instruction).toContain("Strongly supported by document");
      expect(instruction).toContain("Partially supported by document");
      expect(instruction).toContain("Insufficient document evidence");
    });
  });

  describe("2. Response Schema Validation & Normalization", () => {
    it("should validate and map complete structured Q&A result cleanly", () => {
      const rawMock = {
        answer: "The agreement requires 60 days prior written notice before termination.",
        answerType: "document_fact",
        confidence: "Strongly supported by document",
        sources: [{ pageNumber: 2, sectionHeader: "Termination", excerpt: "written notice at least sixty (60) days" }],
        limitations: [],
        suggestedFollowUps: ["What happens if notice is given late?", "Are there termination fees?"],
      };

      const validated = validateQAResult(rawMock, "When can this agreement be terminated?");

      expect(validated.question).toBe("When can this agreement be terminated?");
      expect(validated.answer).toContain("60 days");
      expect(validated.answerType).toBe("document_fact");
      expect(validated.confidence).toBe("Strongly supported by document");
      expect(validated.sources.length).toBe(1);
      expect(validated.sources[0].pageNumber).toBe(2);
      expect(validated.sources[0].sectionHeader).toBe("Termination");
      expect(validated.suggestedFollowUps.length).toBe(2);
    });

    it("should enforce 'insufficient_information' and 'Insufficient document evidence' when evidence is missing", () => {
      const rawMockMissing = {
        answer: "I couldn't find enough information in the uploaded document to answer that question.",
        answerType: "insufficient_information",
        confidence: "Insufficient document evidence",
        sources: [],
        limitations: ["Pets clause is not mentioned in document."],
        suggestedFollowUps: ["Does the agreement allow sub-leasing?"],
      };

      const validated = validateQAResult(rawMockMissing, "Are pets allowed in the apartment?");

      expect(validated.answerType).toBe("insufficient_information");
      expect(validated.confidence).toBe("Insufficient document evidence");
      expect(validated.sources.length).toBe(0);
      expect(validated.limitations[0]).toContain("Pets clause");
    });

    it("should throw error for non-object raw responses", () => {
      expect(() => validateQAResult(null, "Test question")).toThrow("Invalid Q&A output");
    });
  });

  describe("3. Document Context Selection & Chunk Retrieval", () => {
    it("should return full document context for small documents", () => {
      const mockPayload: ProcessedDocumentPayload = {
        documentId: "doc_small",
        filename: "short_contract.pdf",
        fileType: "pdf",
        fileSize: 1000,
        formattedSize: "1 KB",
        processedAt: new Date().toISOString(),
        status: "completed",
        extractedText: "SECTION 1. Rent is $1000 per month.",
        characterCount: 35,
        wordCount: 7,
        pageCount: 1,
        pages: [{ pageNumber: 1, text: "SECTION 1. Rent is $1000 per month.", charCount: 35, wordCount: 7 }],
        chunks: [{ id: "c1", text: "SECTION 1. Rent is $1000 per month.", charCount: 35, wordCount: 7, pageNumber: 1 }],
        warnings: [],
        errors: [],
      };

      const context = selectRelevantDocumentContext(mockPayload, "How much is rent?");
      expect(context.documentText).toBe(mockPayload.extractedText);
      expect(context.chunks?.length).toBe(1);
    });

    it("should select keyword-matched chunks for large documents", () => {
      const chunks = Array.from({ length: 20 }, (_, i) => ({
        id: `chunk_${i + 1}`,
        heading: `Section ${i + 1}`,
        text: i === 12 ? "Section 13: Termination requires 30 days notice." : `Section ${i + 1} general text content.`,
        charCount: 50,
        wordCount: 8,
        pageNumber: Math.floor(i / 5) + 1,
      }));

      const largePayload: ProcessedDocumentPayload = {
        documentId: "doc_large",
        filename: "large_contract.pdf",
        fileType: "pdf",
        fileSize: 500000,
        formattedSize: "500 KB",
        processedAt: new Date().toISOString(),
        status: "completed",
        extractedText: chunks.map((c) => c.text).join("\n").repeat(10), // > 15,000 chars
        characterCount: 20000,
        wordCount: 3000,
        pageCount: 4,
        pages: [],
        chunks,
        warnings: [],
        errors: [],
      };

      const context = selectRelevantDocumentContext(largePayload, "What is the termination notice requirement?");
      expect(context.chunks).toBeDefined();
      expect(context.chunks!.some((c) => c.id === "chunk_13")).toBe(true);
    });
  });

  describe("4. Q&A Service Flow & Mock Provider Testing", () => {
    it("should reject empty or whitespace-only questions", async () => {
      const mockPayload: ProcessedDocumentPayload = {
        documentId: "doc_test",
        filename: "lease.pdf",
        fileType: "pdf",
        fileSize: 500,
        formattedSize: "500 B",
        processedAt: new Date().toISOString(),
        status: "completed",
        extractedText: "Lease text...",
        characterCount: 100,
        wordCount: 20,
        pageCount: 1,
        pages: [],
        chunks: [],
        warnings: [],
        errors: [],
      };

      await expect(answerLegalQuestion(mockPayload, "   ")).rejects.toThrow("Question cannot be empty.");
    });

    it("should process Q&A query through mock AI provider adapter", async () => {
      const mockResult = {
        answer: "The security deposit is $2,200 and must be paid upon signing.",
        answerType: "document_fact",
        confidence: "Strongly supported by document",
        sources: [{ pageNumber: 1, sectionHeader: "Rent & Deposit", excerpt: "security deposit of $2,200.00 USD" }],
        limitations: [],
        suggestedFollowUps: ["When is the deposit returned?"],
      };

      const mockAdapter: AIProviderAdapter = {
        providerName: "Mock Q&A Gemini Adapter",
        generateContent: async <T>(opts: AIRequestOptions): Promise<AIResponse<T>> => {
          return {
            success: true,
            data: mockResult as T,
            rawContent: JSON.stringify(mockResult),
            task: opts.task,
            model: "gemini-2.5-flash",
            provider: "Mock Q&A Gemini Adapter",
            durationMs: 110,
          };
        },
      };

      setAIProviderAdapter(mockAdapter);

      const mockPayload: ProcessedDocumentPayload = {
        documentId: "doc_qa_123",
        filename: "apartment_lease.pdf",
        fileType: "pdf",
        fileSize: 12000,
        formattedSize: "12 KB",
        processedAt: new Date().toISOString(),
        status: "completed",
        extractedText: "Lease Agreement... Security deposit of $2,200.00 USD...",
        characterCount: 500,
        wordCount: 75,
        pageCount: 1,
        pages: [{ pageNumber: 1, text: "Lease Agreement...", charCount: 500, wordCount: 75 }],
        chunks: [{ id: "c1", text: "Lease Agreement...", charCount: 500, wordCount: 75, pageNumber: 1 }],
        warnings: [],
        errors: [],
      };

      const conversationHistory: QAMessageItem[] = [];

      const qaResult = await answerLegalQuestion(mockPayload, "What is the security deposit amount?", conversationHistory);

      expect(qaResult.question).toBe("What is the security deposit amount?");
      expect(qaResult.answer).toContain("$2,200");
      expect(qaResult.answerType).toBe("document_fact");
      expect(qaResult.confidence).toBe("Strongly supported by document");
      expect(qaResult.sources[0].pageNumber).toBe(1);
    });

    it("should handle AI provider failure cleanly", async () => {
      const failingAdapter: AIProviderAdapter = {
        providerName: "Failing Q&A Adapter",
        generateContent: async <T>(opts: AIRequestOptions): Promise<AIResponse<T>> => {
          return {
            success: false,
            rawContent: "",
            task: opts.task,
            model: "mock-model",
            provider: "Failing Q&A Adapter",
            durationMs: 30,
            error: {
              code: "PROVIDER_UNAVAILABLE",
              message: "API error",
              userMessage: "Failed to process question. Please try again.",
            },
          };
        },
      };

      setAIProviderAdapter(failingAdapter);

      const mockPayload: ProcessedDocumentPayload = {
        documentId: "doc_fail",
        filename: "contract.pdf",
        fileType: "pdf",
        fileSize: 1000,
        formattedSize: "1 KB",
        processedAt: new Date().toISOString(),
        status: "completed",
        extractedText: "Contract text...",
        characterCount: 100,
        wordCount: 15,
        pageCount: 1,
        pages: [],
        chunks: [],
        warnings: [],
        errors: [],
      };

      await expect(answerLegalQuestion(mockPayload, "What is the term?")).rejects.toThrow(
        "Failed to process question. Please try again."
      );
    });
  });
});

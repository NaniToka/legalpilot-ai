import { describe, it, expect, beforeEach } from "vitest";
import {
  computeDeterministicDiff,
  calculateTextSimilarity,
} from "../src/services/comparison/deterministicDiff";
import {
  buildComparisonTaskInstruction,
  validateDocumentComparisonResult,
} from "../src/services/ai/prompts/comparisonPrompt";
import { compareLegalDocuments } from "../src/services/comparison/documentComparisonService";
import { setAIProviderAdapter } from "../src/services/ai/aiService";
import { AIProviderAdapter } from "../src/services/ai/adapters/geminiAdapter";
import { ProcessedDocumentPayload, AIRequestOptions, AIResponse } from "../src/types";

describe("Step 10 — Legal Document Comparison Pipeline", () => {
  describe("1. Deterministic Text Diff Engine", () => {
    it("should correctly compute text similarity scores", () => {
      expect(calculateTextSimilarity("Hello world agreement", "Hello world agreement")).toBe(1.0);
      expect(calculateTextSimilarity("Rent is $2,000", "Rent is $2,500")).toBeGreaterThanOrEqual(0.5);
      expect(calculateTextSimilarity("Termination notice 30 days", "Completely unrelated text")).toBeLessThan(0.3);
    });

    it("should classify added, removed, modified, and unchanged structural chunks deterministically", () => {
      const payloadA: ProcessedDocumentPayload = {
        documentId: "doc_orig",
        filename: "Lease_v1.pdf",
        fileType: "pdf",
        fileSize: 10000,
        formattedSize: "10 KB",
        processedAt: new Date().toISOString(),
        status: "completed",
        extractedText: "Section 1. Rent is $2000 per month. Section 2. Either party may terminate with 30 days notice.",
        characterCount: 100,
        wordCount: 18,
        pageCount: 1,
        pages: [],
        chunks: [
          { id: "chunk_A1", heading: "Rent Clause", text: "Rent is $2000 per month.", charCount: 25, wordCount: 5, pageNumber: 1 },
          { id: "chunk_A2", heading: "Termination", text: "Either party may terminate with 30 days notice.", charCount: 48, wordCount: 8, pageNumber: 1 },
          { id: "chunk_A3", heading: "Old Clause", text: "This clause is removed in v2.", charCount: 30, wordCount: 6, pageNumber: 1 },
        ],
        warnings: [],
        errors: [],
      };

      const payloadB: ProcessedDocumentPayload = {
        documentId: "doc_new",
        filename: "Lease_v2.pdf",
        fileType: "pdf",
        fileSize: 12000,
        formattedSize: "12 KB",
        processedAt: new Date().toISOString(),
        status: "completed",
        extractedText: "Section 1. Rent is $2000 per month. Section 2. Either party may terminate with 60 days notice. Section 3. New Pet Policy.",
        characterCount: 130,
        wordCount: 22,
        pageCount: 1,
        pages: [],
        chunks: [
          { id: "chunk_B1", heading: "Rent Clause", text: "Rent is $2000 per month.", charCount: 25, wordCount: 5, pageNumber: 1 },
          { id: "chunk_B2", heading: "Termination", text: "Either party may terminate with 60 days notice.", charCount: 48, wordCount: 8, pageNumber: 1 },
          { id: "chunk_B4", heading: "Pet Policy", text: "No pets allowed without landlord consent.", charCount: 40, wordCount: 7, pageNumber: 1 },
        ],
        warnings: [],
        errors: [],
      };

      const diffResult = computeDeterministicDiff(payloadA, payloadB);

      expect(diffResult.totalChunksA).toBe(3);
      expect(diffResult.totalChunksB).toBe(3);
      expect(diffResult.unchangedChunksCount).toBe(1); // chunk_A1 === chunk_B1
      expect(diffResult.modifiedChunksCount).toBe(1); // 30 days vs 60 days notice
      expect(diffResult.removedChunksCount).toBe(1); // chunk_A3 removed
      expect(diffResult.addedChunksCount).toBe(1); // chunk_B4 added
    });
  });

  describe("2. Grounding Prompt & Schema Validation", () => {
    it("should build grounded task instructions adhering to Step 10 rules", () => {
      const instruction = buildComparisonTaskInstruction();

      expect(instruction).toContain("LEGAL DOCUMENT COMPARISON INSTRUCTIONS");
      expect(instruction).toContain("STRICT DOCUMENT EVIDENCE");
      expect(instruction).toContain("NO FABRICATION");
      expect(instruction).toContain("CHANGE CLASSIFICATION");
      expect(instruction).toContain("NO FAKE RISK SCORES");
      expect(instruction).not.toContain("83% riskier");
    });

    it("should validate complete structured document comparison response", () => {
      const rawMock = {
        summary: "Notice period increased from 30 to 60 days and monthly rent increased by $200.",
        affectedCategories: ["Termination", "Rent"],
        changes: [
          {
            category: "Termination",
            title: "Termination Notice Window",
            changeType: "modified",
            originalText: "30 days notice",
            newText: "60 days notice",
            explanation: "Notice window increased by 30 days.",
            whyItMayMatter: "Requires earlier planning before non-renewal.",
            originalSource: "Doc A, Page 1",
            newSource: "Doc B, Page 1",
          },
        ],
        changedObligations: [
          {
            party: "Tenant",
            originalObligation: "Provide 30 days notice",
            newObligation: "Provide 60 days notice",
            explanation: "Increased advance notice requirement.",
          },
        ],
        changedFinancialTerms: [
          {
            description: "Monthly Rent",
            originalAmount: "$2,000",
            newAmount: "$2,200",
            explanation: "Monthly rent increased by $200.",
          },
        ],
        changedDates: [
          {
            dateOrTrigger: "Notice Window",
            originalRequirement: "30 days prior to end",
            newRequirement: "60 days prior to end",
            explanation: "Notice deadline moved forward.",
          },
        ],
        changedTerminationTerms: [],
        questionsForReview: ["Does the rent increase apply immediately or upon renewal?"],
        limitations: [],
      };

      const payloadA: ProcessedDocumentPayload = {
        documentId: "dA",
        filename: "Original.pdf",
        fileType: "pdf",
        fileSize: 100,
        formattedSize: "100 B",
        processedAt: "",
        status: "completed",
        extractedText: "Text",
        characterCount: 4,
        wordCount: 1,
        pageCount: 1,
        pages: [],
        chunks: [],
        warnings: [],
        errors: [],
      };

      const payloadB: ProcessedDocumentPayload = {
        documentId: "dB",
        filename: "New.pdf",
        fileType: "pdf",
        fileSize: 100,
        formattedSize: "100 B",
        processedAt: "",
        status: "completed",
        extractedText: "Text",
        characterCount: 4,
        wordCount: 1,
        pageCount: 1,
        pages: [],
        chunks: [],
        warnings: [],
        errors: [],
      };

      const validated = validateDocumentComparisonResult(rawMock, payloadA, payloadB);

      expect(validated.documentAName).toBe("Original.pdf");
      expect(validated.documentBName).toBe("New.pdf");
      expect(validated.changes.length).toBe(1);
      expect(validated.changes[0].changeType).toBe("modified");
      expect(validated.changedFinancialTerms[0].newAmount).toBe("$2,200");
    });

    it("should throw error for non-object comparison responses", () => {
      const emptyPayload = {
        documentId: "d1",
        filename: "f.pdf",
        fileType: "pdf" as const,
        fileSize: 10,
        formattedSize: "10 B",
        processedAt: "",
        status: "completed" as const,
        extractedText: "text",
        characterCount: 4,
        wordCount: 1,
        pageCount: 1,
        pages: [],
        chunks: [],
        warnings: [],
        errors: [],
      };

      expect(() => validateDocumentComparisonResult(null, emptyPayload, emptyPayload)).toThrow(
        "Invalid document comparison output"
      );
    });
  });

  describe("3. Comparison Service Flow & Mock LLM Adapter", () => {
    it("should process document comparison through mock AI provider adapter", async () => {
      const mockResult = {
        summary: "Comparison identified 1 modified termination clause.",
        affectedCategories: ["Termination"],
        changes: [
          {
            category: "Termination",
            title: "Termination Notice Period",
            changeType: "modified",
            originalText: "30 days notice",
            newText: "60 days notice",
            explanation: "Notice period doubled from 30 days to 60 days.",
            whyItMayMatter: "Tenant must decide non-renewal earlier.",
            originalSource: "Page 1, Section 5",
            newSource: "Page 1, Section 5",
          },
        ],
        changedObligations: [],
        changedFinancialTerms: [],
        changedDates: [],
        changedTerminationTerms: [],
        questionsForReview: ["Can notice be delivered by email?"],
        limitations: [],
      };

      const mockAdapter: AIProviderAdapter = {
        providerName: "Mock Comparison Adapter",
        generateContent: async <T>(opts: AIRequestOptions): Promise<AIResponse<T>> => {
          return {
            success: true,
            data: mockResult as T,
            rawContent: JSON.stringify(mockResult),
            task: opts.task,
            model: "gemini-2.5-flash",
            provider: "Mock Comparison Adapter",
            durationMs: 140,
          };
        },
      };

      setAIProviderAdapter(mockAdapter);

      const payloadA: ProcessedDocumentPayload = {
        documentId: "doc_a_123",
        filename: "Agreement_v1.docx",
        fileType: "docx",
        fileSize: 15000,
        formattedSize: "14.6 KB",
        processedAt: new Date().toISOString(),
        status: "completed",
        extractedText: "AGREEMENT V1... SECTION 5. Either party may terminate with 30 days written notice.",
        characterCount: 500,
        wordCount: 80,
        pageCount: 1,
        pages: [{ pageNumber: 1, text: "AGREEMENT V1...", charCount: 500, wordCount: 80 }],
        chunks: [{ id: "c1", heading: "Termination", text: "30 days written notice.", charCount: 23, wordCount: 4, pageNumber: 1 }],
        warnings: [],
        errors: [],
      };

      const payloadB: ProcessedDocumentPayload = {
        documentId: "doc_b_456",
        filename: "Agreement_v2.docx",
        fileType: "docx",
        fileSize: 16000,
        formattedSize: "15.6 KB",
        processedAt: new Date().toISOString(),
        status: "completed",
        extractedText: "AGREEMENT V2... SECTION 5. Either party may terminate with 60 days written notice.",
        characterCount: 500,
        wordCount: 80,
        pageCount: 1,
        pages: [{ pageNumber: 1, text: "AGREEMENT V2...", charCount: 500, wordCount: 80 }],
        chunks: [{ id: "c1_v2", heading: "Termination", text: "60 days written notice.", charCount: 23, wordCount: 4, pageNumber: 1 }],
        warnings: [],
        errors: [],
      };

      const result = await compareLegalDocuments(payloadA, payloadB);

      expect(result.documentAName).toBe("Agreement_v1.docx");
      expect(result.documentBName).toBe("Agreement_v2.docx");
      expect(result.changes.length).toBe(1);
      expect(result.changes[0].changeType).toBe("modified");
      expect(result.changes[0].originalText).toContain("30 days notice");
      expect(result.changes[0].newText).toContain("60 days notice");
    });

    it("should throw error if Document A or Document B extracted text is missing", async () => {
      const emptyPayload: ProcessedDocumentPayload = {
        documentId: "doc_empty",
        filename: "empty.pdf",
        fileType: "pdf",
        fileSize: 0,
        formattedSize: "0 B",
        processedAt: new Date().toISOString(),
        status: "completed",
        extractedText: "",
        characterCount: 0,
        wordCount: 0,
        pageCount: 1,
        pages: [],
        chunks: [],
        warnings: [],
        errors: [],
      };

      await expect(compareLegalDocuments(emptyPayload, emptyPayload)).rejects.toThrow(
        "Document A (Original) text is empty or missing."
      );
    });
  });
});

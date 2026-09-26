import { describe, it, expect, beforeEach } from "vitest";
import {
  buildNextStepsTaskInstruction,
  validateNextStepsResult,
} from "../src/services/ai/prompts/nextStepsPrompt";
import { generateDocumentNextSteps } from "../src/services/ai/nextStepsService";
import { setAIProviderAdapter } from "../src/services/ai/aiService";
import { AIProviderAdapter } from "../src/services/ai/adapters/geminiAdapter";
import { ProcessedDocumentPayload, AIRequestOptions, AIResponse } from "../src/types";

describe("Step 11 — Actionable Next Steps / Document Checklist Pipeline", () => {
  describe("1. Prompt Construction & Grounding Rules", () => {
    it("should build grounded task instructions adhering to Step 11 rules", () => {
      const instruction = buildNextStepsTaskInstruction();

      expect(instruction).toContain("ACTIONABLE NEXT STEPS & DOCUMENT CHECKLIST INSTRUCTIONS");
      expect(instruction).toContain("STRICT DOCUMENT EVIDENCE");
      expect(instruction).toContain("DISTINGUISH FACTS FROM SUGGESTIONS");
      expect(instruction).toContain("RELATIVE DEADLINES & DATES");
      expect(instruction).toContain("MISSING INFORMATION ITEMS");
      expect(instruction).toContain("PRACTICAL PRIORITY (NOT LEGAL RISK)");
      expect(instruction).toContain("DEADLINE");
      expect(instruction).toContain("OBLIGATION");
      expect(instruction).toContain("INFORMATION_NEEDED");
    });
  });

  describe("2. Response Schema Validation & Normalization", () => {
    it("should validate and map complete structured next steps checklist response", () => {
      const mockPayload: ProcessedDocumentPayload = {
        documentId: "doc_chk_123",
        filename: "Lease_Agreement.pdf",
        fileType: "pdf",
        fileSize: 15000,
        formattedSize: "14.6 KB",
        processedAt: new Date().toISOString(),
        status: "completed",
        extractedText: "Lease text...",
        characterCount: 500,
        wordCount: 80,
        pageCount: 1,
        pages: [],
        chunks: [],
        warnings: [],
        errors: [],
      };

      const rawMock = {
        items: [
          {
            title: "Check termination notice deadline",
            description: "Provide written notice of non-renewal at least 60 days before contract expiry.",
            category: "DEADLINE",
            priority: "HIGH",
            dueDateText: "60 days prior to lease end",
            relatedClause: "Section 2. Term & Renewal",
            reason: "Failing to give notice causes automatic 12-month renewal.",
            sourceReferences: ["Page 1, Section 2"],
            questions: ["Can non-renewal notice be sent via email?"],
          },
          {
            title: "Confirm security deposit return timeline",
            description: "Clarify when deposit will be returned post-move out.",
            category: "INFORMATION_NEEDED",
            priority: "MEDIUM",
            reason: "Deposit return window is not specified in lease text.",
            sourceReferences: [],
            questions: ["What is the statutory deposit return limit in California?"],
          },
        ],
        questionsForProfessional: [
          "Is the automatic 12-month renewal clause enforceable without explicit secondary confirmation?",
        ],
        limitations: ["Deposit return timeline not specified in provided document text."],
      };

      const validated = validateNextStepsResult(rawMock, mockPayload);

      expect(validated.documentId).toBe("doc_chk_123");
      expect(validated.documentName).toBe("Lease_Agreement.pdf");
      expect(validated.totalItemsCount).toBe(2);
      expect(validated.highPriorityCount).toBe(1);

      const item1 = validated.items[0];
      expect(item1.category).toBe("DEADLINE");
      expect(item1.priority).toBe("HIGH");
      expect(item1.status).toBe("TODO");
      expect(item1.dueDateText).toBe("60 days prior to lease end");
      expect(item1.sourceReferences).toContain("Page 1, Section 2");

      const item2 = validated.items[1];
      expect(item2.category).toBe("INFORMATION_NEEDED");
      expect(item2.priority).toBe("MEDIUM");

      expect(validated.questionsForProfessional.length).toBe(1);
      expect(validated.limitations.length).toBe(1);
    });

    it("should handle missing optional fields and default invalid categories to REVIEW", () => {
      const mockPayload: ProcessedDocumentPayload = {
        documentId: "doc_minimal",
        filename: "Minimal.docx",
        fileType: "docx",
        fileSize: 5000,
        formattedSize: "4.8 KB",
        processedAt: new Date().toISOString(),
        status: "completed",
        extractedText: "Text...",
        characterCount: 100,
        wordCount: 15,
        pageCount: 1,
        pages: [],
        chunks: [],
        warnings: [],
        errors: [],
      };

      const rawMockMinimal = {
        items: [
          {
            title: "Review general provisions",
            description: "Check agreement terms.",
            category: "UNKNOWN_CATEGORY_STRING",
            priority: "INVALID_PRIORITY",
            reason: "General review.",
          },
        ],
        questionsForProfessional: [],
        limitations: [],
      };

      const validated = validateNextStepsResult(rawMockMinimal, mockPayload);

      expect(validated.items[0].category).toBe("REVIEW");
      expect(validated.items[0].priority).toBe("MEDIUM");
      expect(validated.items[0].status).toBe("TODO");
      expect(validated.items[0].dueDate).toBeUndefined();
      expect(validated.items[0].dueDateText).toBeUndefined();
    });

    it("should throw error for non-object raw response", () => {
      const mockPayload: ProcessedDocumentPayload = {
        documentId: "d1",
        filename: "f.pdf",
        fileType: "pdf",
        fileSize: 10,
        formattedSize: "10 B",
        processedAt: "",
        status: "completed",
        extractedText: "text",
        characterCount: 4,
        wordCount: 1,
        pageCount: 1,
        pages: [],
        chunks: [],
        warnings: [],
        errors: [],
      };

      expect(() => validateNextStepsResult(null, mockPayload)).toThrow("Invalid next steps output");
    });
  });

  describe("3. Next Steps Service Flow & Mock LLM Adapter", () => {
    it("should process next steps generation via mock AI provider adapter", async () => {
      const mockResult = {
        items: [
          {
            title: "Obtain $100,000 Renters Insurance",
            description: "Tenant must maintain $100,000 liability insurance policy throughout lease term.",
            category: "OBLIGATION",
            priority: "HIGH",
            dueDateText: "Prior to lease commencement",
            relatedClause: "Section 4. Obligations of Tenant",
            reason: "Explicit insurance coverage requirement in contract.",
            sourceReferences: ["Page 2, Section 4"],
            questions: ["Does landlord require being named as additional insured?"],
          },
        ],
        questionsForProfessional: ["Does tenant need to provide proof of insurance annually?"],
        limitations: [],
      };

      const mockAdapter: AIProviderAdapter = {
        providerName: "Mock Next Steps Adapter",
        generateContent: async <T>(opts: AIRequestOptions): Promise<AIResponse<T>> => {
          return {
            success: true,
            data: mockResult as T,
            rawContent: JSON.stringify(mockResult),
            task: opts.task,
            model: "gemini-2.5-flash",
            provider: "Mock Next Steps Adapter",
            durationMs: 130,
          };
        },
      };

      setAIProviderAdapter(mockAdapter);

      const mockPayload: ProcessedDocumentPayload = {
        documentId: "doc_srv_789",
        filename: "Lease_Contract.pdf",
        fileType: "pdf",
        fileSize: 20000,
        formattedSize: "19.5 KB",
        processedAt: new Date().toISOString(),
        status: "completed",
        extractedText: "LEASE CONTRACT... SECTION 4. Tenant must maintain $100,000 renters insurance.",
        characterCount: 600,
        wordCount: 90,
        pageCount: 2,
        pages: [{ pageNumber: 2, text: "SECTION 4...", charCount: 300, wordCount: 45 }],
        chunks: [{ id: "c4", heading: "Obligations", text: "$100,000 renters insurance.", charCount: 30, wordCount: 4, pageNumber: 2 }],
        warnings: [],
        errors: [],
      };

      const result = await generateDocumentNextSteps(mockPayload);

      expect(result.documentId).toBe("doc_srv_789");
      expect(result.documentName).toBe("Lease_Contract.pdf");
      expect(result.totalItemsCount).toBe(1);
      expect(result.items[0].category).toBe("OBLIGATION");
      expect(result.items[0].priority).toBe("HIGH");
      expect(result.items[0].title).toContain("Renters Insurance");
    });

    it("should throw error if document extracted text is missing or empty", async () => {
      const emptyPayload: ProcessedDocumentPayload = {
        documentId: "doc_empty",
        filename: "empty.pdf",
        fileType: "pdf",
        fileSize: 0,
        formattedSize: "0 B",
        processedAt: new Date().toISOString(),
        status: "completed",
        extractedText: "   ",
        characterCount: 0,
        wordCount: 0,
        pageCount: 1,
        pages: [],
        chunks: [],
        warnings: [],
        errors: [],
      };

      await expect(generateDocumentNextSteps(emptyPayload)).rejects.toThrow(
        "Cannot generate next steps: Document text is empty or missing."
      );
    });

    it("should handle AI provider failure cleanly", async () => {
      const failingAdapter: AIProviderAdapter = {
        providerName: "Failing Next Steps Adapter",
        generateContent: async <T>(opts: AIRequestOptions): Promise<AIResponse<T>> => {
          return {
            success: false,
            rawContent: "",
            task: opts.task,
            model: "mock-model",
            provider: "Failing Next Steps Adapter",
            durationMs: 40,
            error: {
              code: "PROVIDER_UNAVAILABLE",
              message: "API error",
              userMessage: "Failed to generate next steps checklist. Please try again.",
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

      await expect(generateDocumentNextSteps(mockPayload)).rejects.toThrow(
        "Failed to generate next steps checklist. Please try again."
      );
    });
  });
});

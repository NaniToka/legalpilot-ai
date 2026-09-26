import { describe, it, expect, beforeEach } from "vitest";
import {
  buildDocumentUnderstandingTaskInstruction,
  validateDocumentUnderstandingAnalysis,
} from "../src/services/ai/prompts/documentUnderstandingPrompt";
import { analyzeDocumentUnderstanding } from "../src/services/ai/documentAnalysisService";
import { setAIProviderAdapter } from "../src/services/ai/aiService";
import { AIProviderAdapter } from "../src/services/ai/adapters/geminiAdapter";
import { ProcessedDocumentPayload, AIRequestOptions, AIResponse } from "../src/types";

describe("Step 7 — AI Legal Document Understanding Pipeline", () => {
  describe("1. Document Understanding Prompt & Grounding Rules", () => {
    it("should construct grounded system instructions enforcing non-fabrication rules", () => {
      const instruction = buildDocumentUnderstandingTaskInstruction();

      expect(instruction).toContain("STRICT GROUNDING");
      expect(instruction).toContain("Do NOT invent party names");
      expect(instruction).toContain("Not specified in the document.");
      expect(instruction).toContain("INFORMATIONAL ASSISTANCE ONLY");
    });
  });

  describe("2. Response Schema Validation & Sanitization", () => {
    it("should validate and populate fallback strings for unspecified fields", () => {
      const rawMockResponse = {
        documentType: "Residential Lease Agreement",
        overview: "This is a 12-month lease agreement between Landlord and Tenant.",
        purpose: "Lease of residential apartment unit.",
        parties: [{ name: "Acme Rentals LLC", role: "Landlord", sourceRef: "Page 1" }],
        importantDates: [{ date: "October 1, 2026", description: "Lease Start Date" }],
        keyObligations: [],
        keyRights: [],
        financialTerms: [{ term: "Monthly Rent", amount: "$2,000", description: "Due on 1st of month" }],
        duration: "12 Months",
        termination: "", // empty -> fallback
        importantClauses: [],
        questionsForLawyer: ["Can the rent increase during the term?"],
        limitations: ["Security deposit return timeline not specified."],
      };

      const validated = validateDocumentUnderstandingAnalysis(rawMockResponse, "doc_test_123");

      expect(validated.documentId).toBe("doc_test_123");
      expect(validated.documentType).toBe("Residential Lease Agreement");
      expect(validated.parties.length).toBe(1);
      expect(validated.parties[0].name).toBe("Acme Rentals LLC");
      expect(validated.termination).toBe("Not specified in the document.");
      expect(validated.questionsForLawyer).toContain("Can the rent increase during the term?");
    });

    it("should handle corrupted or non-object raw responses gracefully", () => {
      expect(() => validateDocumentUnderstandingAnalysis("invalid string response", "doc_1")).toThrow(
        "Invalid AI analysis output"
      );
    });
  });

  describe("3. Document Analysis Service Flow with Mock Provider Adapter", () => {
    it("should execute analyzeDocumentUnderstanding through mock provider cleanly", async () => {
      const mockAnalysisData = {
        documentType: "Independent Contractor Agreement",
        overview: "Agreement for software development services.",
        purpose: "Development of web applications.",
        parties: [{ name: "Client Corp", role: "Client" }, { name: "Dev LLC", role: "Contractor" }],
        importantDates: [{ date: "November 1, 2026", description: "Project Kickoff" }],
        keyObligations: [{ obligation: "Deliver code milestone", party: "Dev LLC" }],
        keyRights: [{ right: "Terminate with 30 days notice", party: "Client Corp" }],
        financialTerms: [{ term: "Hourly Rate", amount: "$150/hr", description: "Billed bi-weekly" }],
        duration: "6 Months",
        termination: "30 days written notice",
        importantClauses: [
          {
            title: "Intellectual Property Transfer",
            explanation: "All work product belongs to Client Corp upon payment.",
            whyItMatters: "Ensures client owns developed software.",
          },
        ],
        questionsForLawyer: ["Does contractor retain pre-existing code rights?"],
        limitations: ["Jurisdiction not specified."],
      };

      const mockAdapter: AIProviderAdapter = {
        providerName: "Mock Test LLM",
        generateContent: async <T>(opts: AIRequestOptions): Promise<AIResponse<T>> => {
          return {
            success: true,
            data: mockAnalysisData as T,
            rawContent: JSON.stringify(mockAnalysisData),
            task: opts.task,
            model: "mock-model",
            provider: "Mock Test LLM",
            durationMs: 120,
          };
        },
      };

      setAIProviderAdapter(mockAdapter);

      const mockPayload: ProcessedDocumentPayload = {
        documentId: "doc_test_456",
        filename: "service_contract.docx",
        fileType: "docx",
        fileSize: 12400,
        formattedSize: "12.1 KB",
        processedAt: new Date().toISOString(),
        status: "completed",
        extractedText: "SECTION 1. SERVICE AGREEMENT between Client Corp and Dev LLC...",
        characterCount: 500,
        wordCount: 80,
        pageCount: 1,
        pages: [{ pageNumber: 1, text: "SECTION 1...", charCount: 500, wordCount: 80 }],
        chunks: [{ id: "chunk_1", text: "SECTION 1...", charCount: 500, wordCount: 80, pageNumber: 1 }],
        warnings: [],
        errors: [],
      };

      const analysis = await analyzeDocumentUnderstanding(mockPayload);

      expect(analysis.documentId).toBe("doc_test_456");
      expect(analysis.documentType).toBe("Independent Contractor Agreement");
      expect(analysis.parties.length).toBe(2);
      expect(analysis.importantClauses[0].title).toBe("Intellectual Property Transfer");
    });

    it("should reject document payload with empty extracted text", async () => {
      const emptyPayload: ProcessedDocumentPayload = {
        documentId: "doc_empty",
        filename: "empty.pdf",
        fileType: "pdf",
        fileSize: 100,
        formattedSize: "100 Bytes",
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

      await expect(analyzeDocumentUnderstanding(emptyPayload)).rejects.toThrow(
        "Document text is empty"
      );
    });
  });
});

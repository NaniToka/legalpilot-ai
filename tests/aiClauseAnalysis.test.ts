import { describe, it, expect, beforeEach } from "vitest";
import {
  buildClauseAnalysisTaskInstruction,
  validateClauseAnalysisResult,
} from "../src/services/ai/prompts/clauseAnalysisPrompt";
import { analyzeImportantClauses } from "../src/services/ai/clauseAnalysisService";
import { setAIProviderAdapter } from "../src/services/ai/aiService";
import { AIProviderAdapter } from "../src/services/ai/adapters/geminiAdapter";
import { ProcessedDocumentPayload, AIRequestOptions, AIResponse } from "../src/types";

describe("Step 8 — AI Legal Clause, Obligation & Attention-Point Analysis Pipeline", () => {
  describe("1. Prompt Construction & Grounding Instructions", () => {
    it("should build grounded task instructions adhering to Step 8 rules", () => {
      const instruction = buildClauseAnalysisTaskInstruction();

      expect(instruction).toContain("CLAUSE, OBLIGATION & ATTENTION-POINT ANALYSIS INSTRUCTIONS");
      expect(instruction).toContain("STRICT DOCUMENT EVIDENCE");
      expect(instruction).toContain("NEUTRAL ATTENTION POINTS");
      expect(instruction).toContain("SEVERITY PRIORITIZATION");
      expect(instruction).toContain("Review");
      expect(instruction).toContain("Important");
      expect(instruction).toContain("High Attention");
      expect(instruction).not.toContain("legal risk score");
    });
  });

  describe("2. Response Validation & Severity Mapping", () => {
    it("should correctly validate complete structured clause analysis output", () => {
      const rawMock = {
        documentType: "Master Services Agreement",
        importantClauses: [
          {
            category: "Termination",
            title: "Termination for Convenience",
            clauseSummary: "Either party may terminate with 30 days written notice.",
            plainLanguageExplanation: "Either side can cancel the contract by writing 30 days ahead.",
            whyItMatters: "Provides an easy exit window if requirements change.",
            sourceReference: "Section 8.2, Page 4",
          },
        ],
        obligations: [
          {
            party: "Vendor",
            obligation: "Maintain liability insurance of $1,000,000.",
            deadline: "Throughout Term",
            consequenceIfStated: "Material breach allowing immediate termination.",
            sourceReference: "Section 11.1, Page 5",
          },
        ],
        rights: [
          {
            party: "Client",
            right: "Audit Vendor financial records once per calendar year.",
            conditions: "Subject to 10 business days prior notice.",
            sourceReference: "Section 14.3, Page 7",
          },
        ],
        attentionPoints: [
          {
            title: "Automatic Renewal Clause",
            explanation: "Contract renews automatically for 12 months unless notice given 60 days before expiration.",
            reasonForReview: "Calendar reminder needed to prevent unintended multi-year binding.",
            severity: "High Attention",
            sourceReference: "Section 3.1, Page 2",
          },
        ],
        deadlines: [
          {
            dateOrTrigger: "60 days prior to expiry",
            requirement: "Written non-renewal notice",
            sourceReference: "Section 3.1",
          },
        ],
        financialCommitments: [
          {
            description: "Annual Maintenance Fee",
            amount: "$15,000",
            currency: "USD",
            conditions: "Payable net-30 from invoice",
            sourceReference: "Schedule B",
          },
        ],
        questionsForProfessional: [
          {
            question: "Is the indemnity clause reciprocal under applicable state law?",
            reason: "Section 12 currently imposes unilateral indemnity on the Vendor.",
          },
        ],
        limitations: ["No governing law clause detected in provided text."],
      };

      const validated = validateClauseAnalysisResult(rawMock, "doc_clause_123");

      expect(validated.documentId).toBe("doc_clause_123");
      expect(validated.documentType).toBe("Master Services Agreement");
      expect(validated.importantClauses.length).toBe(1);
      expect(validated.importantClauses[0].category).toBe("Termination");
      expect(validated.obligations[0].party).toBe("Vendor");
      expect(validated.rights[0].party).toBe("Client");
      expect(validated.attentionPoints[0].severity).toBe("High Attention");
      expect(validated.deadlines[0].dateOrTrigger).toBe("60 days prior to expiry");
      expect(validated.financialCommitments[0].amount).toBe("$15,000");
      expect(validated.questionsForProfessional[0].question).toContain("indemnity clause");
      expect(validated.limitations).toContain("No governing law clause detected in provided text.");
    });

    it("should handle missing optional source references gracefully", () => {
      const rawMockMissingRefs = {
        documentType: "Non-Disclosure Agreement",
        importantClauses: [
          {
            category: "Confidentiality",
            title: "Definition of Confidential Information",
            clauseSummary: "Includes all proprietary technology.",
            plainLanguageExplanation: "Everything shared is secret.",
            whyItMatters: "Protects company secrets.",
          },
        ],
        obligations: [],
        rights: [],
        attentionPoints: [],
        deadlines: [],
        financialCommitments: [],
        questionsForProfessional: [],
        limitations: [],
      };

      const validated = validateClauseAnalysisResult(rawMockMissingRefs, "doc_norefs");

      expect(validated.importantClauses[0].sourceReference).toBeUndefined();
      expect(validated.attentionPoints.length).toBe(0);
    });

    it("should default unknown severity strings to 'Review'", () => {
      const rawMockInvalidSeverity = {
        documentType: "Agreement",
        importantClauses: [],
        obligations: [],
        rights: [],
        attentionPoints: [
          {
            title: "Indemnity",
            explanation: "Broad indemnity.",
            reasonForReview: "Needs legal check.",
            severity: "UnknownSeveritySuperHigh",
          },
        ],
        deadlines: [],
        financialCommitments: [],
        questionsForProfessional: [],
        limitations: [],
      };

      const validated = validateClauseAnalysisResult(rawMockInvalidSeverity, "doc_sev");
      expect(validated.attentionPoints[0].severity).toBe("Review");
    });

    it("should throw error for null or non-object raw responses", () => {
      expect(() => validateClauseAnalysisResult(null, "doc_1")).toThrow("Invalid clause analysis output");
    });
  });

  describe("3. Service Execution & Mock Provider Testing", () => {
    it("should process document payload via mock AI provider adapter", async () => {
      const mockResult = {
        documentType: "Employment Agreement",
        importantClauses: [
          {
            category: "Non-Compete",
            title: "Post-Employment Restrictive Covenant",
            clauseSummary: "12-month geographic restriction within 50 miles.",
            plainLanguageExplanation: "You cannot work for competitors within 50 miles for 1 year.",
            whyItMatters: "May restrict future job mobility.",
            sourceReference: "Section 9.1",
          },
        ],
        obligations: [{ party: "Employee", obligation: "Return all company laptops upon exit." }],
        rights: [{ party: "Employer", right: "Terminate employment at-will with notice." }],
        attentionPoints: [
          {
            title: "Broad Non-Compete Scope",
            explanation: "Restricts all software roles within 50 miles.",
            reasonForReview: "Review scope with local employment counsel.",
            severity: "Important",
          },
        ],
        deadlines: [{ dateOrTrigger: "On departure date", requirement: "Return equipment" }],
        financialCommitments: [{ description: "Base Salary", amount: "$120,000", currency: "USD" }],
        questionsForProfessional: [{ question: "Is this non-compete enforceable in California?", reason: "State law rules." }],
        limitations: [],
      };

      const mockAdapter: AIProviderAdapter = {
        providerName: "Mock Gemini Adapter",
        generateContent: async <T>(opts: AIRequestOptions): Promise<AIResponse<T>> => {
          return {
            success: true,
            data: mockResult as T,
            rawContent: JSON.stringify(mockResult),
            task: opts.task,
            model: "gemini-2.5-flash",
            provider: "Mock Gemini Adapter",
            durationMs: 150,
          };
        },
      };

      setAIProviderAdapter(mockAdapter);

      const mockPayload: ProcessedDocumentPayload = {
        documentId: "doc_emp_999",
        filename: "employment_agreement.pdf",
        fileType: "pdf",
        fileSize: 45000,
        formattedSize: "44 KB",
        processedAt: new Date().toISOString(),
        status: "completed",
        extractedText: "EMPLOYMENT AGREEMENT... SECTION 9. RESTRICTIVE COVENANTS...",
        characterCount: 1500,
        wordCount: 250,
        pageCount: 3,
        pages: [{ pageNumber: 1, text: "EMPLOYMENT AGREEMENT...", charCount: 500, wordCount: 80 }],
        chunks: [{ id: "chunk_1", text: "EMPLOYMENT AGREEMENT...", charCount: 500, wordCount: 80, pageNumber: 1 }],
        warnings: [],
        errors: [],
      };

      const result = await analyzeImportantClauses(mockPayload);

      expect(result.documentId).toBe("doc_emp_999");
      expect(result.documentType).toBe("Employment Agreement");
      expect(result.importantClauses[0].title).toBe("Post-Employment Restrictive Covenant");
      expect(result.attentionPoints[0].severity).toBe("Important");
    });

    it("should throw error if document extractedText is empty", async () => {
      const emptyPayload: ProcessedDocumentPayload = {
        documentId: "doc_empty",
        filename: "empty.pdf",
        fileType: "pdf",
        fileSize: 10,
        formattedSize: "10 Bytes",
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

      await expect(analyzeImportantClauses(emptyPayload)).rejects.toThrow(
        "Cannot analyze clauses: Document text is empty or missing."
      );
    });

    it("should handle AI provider failure cleanly", async () => {
      const failingAdapter: AIProviderAdapter = {
        providerName: "Failing Adapter",
        generateContent: async <T>(opts: AIRequestOptions): Promise<AIResponse<T>> => {
          return {
            success: false,
            rawContent: "",
            task: opts.task,
            model: "mock-model",
            provider: "Failing Adapter",
            durationMs: 50,
            error: {
              code: "PROVIDER_UNAVAILABLE",
              message: "Gemini API unavailable",
              userMessage: "Unable to complete clause analysis right now. Please try again.",
            },
          };
        },
      };

      setAIProviderAdapter(failingAdapter);

      const mockPayload: ProcessedDocumentPayload = {
        documentId: "doc_fail",
        filename: "lease.pdf",
        fileType: "pdf",
        fileSize: 5000,
        formattedSize: "5 KB",
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

      await expect(analyzeImportantClauses(mockPayload)).rejects.toThrow(
        "Unable to complete clause analysis right now. Please try again."
      );
    });
  });
});

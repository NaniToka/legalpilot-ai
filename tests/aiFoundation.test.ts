import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { executeAIRequest, setAIProviderAdapter, getActiveAIProviderName } from "../src/services/ai/aiService";
import { GeminiAdapter, AIProviderAdapter } from "../src/services/ai/adapters/geminiAdapter";
import { normalizeAIError } from "../src/services/ai/aiErrorNormalizer";
import {
  BASE_LEGAL_SAFETY_INSTRUCTION,
  buildGroundedSystemInstruction,
  formatGroundedDocumentContext,
} from "../src/services/ai/prompts/legalSystemPrompts";
import { AIRequestOptions, AIResponse } from "../src/types/ai";

describe("Step 6 — Secure AI Foundation Pipeline", () => {
  const originalEnv = process.env.GOOGLE_GEMINI_API_KEY;

  beforeEach(() => {
    // Reset provider to GeminiAdapter
    setAIProviderAdapter(new GeminiAdapter());
  });

  afterEach(() => {
    process.env.GOOGLE_GEMINI_API_KEY = originalEnv;
  });

  describe("1. AI Configuration & Missing API Key Validation", () => {
    it("should gracefully handle missing GOOGLE_GEMINI_API_KEY without throwing unhandled exceptions", async () => {
      delete process.env.GOOGLE_GEMINI_API_KEY;

      const response = await executeAIRequest({
        task: "health_check",
        userInput: "Test status",
      });

      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
      expect(response.error?.code).toBe("MISSING_API_KEY");
      expect(response.error?.userMessage).toContain("AI service is not configured");
    });

    it("should report active provider name correctly", () => {
      expect(getActiveAIProviderName()).toBe("Google Gemini");
    });
  });

  describe("2. Provider Error Normalization", () => {
    it("should normalize HTTP 429 / rate limits to RATE_LIMIT_EXCEEDED", () => {
      const error = normalizeAIError("Resource has been exhausted (e.g. check quota, 429 rate limit)");
      expect(error.code).toBe("RATE_LIMIT_EXCEEDED");
      expect(error.userMessage).toContain("rate limit reached");
    });

    it("should normalize timeout errors to TIMEOUT", () => {
      const error = normalizeAIError("AI Request timed out after 30000ms");
      expect(error.code).toBe("TIMEOUT");
      expect(error.userMessage).toContain("timed out");
    });

    it("should normalize malformed JSON errors to MALFORMED_OUTPUT", () => {
      const error = normalizeAIError("JSON Parse Failure: Unexpected token in JSON");
      expect(error.code).toBe("MALFORMED_OUTPUT");
      expect(error.userMessage).toContain("parse structured AI response");
    });

    it("should normalize 503 provider errors to PROVIDER_UNAVAILABLE", () => {
      const error = normalizeAIError("503 Service Unavailable: Model is overloaded");
      expect(error.code).toBe("PROVIDER_UNAVAILABLE");
      expect(error.userMessage).toContain("temporarily unavailable");
    });
  });

  describe("3. Mock Provider Adapter & Response Contract Validation", () => {
    it("should execute requests through mock AI adapter and return normalized payload", async () => {
      const mockAdapter: AIProviderAdapter = {
        providerName: "Mock Test Provider",
        generateContent: async <T>(opts: AIRequestOptions): Promise<AIResponse<T>> => {
          return {
            success: true,
            data: { testKey: "testValue" } as T,
            rawContent: '{"testKey":"testValue"}',
            task: opts.task,
            model: "mock-model",
            provider: "Mock Test Provider",
            usage: { promptTokens: 50, candidatesTokens: 20, totalTokens: 70 },
            durationMs: 45,
          };
        },
      };

      setAIProviderAdapter(mockAdapter);

      const response = await executeAIRequest({
        task: "unit_test_task",
        userInput: "Run mock test",
      });

      expect(response.success).toBe(true);
      expect(response.provider).toBe("Mock Test Provider");
      expect(response.data).toEqual({ testKey: "testValue" });
      expect(response.usage?.totalTokens).toBe(70);
      expect(response.durationMs).toBeGreaterThan(0);
    });
  });

  describe("4. Grounding Rules & Legal Safety Instruction Integrity", () => {
    it("should enforce evidence grounding rules in base safety instruction", () => {
      expect(BASE_LEGAL_SAFETY_INSTRUCTION).toContain("STRICT EVIDENCE GROUNDING");
      expect(BASE_LEGAL_SAFETY_INSTRUCTION).toContain("NO FABRICATION");
      expect(BASE_LEGAL_SAFETY_INSTRUCTION).toContain("NOT a licensed attorney");
    });

    it("should append task-specific instructions without overwriting safety constraints", () => {
      const instruction = buildGroundedSystemInstruction("Analyze non-disclosure obligations.");

      expect(instruction).toContain(BASE_LEGAL_SAFETY_INSTRUCTION);
      expect(instruction).toContain("TASK-SPECIFIC INSTRUCTIONS:");
      expect(instruction).toContain("Analyze non-disclosure obligations.");
    });

    it("should format grounded document context cleanly for LLM consumption", () => {
      const context = formatGroundedDocumentContext({
        filename: "lease_agreement.pdf",
        pages: [
          { pageNumber: 1, text: "Section 1: Tenant shall pay $2,000 monthly rent." },
          { pageNumber: 2, text: "Section 2: Lease expires on December 31." },
        ],
      });

      expect(context).toContain("DOCUMENT FILENAME: lease_agreement.pdf");
      expect(context).toContain("[PAGE 1]");
      expect(context).toContain("Tenant shall pay $2,000 monthly rent");
    });
  });
});

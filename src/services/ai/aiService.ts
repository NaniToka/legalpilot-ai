/**
 * LegalPilot AI - Master AI Service Layer
 * Decouples application UI and business logic from underlying LLM provider APIs.
 */

import { AIRequestOptions, AIResponse } from "@/types/ai";
import { AIProviderAdapter, GeminiAdapter } from "./adapters/geminiAdapter";
import { buildTestHealthPrompt } from "./prompts/legalSystemPrompts";

// Singleton instance of configured provider adapter
let currentAdapter: AIProviderAdapter = new GeminiAdapter();

// Bounded in-memory response cache to prevent duplicate AI calls
const aiResponseCache = new Map<string, { response: AIResponse; cachedAt: number }>();
const MAX_CACHE_ENTRIES = 100;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function generateCacheKey(options: AIRequestOptions): string {
  const docKey = options.documentContext
    ? `${options.documentContext.filename || ""}_${options.documentContext.documentText?.length || 0}_${(options.documentContext.chunks || []).length}`
    : "nodoc";
  return `${options.task}:${docKey}:${options.userInput || ""}:${options.model || "default"}`;
}

/**
 * Configure or override active AI provider adapter
 */
export function setAIProviderAdapter(adapter: AIProviderAdapter): void {
  currentAdapter = adapter;
  aiResponseCache.clear();
}

/**
 * Clear AI response cache
 */
export function clearAICache(): void {
  aiResponseCache.clear();
}

/**
 * Get name of currently configured AI provider
 */
export function getActiveAIProviderName(): string {
  return currentAdapter.providerName;
}

/**
 * Execute a structured or unstructured AI request through the active provider abstraction
 */
export async function executeAIRequest<T = any>(
  options: AIRequestOptions
): Promise<AIResponse<T>> {
  // Do not cache health checks or explicit non-cache requests
  if (options.task === "health_check") {
    return currentAdapter.generateContent<T>(options);
  }

  const cacheKey = generateCacheKey(options);
  const now = Date.now();
  const cached = aiResponseCache.get(cacheKey);

  if (cached && now - cached.cachedAt < CACHE_TTL_MS && cached.response.success) {
    return cached.response as AIResponse<T>;
  }

  const freshResponse = await currentAdapter.generateContent<T>(options);

  if (freshResponse.success) {
    if (aiResponseCache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = aiResponseCache.keys().next().value;
      if (oldestKey) aiResponseCache.delete(oldestKey);
    }
    aiResponseCache.set(cacheKey, { response: freshResponse, cachedAt: now });
  }

  return freshResponse;
}

/**
 * Simple diagnostic health check verifying AI service readiness
 */
export async function checkAIServiceHealth(): Promise<AIResponse> {
  const { systemInstruction, userPrompt } = buildTestHealthPrompt();
  return executeAIRequest({
    task: "health_check",
    systemInstruction,
    userInput: userPrompt,
    temperature: 0.1,
  });
}

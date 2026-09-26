/**
 * LegalPilot AI - Master AI Service Layer
 * Decouples application UI and business logic from underlying LLM provider APIs.
 */

import { AIRequestOptions, AIResponse } from "@/types/ai";
import { AIProviderAdapter, GeminiAdapter } from "./adapters/geminiAdapter";
import { buildTestHealthPrompt } from "./prompts/legalSystemPrompts";

// Singleton instance of configured provider adapter
let currentAdapter: AIProviderAdapter = new GeminiAdapter();

/**
 * Configure or override active AI provider adapter
 */
export function setAIProviderAdapter(adapter: AIProviderAdapter): void {
  currentAdapter = adapter;
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
  return currentAdapter.generateContent<T>(options);
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

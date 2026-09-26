import { GoogleGenAI } from "@google/genai";
import { AIRequestOptions, AIResponse } from "@/types/ai";
import { normalizeAIError } from "../aiErrorNormalizer";
import { formatGroundedDocumentContext, buildGroundedSystemInstruction } from "../prompts/legalSystemPrompts";

let cachedApiKey: string | null = null;
let cachedClientInstance: GoogleGenAI | null = null;

function getGoogleGenAIClient(apiKey: string): GoogleGenAI {
  if (cachedClientInstance && cachedApiKey === apiKey) {
    return cachedClientInstance;
  }
  cachedApiKey = apiKey;
  cachedClientInstance = new GoogleGenAI({ apiKey });
  return cachedClientInstance;
}

export interface AIProviderAdapter {
  providerName: string;
  generateContent<T = any>(options: AIRequestOptions): Promise<AIResponse<T>>;
}

export class GeminiAdapter implements AIProviderAdapter {
  public providerName = "Google Gemini";

  public async generateContent<T = any>(options: AIRequestOptions): Promise<AIResponse<T>> {
    const startTime = Date.now();
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    const defaultModel = process.env.AI_MODEL || "gemini-2.5-flash";
    const model = options.model || defaultModel;

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      const durationMs = Date.now() - startTime;
      const normalizedError = normalizeAIError("GOOGLE_GEMINI_API_KEY is not configured.");
      return {
        success: false,
        rawContent: "",
        task: options.task,
        model,
        provider: this.providerName,
        durationMs,
        error: normalizedError,
      };
    }

    try {
      const ai = getGoogleGenAIClient(apiKey);

      // Construct system instruction with grounding rules
      const systemInstruction = buildGroundedSystemInstruction(options.systemInstruction);

      // Build user content payload (incorporating document context if present)
      let fullUserContent = "";
      if (options.documentContext) {
        const contextText = formatGroundedDocumentContext(options.documentContext);
        if (contextText) {
          fullUserContent += `DOCUMENT CONTEXT EVIDENCE:\n${contextText}\n\n`;
        }
      }

      if (options.userInput) {
        fullUserContent += `USER PROMPT / TASK:\n${options.userInput}`;
      }

      if (!fullUserContent.trim()) {
        fullUserContent = "Diagnose LegalPilot AI operational status.";
      }

      // Prepare request config
      const config: any = {
        systemInstruction,
        temperature: options.temperature ?? 0.2,
      };

      if (options.maxTokens) {
        config.maxOutputTokens = options.maxTokens;
      }

      if (options.responseSchema) {
        config.responseMimeType = "application/json";
        config.responseSchema = options.responseSchema;
      }

      // Execute with timeout
      const timeoutMs = options.timeoutMs || Number(process.env.AI_REQUEST_TIMEOUT_MS) || 30000;

      const apiPromise = ai.models.generateContent({
        model,
        contents: [fullUserContent],
        config,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`AI Request timed out after ${timeoutMs}ms`)), timeoutMs)
      );

      const result: any = await Promise.race([apiPromise, timeoutPromise]);
      const durationMs = Date.now() - startTime;

      const rawText = result.text || "";
      let parsedData: T | undefined = undefined;

      if (options.responseSchema || rawText.trim().startsWith("{")) {
        try {
          // Clean markdown json fences if present
          const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
          parsedData = JSON.parse(cleanedText);
        } catch (jsonErr: any) {
          if (options.responseSchema) {
            return {
              success: false,
              rawContent: rawText,
              task: options.task,
              model,
              provider: this.providerName,
              durationMs,
              error: normalizeAIError(`JSON Parse Failure: ${jsonErr.message}`),
            };
          }
        }
      }

      const usageStats = result.usageMetadata
        ? {
            promptTokens: result.usageMetadata.promptTokenCount,
            candidatesTokens: result.usageMetadata.candidatesTokenCount,
            totalTokens: result.usageMetadata.totalTokenCount,
          }
        : undefined;

      return {
        success: true,
        data: parsedData,
        rawContent: rawText,
        task: options.task,
        model,
        provider: this.providerName,
        usage: usageStats,
        durationMs,
      };
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      const normalizedError = normalizeAIError(err);
      return {
        success: false,
        rawContent: "",
        task: options.task,
        model,
        provider: this.providerName,
        durationMs,
        error: normalizedError,
      };
    }
  }
}

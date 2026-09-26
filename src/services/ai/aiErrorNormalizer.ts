import { AIError, AIErrorType } from "@/types/ai";

export function normalizeAIError(error: any): AIError {
  if (!error) {
    return {
      code: "UNKNOWN_ERROR",
      message: "An unspecified AI processing error occurred.",
      userMessage: "AI analysis is temporarily unavailable. Please try again.",
    };
  }

  const errMessage = typeof error === "string" ? error : error.message || String(error);
  const errCode = error.code || error.status || "";
  const lowerMsg = errMessage.toLowerCase();

  // 1. Missing API Key
  if (
    errMessage.includes("API key") ||
    errMessage.includes("GOOGLE_GEMINI_API_KEY") ||
    errMessage.includes("API_KEY_INVALID") ||
    errCode === "MISSING_API_KEY"
  ) {
    return {
      code: "MISSING_API_KEY",
      message: errMessage,
      userMessage: "AI service is not configured. Please set GOOGLE_GEMINI_API_KEY in your environment.",
    };
  }

  // 2. Rate Limit (429)
  if (
    errMessage.includes("429") ||
    lowerMsg.includes("rate limit") ||
    lowerMsg.includes("quota")
  ) {
    return {
      code: "RATE_LIMIT_EXCEEDED",
      message: errMessage,
      userMessage: "AI request rate limit reached. Please wait a moment and try again.",
    };
  }

  // 3. Timeout
  if (
    lowerMsg.includes("timeout") ||
    lowerMsg.includes("timed out") ||
    lowerMsg.includes("time out") ||
    lowerMsg.includes("aborted")
  ) {
    return {
      code: "TIMEOUT",
      message: errMessage,
      userMessage: "AI request timed out. Please try again with a shorter document segment.",
    };
  }

  // 4. Malformed Structured Output
  if (
    lowerMsg.includes("json") ||
    lowerMsg.includes("malformed") ||
    lowerMsg.includes("parse")
  ) {
    return {
      code: "MALFORMED_OUTPUT",
      message: errMessage,
      userMessage: "Failed to parse structured AI response. Please retry your request.",
    };
  }

  // 5. Provider Unavailable (500, 503)
  if (
    errMessage.includes("503") ||
    errMessage.includes("500") ||
    lowerMsg.includes("service unavailable") ||
    lowerMsg.includes("overloaded")
  ) {
    return {
      code: "PROVIDER_UNAVAILABLE",
      message: errMessage,
      userMessage: "AI service provider is temporarily unavailable. Please try again shortly.",
    };
  }

  // 6. Generic Fallback
  return {
    code: "UNKNOWN_ERROR",
    message: errMessage,
    userMessage: "AI processing encountered an unexpected issue. Please try again.",
  };
}

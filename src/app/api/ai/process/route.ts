import { NextRequest, NextResponse } from "next/server";
import { executeAIRequest, checkAIServiceHealth } from "@/services/ai/aiService";
import { AIRequestOptions } from "@/types/ai";

const ALLOWED_TASKS = [
  "health_check",
  "document_understanding",
  "analyze_clauses",
  "summarize",
  "detect_risks",
  "qa",
  "compare",
  "checklist",
  "consultation_brief",
];

export async function POST(req: NextRequest) {
  try {
    let body: AIRequestOptions;
    try {
      body = (await req.json()) as AIRequestOptions;
    } catch {
      return NextResponse.json(
        {
          success: false,
          rawContent: "",
          task: "unknown",
          model: process.env.AI_MODEL || "gemini-2.5-flash",
          provider: "Google Gemini",
          durationMs: 0,
          error: {
            code: "INVALID_REQUEST",
            message: "Malformed JSON payload.",
            userMessage: "Invalid JSON format in AI request.",
          },
        },
        { status: 400 }
      );
    }

    if (!body || !body.task || typeof body.task !== "string") {
      return NextResponse.json(
        {
          success: false,
          rawContent: "",
          task: "unknown",
          model: process.env.AI_MODEL || "gemini-2.5-flash",
          provider: "Google Gemini",
          durationMs: 0,
          error: {
            code: "INVALID_REQUEST",
            message: "Missing 'task' string in request payload.",
            userMessage: "Invalid AI request format.",
          },
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_TASKS.includes(body.task)) {
      return NextResponse.json(
        {
          success: false,
          rawContent: "",
          task: body.task,
          model: process.env.AI_MODEL || "gemini-2.5-flash",
          provider: "Google Gemini",
          durationMs: 0,
          error: {
            code: "INVALID_REQUEST",
            message: `Unsupported task '${body.task}'.`,
            userMessage: "Unsupported AI processing task requested.",
          },
        },
        { status: 400 }
      );
    }

    if (body.task === "health_check") {
      const healthResult = await checkAIServiceHealth();
      return NextResponse.json(healthResult, { status: healthResult.success ? 200 : 400 });
    }

    const aiResult = await executeAIRequest(body);
    const statusCode = aiResult.success ? 200 : 400;

    return NextResponse.json(aiResult, { status: statusCode });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        rawContent: "",
        task: "error",
        model: "gemini-2.5-flash",
        provider: "Google Gemini",
        durationMs: 0,
        error: {
          code: "UNKNOWN_ERROR",
          message: err.message || "Internal server error during AI processing.",
          userMessage: "AI service encountered an unexpected error. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}

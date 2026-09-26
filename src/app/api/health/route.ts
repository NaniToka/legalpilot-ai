import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/constants";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: APP_CONFIG.name,
    version: APP_CONFIG.version,
    timestamp: new Date().toISOString(),
    message: "LegalPilot AI API foundation is active.",
  });
}

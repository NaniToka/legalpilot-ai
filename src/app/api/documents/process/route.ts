import { NextRequest, NextResponse } from "next/server";
import { processLegalDocument } from "@/services/parser/documentProcessor";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid request payload. Expected multipart/form-data with document file." },
        { status: 400 }
      );
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json(
        { error: "Failed to parse document form data. Please check upload payload." },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No document file was uploaded in request." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await processLegalDocument(buffer, file.name, file.type);

    if (result.status === "failed") {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error during document processing. Please try again." },
      { status: 500 }
    );
  }
}

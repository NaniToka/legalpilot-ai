import { NextRequest, NextResponse } from "next/server";
import { processLegalDocument } from "@/services/parser/documentProcessor";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
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
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error during document processing." },
      { status: 500 }
    );
  }
}

import { DocumentFileType } from "@/types";

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
export const ALLOWED_EXTENSIONS = [".pdf", ".docx"];
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  fileType?: DocumentFileType;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function sanitizeFilename(filename: string): string {
  if (!filename) return "document.pdf";
  // Remove path traversal characters (/, \, ..), control chars, and trim whitespace
  const sanitized = filename
    .replace(/^.*[\\/]/, "")
    .replace(/\.\.+/g, ".")
    .replace(/[^\w\s\.\-\(\)]/g, "_")
    .trim();
  return sanitized || "legal_document.pdf";
}

export function verifyFileSignature(
  buffer: Uint8Array | Buffer
): { isValid: boolean; detectedType?: DocumentFileType; error?: string } {
  if (!buffer || buffer.length < 4) {
    return {
      isValid: false,
      error: "File buffer is too small or corrupted to verify content signature.",
    };
  }

  const b0 = buffer[0];
  const b1 = buffer[1];
  const b2 = buffer[2];
  const b3 = buffer[3];

  // PDF signature: %PDF (0x25, 0x50, 0x44, 0x46)
  if (b0 === 0x25 && b1 === 0x50 && b2 === 0x44 && b3 === 0x46) {
    return { isValid: true, detectedType: "pdf" };
  }

  // DOCX (ZIP archive signature): PK\x03\x04 (0x50, 0x4B, 0x03, 0x04)
  if (b0 === 0x50 && b1 === 0x4b && b2 === 0x03 && b3 === 0x04) {
    return { isValid: true, detectedType: "docx" };
  }

  return {
    isValid: false,
    error: "File content signature does not match supported PDF (%PDF) or DOCX (PK) document formats.",
  };
}

export function validateLegalDocument(
  file: File,
  buffer?: Buffer | Uint8Array
): ValidationResult {
  if (!file) {
    return { isValid: false, error: "No document was selected." };
  }

  // 1. Check empty file
  if (file.size === 0) {
    return {
      isValid: false,
      error: "The selected file is empty (0 bytes). Please upload a valid document.",
    };
  }

  // 2. Check size limit
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const formatted = formatFileSize(file.size);
    return {
      isValid: false,
      error: `File size exceeds the 15 MB limit (selected file is ${formatted}). Please choose a smaller document.`,
    };
  }

  // 3. Check extension & declared MIME type
  const safeName = sanitizeFilename(file.name);
  const extension = `.${safeName.split(".").pop()?.toLowerCase()}`;
  const mimeType = (file.type || "").toLowerCase();

  let detectedType: DocumentFileType | undefined;

  if (extension === ".pdf" || mimeType === "application/pdf") {
    detectedType = "pdf";
  } else if (
    extension === ".docx" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    detectedType = "docx";
  }

  if (!detectedType) {
    return {
      isValid: false,
      error: `Unsupported file type (${extension || "unknown"}). Please upload a PDF (.pdf) or Word (.docx) document.`,
    };
  }

  // 4. Content signature check if buffer is supplied
  if (buffer) {
    const sigResult = verifyFileSignature(buffer);
    if (!sigResult.isValid) {
      return {
        isValid: false,
        error: sigResult.error || "File content validation failed.",
      };
    }
    // Verify extension matches detected signature
    if (sigResult.detectedType && sigResult.detectedType !== detectedType) {
      return {
        isValid: false,
        error: `File extension (${extension}) does not match actual binary content format (${sigResult.detectedType.toUpperCase()}).`,
      };
    }
  }

  return {
    isValid: true,
    fileType: detectedType,
  };
}

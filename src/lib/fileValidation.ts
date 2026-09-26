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

export function validateLegalDocument(file: File): ValidationResult {
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

  // 3. Check extension
  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
  const mimeType = file.type.toLowerCase();

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

  return {
    isValid: true,
    fileType: detectedType,
  };
}

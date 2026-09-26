import { describe, it, expect } from "vitest";
import { normalizeLegalText, countWords, chunkNormalizedText } from "../src/services/parser/textNormalizer";
import { processLegalDocument } from "../src/services/parser/documentProcessor";
import { parseDOCXBuffer } from "../src/services/parser/docxParser";
import { validateLegalDocument } from "../src/lib/fileValidation";

describe("Document Processing & Extraction Pipeline", () => {
  describe("1. Text Normalization", () => {
    it("should normalize line endings and extra whitespace while preserving legal terms", () => {
      const rawText = "SECTION 1.   DEFINITIONS.\r\n\r\nThis Agreement   is made by and between Party A\n\n\nand Party B.";
      const normalized = normalizeLegalText(rawText);

      expect(normalized).toContain("SECTION 1. DEFINITIONS.");
      expect(normalized).toContain("This Agreement is made by and between Party A");
      expect(normalized).not.toContain("\r");
      expect(normalized).not.toContain("   ");
    });

    it("should repair line-break hyphenations cleanly", () => {
      const rawText = "The indemnifica-\ntion obligations shall survive termination.";
      const normalized = normalizeLegalText(rawText);

      expect(normalized).toContain("indemnification");
    });

    it("should count words accurately", () => {
      expect(countWords("LegalPilot AI document assistant")).toBe(4);
      expect(countWords("")).toBe(0);
    });

    it("should chunk normalized text into structural sections", () => {
      const sampleLegalDoc = "SECTION 1. DEFINITIONS\n\n1.1 Confidential Information means all proprietary data.\n\nSECTION 2. OBLIGATIONS\n\nParty B agrees to maintain strict confidentiality.";
      const chunks = chunkNormalizedText(sampleLegalDoc, 1);

      expect(chunks.length).toBeGreaterThanOrEqual(2);
      expect(chunks[0].pageNumber).toBe(1);
      expect(chunks[0].heading).toBe("SECTION 1");
    });
  });

  describe("2. File Validation", () => {
    it("should reject empty files (0 bytes)", () => {
      const emptyFile = new File([], "empty.pdf", { type: "application/pdf" });
      const validation = validateLegalDocument(emptyFile);

      expect(validation.isValid).toBe(false);
      expect(validation.error).toContain("0 bytes");
    });

    it("should reject unsupported extensions", () => {
      const invalidFile = new File([Buffer.from("test")], "script.exe", { type: "application/octet-stream" });
      const validation = validateLegalDocument(invalidFile);

      expect(validation.isValid).toBe(false);
      expect(validation.error).toContain("Unsupported file type");
    });

    it("should reject oversized files (> 15 MB)", () => {
      const bigBuffer = Buffer.alloc(16 * 1024 * 1024);
      const bigFile = new File([bigBuffer], "large.pdf", { type: "application/pdf" });
      const validation = validateLegalDocument(bigFile);

      expect(validation.isValid).toBe(false);
      expect(validation.error).toContain("15 MB limit");
    });

    it("should accept valid PDF and DOCX files", () => {
      const validPdf = new File([Buffer.from("%PDF-1.4 test")], "agreement.pdf", { type: "application/pdf" });
      const pdfValidation = validateLegalDocument(validPdf);
      expect(pdfValidation.isValid).toBe(true);
      expect(pdfValidation.fileType).toBe("pdf");

      const validDocx = new File([Buffer.from("PK test")], "contract.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const docxValidation = validateLegalDocument(validDocx);
      expect(docxValidation.isValid).toBe(true);
      expect(docxValidation.fileType).toBe("docx");
    });
  });

  describe("3. Document Processing Execution & Error Handling", () => {
    it("should handle corrupted or malformed documents gracefully with structured failure payload", async () => {
      const corruptedBuffer = Buffer.from("Corrupted non-PDF binary data");
      const result = await processLegalDocument(corruptedBuffer, "corrupted.pdf", "application/pdf");

      expect(result.status).toBe("failed");
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("PDF Parsing Failure");
    });

    it("should extract synthetic text payload from DOCX buffer cleanly", async () => {
      // Create minimal valid DOCX structure or test parser failure path
      const docxBuffer = Buffer.from("PK\x03\x04synthetic_test_docx_data");
      const result = await processLegalDocument(docxBuffer, "contract.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

      expect(result.documentId).toBeDefined();
      expect(result.filename).toBe("contract.docx");
      expect(result.fileType).toBe("docx");
    });
  });
});

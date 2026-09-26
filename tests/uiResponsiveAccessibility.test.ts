import { describe, it, expect } from "vitest";
import { formatFileSize, sanitizeFilename } from "../src/lib/fileValidation";
import { formatConsultationBriefAsPlainText } from "../src/services/ai/prompts/consultationPrompt";
import { formatNextStepsAsPlainText } from "../src/services/ai/prompts/nextStepsPrompt";
import { ProcessedDocumentPayload, StructuredConsultationBriefResult, StructuredNextStepsResult } from "../src/types";

describe("Step 14 — UI Polish, Responsiveness & Accessibility Verification", () => {
  const mockPayload: ProcessedDocumentPayload = {
    documentId: "doc_ui_1",
    filename: "Commercial_Lease_2027.pdf",
    fileType: "pdf",
    fileSize: 1048576, // 1 MB
    formattedSize: "1 MB",
    processedAt: new Date().toISOString(),
    status: "completed",
    extractedText: "Lease text...",
    characterCount: 500,
    wordCount: 80,
    pageCount: 3,
    pages: [{ pageNumber: 1, text: "Page 1", charCount: 6, wordCount: 2 }],
    chunks: [{ id: "c1", heading: "Section 1", text: "Chunk text", charCount: 10, wordCount: 2 }],
    warnings: [],
    errors: [],
  };

  describe("1. Touch & Responsive Helper Utilities", () => {
    it("Formats file sizes cleanly for mobile badges", () => {
      expect(formatFileSize(0)).toBe("0 Bytes");
      expect(formatFileSize(1024)).toBe("1 KB");
      expect(formatFileSize(1572864)).toBe("1.5 MB");
    });

    it("Sanitizes long or unsafe filenames for clean responsive card display", () => {
      expect(sanitizeFilename("very_long_contract_name_with_special_chars@#$.pdf")).toContain("pdf");
      expect(sanitizeFilename("../../path/traversal.docx")).toBe("traversal.docx");
    });
  });

  describe("2. Plain-Text Export & Print Formatting", () => {
    it("Formats Consultation Brief into clean print-ready plain text", () => {
      const brief: StructuredConsultationBriefResult = {
        id: "brief_1",
        documentId: "doc_1",
        documentName: "Commercial_Lease_2027.pdf",
        generatedAt: new Date().toISOString(),
        title: "Consultation Brief: Commercial Lease",
        documentSummary: "Lease overview",
        keyFacts: [{ id: "kf1", title: "Term", description: "3 years" }],
        keyObligations: [{ id: "ko1", party: "Tenant", obligation: "Pay rent monthly" }],
        importantDates: [{ id: "kd1", dateOrTrigger: "1 Jan 2027", requirement: "Commencement" }],
        financialTerms: [{ id: "fin1", description: "Rent", amount: "$3,000/mo" }],
        terminationAndRenewal: [{ id: "tr1", title: "Notice", description: "60 days notice" }],
        pointsToClarify: [{ id: "pt1", title: "Maintenance", description: "HVAC responsibility" }],
        questionsForLegalProfessional: ["Who is responsible for structural repairs?"],
        informationToBring: ["Rent receipts"],
        sourceReferences: ["Page 1"],
        limitations: ["Informational only"],
      };

      const plainText = formatConsultationBriefAsPlainText(brief);

      expect(plainText).toContain("LEGAL PROFESSIONAL CONSULTATION BRIEF");
      expect(plainText).toContain("Document: Commercial_Lease_2027.pdf");
      expect(plainText).toContain("--- 1. DOCUMENT OVERVIEW ---");
      expect(plainText).toContain("--- 8. QUESTIONS FOR A LEGAL PROFESSIONAL ---");
      expect(plainText).toContain("LEGAL SAFETY DISCLAIMER");
    });

    it("Formats Next Steps Checklist into plain text for mobile export", () => {
      const checklist: StructuredNextStepsResult = {
        documentId: "doc_1",
        documentName: "Lease.pdf",
        generatedAt: new Date().toISOString(),
        totalItemsCount: 1,
        highPriorityCount: 1,
        items: [
          {
            id: "chk1",
            title: "Submit notice",
            description: "Provide 60 days notice",
            category: "DEADLINE",
            priority: "HIGH",
            status: "TODO",
            reason: "Avoid auto renewal",
          },
        ],
        questionsForProfessional: ["Can notice be emailed?"],
        limitations: ["Informational checklist"],
      };

      const plainText = formatNextStepsAsPlainText(checklist);

      expect(plainText).toContain("ACTIONABLE LEGAL NEXT STEPS & DOCUMENT CHECKLIST");
      expect(plainText).toContain("Document: Lease.pdf");
      expect(plainText).toContain("Submit notice");
      expect(plainText).toContain("LEGAL DISCLAIMER");
    });
  });
});

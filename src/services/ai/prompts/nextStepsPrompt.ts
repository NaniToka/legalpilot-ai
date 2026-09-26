import {
  StructuredNextStepsResult,
  ChecklistItem,
  ChecklistCategory,
  ChecklistPriority,
  ProcessedDocumentPayload,
} from "@/types";
import { buildGroundedSystemInstruction } from "./legalSystemPrompts";

export function buildNextStepsTaskInstruction(): string {
  return buildGroundedSystemInstruction(`
ACTIONABLE NEXT STEPS & DOCUMENT CHECKLIST INSTRUCTIONS:
Analyze the supplied legal document context and generate a practical, actionable checklist of next steps, obligations, deadlines, and questions for legal consultation.

CRITICAL OPERATIONAL RULES:
1. STRICT DOCUMENT EVIDENCE: Generate items based ONLY on explicit statements and context present in the supplied document text.
2. DISTINGUISH FACTS FROM SUGGESTIONS: Clearly separate explicit document facts (e.g. "Rent is due on the 1st of each month") from practical user suggestions (e.g. "Consider setting a recurring monthly calendar reminder").
3. RELATIVE DEADLINES & DATES: Preserve relative deadlines verbatim (e.g. "at least 60 days before termination"). Do NOT fabricate calendar dates unless explicitly stated in the text.
4. MISSING INFORMATION ITEMS: Create "INFORMATION_NEEDED" items for critical terms that are missing or unclear in the document (e.g. "Confirm effective date of agreement").
5. PRACTICAL PRIORITY (NOT LEGAL RISK): Classify item priority as HIGH, MEDIUM, or LOW based on practical user attention priority (e.g., upcoming notice deadlines), NOT legal enforceability or risk scores.
6. VALID CATEGORIES: Every item must use one of:
   - "DEADLINE"
   - "OBLIGATION"
   - "PAYMENT"
   - "DOCUMENT"
   - "TERMINATION"
   - "RENEWAL"
   - "INFORMATION_NEEDED"
   - "REVIEW"
   - "PROFESSIONAL_CONSULTATION"
7. SOURCE REFERENCES: Include short page numbers or section header references whenever available. Do NOT fabricate page numbers.
8. QUESTIONS FOR PROFESSIONAL: Provide neutral, practical questions to discuss with a licensed legal professional.
`.trim());
}

export const NEXT_STEPS_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    items: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          description: { type: "STRING" },
          category: { type: "STRING" },
          priority: { type: "STRING" },
          dueDate: { type: "STRING" },
          dueDateText: { type: "STRING" },
          relatedClause: { type: "STRING" },
          reason: { type: "STRING" },
          sourceReferences: {
            type: "ARRAY",
            items: { type: "STRING" },
          },
          questions: {
            type: "ARRAY",
            items: { type: "STRING" },
          },
        },
        required: ["title", "description", "category", "priority", "reason"],
      },
    },
    questionsForProfessional: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    limitations: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
  },
  required: ["items", "questionsForProfessional", "limitations"],
};

export function validateNextStepsResult(
  raw: any,
  payload: ProcessedDocumentPayload
): StructuredNextStepsResult {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid next steps output: Expected structured object payload.");
  }

  const validCategories: ChecklistCategory[] = [
    "DEADLINE",
    "OBLIGATION",
    "PAYMENT",
    "DOCUMENT",
    "TERMINATION",
    "RENEWAL",
    "INFORMATION_NEEDED",
    "REVIEW",
    "PROFESSIONAL_CONSULTATION",
  ];

  const validPriorities: ChecklistPriority[] = ["HIGH", "MEDIUM", "LOW"];

  const sanitizeCategory = (cat: any): ChecklistCategory => {
    if (typeof cat === "string") {
      const match = validCategories.find((c) => c.toLowerCase() === cat.toLowerCase());
      if (match) return match;
    }
    return "REVIEW";
  };

  const sanitizePriority = (prio: any): ChecklistPriority => {
    if (typeof prio === "string") {
      const match = validPriorities.find((p) => p.toLowerCase() === prio.toLowerCase());
      if (match) return match;
    }
    return "MEDIUM";
  };

  const rawItems = Array.isArray(raw.items) ? raw.items : [];

  const items: ChecklistItem[] = rawItems.map((item: any, index: number) => ({
    id: `chk_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`,
    title: typeof item.title === "string" && item.title.trim() ? item.title : "Action Item",
    description: typeof item.description === "string" ? item.description : "Review document provision.",
    category: sanitizeCategory(item.category),
    priority: sanitizePriority(item.priority),
    status: "TODO",
    dueDate: typeof item.dueDate === "string" && item.dueDate.trim() ? item.dueDate : undefined,
    dueDateText: typeof item.dueDateText === "string" && item.dueDateText.trim() ? item.dueDateText : undefined,
    relatedClause: typeof item.relatedClause === "string" ? item.relatedClause : undefined,
    reason: typeof item.reason === "string" ? item.reason : "Identified from document text.",
    sourceReferences: Array.isArray(item.sourceReferences)
      ? item.sourceReferences.filter((s: any) => typeof s === "string" && s.trim())
      : [],
    questions: Array.isArray(item.questions)
      ? item.questions.filter((q: any) => typeof q === "string" && q.trim())
      : [],
    limitations: [],
  }));

  const highPriorityCount = items.filter((i) => i.priority === "HIGH").length;

  const questionsForProfessional = Array.isArray(raw.questionsForProfessional)
    ? raw.questionsForProfessional.filter((q: any) => typeof q === "string" && q.trim())
    : [];

  const limitations = Array.isArray(raw.limitations)
    ? raw.limitations.filter((l: any) => typeof l === "string" && l.trim())
    : [];

  return {
    documentId: payload.documentId,
    documentName: payload.filename,
    generatedAt: new Date().toISOString(),
    totalItemsCount: items.length,
    highPriorityCount,
    items,
    questionsForProfessional,
    limitations,
  };
}

export function formatNextStepsAsPlainText(
  checklist: StructuredNextStepsResult
): string {
  let text = `==================================================\n`;
  text += `ACTIONABLE LEGAL NEXT STEPS & DOCUMENT CHECKLIST\n`;
  text += `==================================================\n`;
  text += `Document: ${checklist.documentName}\n`;
  text += `Generated: ${new Date(checklist.generatedAt).toLocaleString()}\n`;
  text += `Total Tasks: ${checklist.totalItemsCount} (${checklist.highPriorityCount} High Priority)\n\n`;

  text += `--- CHECKLIST ITEMS ---\n`;
  checklist.items.forEach((item, idx) => {
    text += `${idx + 1}. [${item.priority}] ${item.title}\n`;
    text += `   Category: ${item.category}\n`;
    text += `   Details: ${item.description}\n`;
    if (item.dueDateText) text += `   Deadline: ${item.dueDateText}\n`;
    text += `   Reason: ${item.reason}\n`;
    if (item.sourceReferences && item.sourceReferences.length > 0) {
      text += `   Sources: ${item.sourceReferences.join(", ")}\n`;
    }
    text += `\n`;
  });

  if (checklist.questionsForProfessional.length > 0) {
    text += `--- QUESTIONS FOR A LEGAL PROFESSIONAL ---\n`;
    checklist.questionsForProfessional.forEach((q, idx) => {
      text += `${idx + 1}. ${q}\n`;
    });
    text += `\n`;
  }

  text += `==================================================\n`;
  text += `LEGAL DISCLAIMER\n`;
  text += `LegalPilot AI provides informational assistance based on the documents you provide. It is not a substitute for advice from a qualified legal professional.\n`;
  text += `==================================================\n`;

  return text;
}

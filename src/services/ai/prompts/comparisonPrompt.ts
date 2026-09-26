import {
  StructuredDocumentComparisonResult,
  ComparisonChangeType,
  ProcessedDocumentPayload,
} from "@/types";
import { buildGroundedSystemInstruction } from "./legalSystemPrompts";

export function buildComparisonTaskInstruction(): string {
  return buildGroundedSystemInstruction(`
LEGAL DOCUMENT COMPARISON INSTRUCTIONS:
You are provided with text context from Document A (Original) and Document B (New Version), along with a deterministic textual diff.
Analyze the differences and produce a comprehensive, structured comparison highlighting meaningful legal changes.

CRITICAL OPERATIONAL RULES:
1. STRICT DOCUMENT EVIDENCE: Report ONLY changes that are explicitly supported by the supplied Document A and Document B texts and diff.
2. NO FABRICATION: Do NOT invent changes, penalties, dates, monetary amounts, or party obligations that do not exist in the documents.
3. CHANGE CLASSIFICATION: Every change MUST be classified as one of:
   - "added" (new clause/term in Document B absent from Document A)
   - "removed" (clause/term in Document A absent from Document B)
   - "modified" (clause/term modified between Document A and Document B)
4. NO FAKE RISK SCORES: Do NOT output numerical "risk scores" or claim one contract is "X% riskier". Use factual, neutral explanations of what changed and why it may warrant review.
5. GROUNDED CHANGE BREAKDOWNS:
   - Changed Obligations (duty, old vs new, party, source)
   - Changed Financial Terms (amounts, deposits, fees, currencies)
   - Changed Dates & Deadlines (effective, termination, notice periods)
   - Changed Termination & Renewal Terms (notice windows, automatic renewal)
6. SOURCE REFERENCES: Include exact page numbers, section headers, or chunk references for both Document A and Document B whenever available.
7. QUESTIONS FOR REVIEW: Provide practical questions to raise with a legal professional regarding key changes.
`.trim());
}

export const COMPARISON_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    summary: { type: "STRING" },
    affectedCategories: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    changes: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          category: { type: "STRING" },
          title: { type: "STRING" },
          changeType: { type: "STRING" },
          originalText: { type: "STRING" },
          newText: { type: "STRING" },
          explanation: { type: "STRING" },
          whyItMayMatter: { type: "STRING" },
          originalSource: { type: "STRING" },
          newSource: { type: "STRING" },
        },
        required: ["category", "title", "changeType", "explanation", "whyItMayMatter"],
      },
    },
    changedObligations: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          party: { type: "STRING" },
          originalObligation: { type: "STRING" },
          newObligation: { type: "STRING" },
          explanation: { type: "STRING" },
          sourceRef: { type: "STRING" },
        },
        required: ["party", "explanation"],
      },
    },
    changedFinancialTerms: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          description: { type: "STRING" },
          originalAmount: { type: "STRING" },
          newAmount: { type: "STRING" },
          explanation: { type: "STRING" },
          sourceRef: { type: "STRING" },
        },
        required: ["description", "explanation"],
      },
    },
    changedDates: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          dateOrTrigger: { type: "STRING" },
          originalRequirement: { type: "STRING" },
          newRequirement: { type: "STRING" },
          explanation: { type: "STRING" },
          sourceRef: { type: "STRING" },
        },
        required: ["dateOrTrigger", "explanation"],
      },
    },
    changedTerminationTerms: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          category: { type: "STRING" },
          title: { type: "STRING" },
          changeType: { type: "STRING" },
          originalText: { type: "STRING" },
          newText: { type: "STRING" },
          explanation: { type: "STRING" },
          whyItMayMatter: { type: "STRING" },
          originalSource: { type: "STRING" },
          newSource: { type: "STRING" },
        },
        required: ["category", "title", "changeType", "explanation", "whyItMayMatter"],
      },
    },
    questionsForReview: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    limitations: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
  },
  required: [
    "summary",
    "affectedCategories",
    "changes",
    "changedObligations",
    "changedFinancialTerms",
    "changedDates",
    "changedTerminationTerms",
    "questionsForReview",
    "limitations",
  ],
};

export function validateDocumentComparisonResult(
  raw: any,
  payloadA: ProcessedDocumentPayload,
  payloadB: ProcessedDocumentPayload
): StructuredDocumentComparisonResult {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid document comparison output: Expected structured object payload.");
  }

  const validChangeTypes: ComparisonChangeType[] = ["added", "removed", "modified"];

  const sanitizeChangeType = (val: any): ComparisonChangeType => {
    if (typeof val === "string") {
      const match = validChangeTypes.find((t) => t === val.toLowerCase());
      if (match) return match;
    }
    return "modified";
  };

  const changes = Array.isArray(raw.changes)
    ? raw.changes.map((c: any) => ({
        category: typeof c.category === "string" ? c.category : "General Provision",
        title: typeof c.title === "string" ? c.title : "Clause Change",
        changeType: sanitizeChangeType(c.changeType),
        originalText: typeof c.originalText === "string" ? c.originalText : undefined,
        newText: typeof c.newText === "string" ? c.newText : undefined,
        explanation: typeof c.explanation === "string" ? c.explanation : "Provisions differ between document versions.",
        whyItMayMatter: typeof c.whyItMayMatter === "string" ? c.whyItMayMatter : "Review specific phrasing with a legal professional.",
        originalSource: typeof c.originalSource === "string" ? c.originalSource : undefined,
        newSource: typeof c.newSource === "string" ? c.newSource : undefined,
      }))
    : [];

  const changedObligations = Array.isArray(raw.changedObligations)
    ? raw.changedObligations.map((o: any) => ({
        party: typeof o.party === "string" ? o.party : "All Parties",
        originalObligation: typeof o.originalObligation === "string" ? o.originalObligation : undefined,
        newObligation: typeof o.newObligation === "string" ? o.newObligation : undefined,
        explanation: typeof o.explanation === "string" ? o.explanation : "Party obligation modified.",
        sourceRef: typeof o.sourceRef === "string" ? o.sourceRef : undefined,
      }))
    : [];

  const changedFinancialTerms = Array.isArray(raw.changedFinancialTerms)
    ? raw.changedFinancialTerms.map((f: any) => ({
        description: typeof f.description === "string" ? f.description : "Financial term",
        originalAmount: typeof f.originalAmount === "string" ? f.originalAmount : undefined,
        newAmount: typeof f.newAmount === "string" ? f.newAmount : undefined,
        explanation: typeof f.explanation === "string" ? f.explanation : "Financial term modified.",
        sourceRef: typeof f.sourceRef === "string" ? f.sourceRef : undefined,
      }))
    : [];

  const changedDates = Array.isArray(raw.changedDates)
    ? raw.changedDates.map((d: any) => ({
        dateOrTrigger: typeof d.dateOrTrigger === "string" ? d.dateOrTrigger : "Stated Trigger",
        originalRequirement: typeof d.originalRequirement === "string" ? d.originalRequirement : undefined,
        newRequirement: typeof d.newRequirement === "string" ? d.newRequirement : undefined,
        explanation: typeof d.explanation === "string" ? d.explanation : "Date or deadline requirement modified.",
        sourceRef: typeof d.sourceRef === "string" ? d.sourceRef : undefined,
      }))
    : [];

  const changedTerminationTerms = Array.isArray(raw.changedTerminationTerms)
    ? raw.changedTerminationTerms.map((t: any) => ({
        category: "Termination / Renewal",
        title: typeof t.title === "string" ? t.title : "Termination Provision Change",
        changeType: sanitizeChangeType(t.changeType),
        originalText: typeof t.originalText === "string" ? t.originalText : undefined,
        newText: typeof t.newText === "string" ? t.newText : undefined,
        explanation: typeof t.explanation === "string" ? t.explanation : "Termination or renewal term modified.",
        whyItMayMatter: typeof t.whyItMayMatter === "string" ? t.whyItMayMatter : "Termination windows affect notice requirements.",
        originalSource: typeof t.originalSource === "string" ? t.originalSource : undefined,
        newSource: typeof t.newSource === "string" ? t.newSource : undefined,
      }))
    : [];

  const questionsForReview = Array.isArray(raw.questionsForReview)
    ? raw.questionsForReview.filter((q: any) => typeof q === "string" && q.trim())
    : [];

  const limitations = Array.isArray(raw.limitations)
    ? raw.limitations.filter((l: any) => typeof l === "string" && l.trim())
    : [];

  const summaryText = typeof raw.summary === "string" && raw.summary.trim()
    ? raw.summary
    : `Comparison between ${payloadA.filename} and ${payloadB.filename} identified ${changes.length} key structural differences.`;

  return {
    documentAId: payloadA.documentId,
    documentAName: payloadA.filename,
    documentBId: payloadB.documentId,
    documentBName: payloadB.filename,
    comparedAt: new Date().toISOString(),
    totalChangesCount: changes.length + changedObligations.length + changedFinancialTerms.length + changedDates.length,
    summary: summaryText,
    affectedCategories: Array.isArray(raw.affectedCategories) ? raw.affectedCategories.filter((c: any) => typeof c === "string") : [],
    changes,
    changedObligations,
    changedFinancialTerms,
    changedDates,
    changedTerminationTerms,
    questionsForReview,
    limitations,
  };
}

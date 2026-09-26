import { StructuredClauseAnalysisResult, ReviewSeverity } from "@/types/ai";
import { buildGroundedSystemInstruction } from "./legalSystemPrompts";

export function buildClauseAnalysisTaskInstruction(): string {
  return buildGroundedSystemInstruction(`
CLAUSE, OBLIGATION & ATTENTION-POINT ANALYSIS INSTRUCTIONS:
Analyze the supplied legal document context and perform an in-depth extraction of key clauses, party obligations, rights, attention points, deadlines, financial commitments, and questions for legal professionals.

CRITICAL OPERATIONAL RULES:
1. STRICT DOCUMENT EVIDENCE: Extract findings based ONLY on the explicit text contained in the supplied document context.
2. NO FABRICATION / NO INVENTED CLAUSES: Do NOT invent missing clauses, penalties, dates, monetary amounts, or party obligations.
3. NEUTRAL ATTENTION POINTS: Use neutral terminology ("Attention Points" / "Points to Review"). Do NOT declare that a clause is "illegal", "unfair", "unenforceable", or that a user "will lose a case".
4. SEVERITY PRIORITIZATION: Classify Attention Points into one of three review-priority tiers: "Review", "Important", or "High Attention". Explain why the clause deserves review without issuing legal judgments.
5. EXPLICIT OBLIGATIONS & CONSEQUENCES: For obligations, state what a party must do and when. Only include consequences if explicitly stated by the text (e.g. "Failure to provide notice results in automatic 12-month renewal"). Do NOT invent unstated legal fallout.
6. SOURCE REFERENCES: Whenever page or section information is available in the context, attach short source references (e.g., "Page 1, Section 2"). Keep excerpts short.
7. QUESTIONS FOR A LAWYER: Provide tailored questions that directly address complex or ambiguous provisions found in the document.
8. LIMITATIONS: Note any standard clauses or expected protections that are absent or unclear.
`.trim());
}

export const CLAUSE_ANALYSIS_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    documentType: { type: "STRING" },
    importantClauses: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          category: { type: "STRING" },
          title: { type: "STRING" },
          clauseSummary: { type: "STRING" },
          plainLanguageExplanation: { type: "STRING" },
          whyItMatters: { type: "STRING" },
          sourceReference: { type: "STRING" },
        },
        required: ["category", "title", "clauseSummary", "plainLanguageExplanation", "whyItMatters"],
      },
    },
    obligations: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          party: { type: "STRING" },
          obligation: { type: "STRING" },
          deadline: { type: "STRING" },
          consequenceIfStated: { type: "STRING" },
          sourceReference: { type: "STRING" },
        },
        required: ["party", "obligation"],
      },
    },
    rights: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          party: { type: "STRING" },
          right: { type: "STRING" },
          conditions: { type: "STRING" },
          sourceReference: { type: "STRING" },
        },
        required: ["party", "right"],
      },
    },
    attentionPoints: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          explanation: { type: "STRING" },
          reasonForReview: { type: "STRING" },
          severity: { type: "STRING" },
          sourceReference: { type: "STRING" },
        },
        required: ["title", "explanation", "reasonForReview", "severity"],
      },
    },
    deadlines: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          dateOrTrigger: { type: "STRING" },
          requirement: { type: "STRING" },
          sourceReference: { type: "STRING" },
        },
        required: ["dateOrTrigger", "requirement"],
      },
    },
    financialCommitments: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          description: { type: "STRING" },
          amount: { type: "STRING" },
          currency: { type: "STRING" },
          conditions: { type: "STRING" },
          sourceReference: { type: "STRING" },
        },
        required: ["description"],
      },
    },
    questionsForProfessional: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          question: { type: "STRING" },
          reason: { type: "STRING" },
        },
        required: ["question", "reason"],
      },
    },
    limitations: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
  },
  required: [
    "documentType",
    "importantClauses",
    "obligations",
    "rights",
    "attentionPoints",
    "deadlines",
    "financialCommitments",
    "questionsForProfessional",
    "limitations",
  ],
};

export function validateClauseAnalysisResult(
  raw: any,
  documentId: string
): StructuredClauseAnalysisResult {
  const fallbackUnspecified = "Not specified in the document.";

  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid clause analysis output: Expected structured object payload.");
  }

  const validSeverities: ReviewSeverity[] = ["Review", "Important", "High Attention"];

  return {
    documentId: documentId || `doc_${Date.now()}`,
    documentType: typeof raw.documentType === "string" && raw.documentType.trim() ? raw.documentType : "Legal Agreement",
    analyzedAt: new Date().toISOString(),
    importantClauses: Array.isArray(raw.importantClauses)
      ? raw.importantClauses.map((c: any) => ({
          category: typeof c.category === "string" ? c.category : "General Provision",
          title: typeof c.title === "string" ? c.title : "Important Provision",
          clauseSummary: typeof c.clauseSummary === "string" ? c.clauseSummary : fallbackUnspecified,
          plainLanguageExplanation: typeof c.plainLanguageExplanation === "string" ? c.plainLanguageExplanation : fallbackUnspecified,
          whyItMatters: typeof c.whyItMatters === "string" ? c.whyItMatters : fallbackUnspecified,
          sourceReference: typeof c.sourceReference === "string" ? c.sourceReference : undefined,
        }))
      : [],
    obligations: Array.isArray(raw.obligations)
      ? raw.obligations.map((o: any) => ({
          party: typeof o.party === "string" ? o.party : "All Parties",
          obligation: typeof o.obligation === "string" ? o.obligation : fallbackUnspecified,
          deadline: typeof o.deadline === "string" ? o.deadline : undefined,
          consequenceIfStated: typeof o.consequenceIfStated === "string" ? o.consequenceIfStated : undefined,
          sourceReference: typeof o.sourceReference === "string" ? o.sourceReference : undefined,
        }))
      : [],
    rights: Array.isArray(raw.rights)
      ? raw.rights.map((r: any) => ({
          party: typeof r.party === "string" ? r.party : "Party",
          right: typeof r.right === "string" ? r.right : fallbackUnspecified,
          conditions: typeof r.conditions === "string" ? r.conditions : undefined,
          sourceReference: typeof r.sourceReference === "string" ? r.sourceReference : undefined,
        }))
      : [],
    attentionPoints: Array.isArray(raw.attentionPoints)
      ? raw.attentionPoints.map((a: any) => {
          let sev: ReviewSeverity = "Review";
          if (typeof a.severity === "string") {
            const match = validSeverities.find((s) => s.toLowerCase() === a.severity.toLowerCase());
            if (match) sev = match;
          }
          return {
            title: typeof a.title === "string" ? a.title : "Attention Point",
            explanation: typeof a.explanation === "string" ? a.explanation : fallbackUnspecified,
            reasonForReview: typeof a.reasonForReview === "string" ? a.reasonForReview : fallbackUnspecified,
            severity: sev,
            sourceReference: typeof a.sourceReference === "string" ? a.sourceReference : undefined,
          };
        })
      : [],
    deadlines: Array.isArray(raw.deadlines)
      ? raw.deadlines.map((d: any) => ({
          dateOrTrigger: typeof d.dateOrTrigger === "string" ? d.dateOrTrigger : "Stated Trigger",
          requirement: typeof d.requirement === "string" ? d.requirement : fallbackUnspecified,
          sourceReference: typeof d.sourceReference === "string" ? d.sourceReference : undefined,
        }))
      : [],
    financialCommitments: Array.isArray(raw.financialCommitments)
      ? raw.financialCommitments.map((f: any) => ({
          description: typeof f.description === "string" ? f.description : fallbackUnspecified,
          amount: typeof f.amount === "string" ? f.amount : undefined,
          currency: typeof f.currency === "string" ? f.currency : undefined,
          conditions: typeof f.conditions === "string" ? f.conditions : undefined,
          sourceReference: typeof f.sourceReference === "string" ? f.sourceReference : undefined,
        }))
      : [],
    questionsForProfessional: Array.isArray(raw.questionsForProfessional)
      ? raw.questionsForProfessional.map((q: any) => ({
          question: typeof q === "string" ? q : typeof q?.question === "string" ? q.question : "Question regarding provision",
          reason: typeof q?.reason === "string" ? q.reason : "To clarify scope and obligations.",
        }))
      : [],
    limitations: Array.isArray(raw.limitations)
      ? raw.limitations.filter((l: any) => typeof l === "string" && l.trim())
      : [],
  };
}

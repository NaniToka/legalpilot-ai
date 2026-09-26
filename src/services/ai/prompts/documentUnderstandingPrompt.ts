import { StructuredLegalDocumentAnalysis } from "@/types/ai";
import { buildGroundedSystemInstruction } from "./legalSystemPrompts";

export function buildDocumentUnderstandingTaskInstruction(): string {
  return buildGroundedSystemInstruction(`
DOCUMENT UNDERSTANDING TASK INSTRUCTIONS:
Analyze the supplied legal document context and generate a clear, accessible, plain-language document breakdown for a non-lawyer.

REQUIREMENTS:
1. DOCUMENT TYPE: Identify the specific type of document (e.g., Residential Lease Agreement, Independent Contractor Agreement, Non-Disclosure Agreement, Employment Contract, Service Notice).
2. OVERVIEW: Write a concise, plain-language summary suitable for a non-lawyer. Retain original legal terms when important (e.g. "Indemnification", "Arbitration"), but explain them in simple terms immediately following.
3. PURPOSE: Explain the core objective of the agreement.
4. PARTIES: List all explicit parties/entities mentioned, their role, and source reference (e.g. Page 1 or Section 1).
5. DATES: Extract all explicit dates mentioned (effective date, expiration, notice period, deadlines) with source references.
6. OBLIGATIONS & RIGHTS: List key duties and key rights for each party.
7. FINANCIAL TERMS: Extract all monetary amounts, fees, deposits, currencies, and payment terms when present.
8. DURATION & TERMINATION: Extract term length and cancellation/termination procedures.
9. IMPORTANT CLAUSES: Identify notable attention points (e.g. automatic renewal, liability caps, dispute resolution, governing law). Provide a plain-language explanation and explain why it matters. Use neutral terminology ("Attention point").
10. QUESTIONS FOR LAWYER: List 3 to 5 practical, informed questions the user should consider asking a qualified legal professional.
11. LIMITATIONS & UNSPECIFIED ITEMS: List any important legal terms or standard provisions that are missing or explicitly NOT specified in the document.

STRICT GROUNDING:
- Rely ONLY on the supplied document text.
- Do NOT invent party names, dates, amounts, penalties, or obligations.
- If a field is not present or cannot be reliably determined, state: "Not specified in the document."
`.trim());
}

export const DOCUMENT_UNDERSTANDING_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    documentType: { type: "STRING" },
    overview: { type: "STRING" },
    purpose: { type: "STRING" },
    parties: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          role: { type: "STRING" },
          sourceRef: { type: "STRING" },
        },
        required: ["name", "role"],
      },
    },
    importantDates: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          date: { type: "STRING" },
          description: { type: "STRING" },
          sourceRef: { type: "STRING" },
        },
        required: ["date", "description"],
      },
    },
    keyObligations: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          obligation: { type: "STRING" },
          party: { type: "STRING" },
          sourceRef: { type: "STRING" },
        },
        required: ["obligation", "party"],
      },
    },
    keyRights: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          right: { type: "STRING" },
          party: { type: "STRING" },
          sourceRef: { type: "STRING" },
        },
        required: ["right", "party"],
      },
    },
    financialTerms: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          term: { type: "STRING" },
          amount: { type: "STRING" },
          description: { type: "STRING" },
          sourceRef: { type: "STRING" },
        },
        required: ["term", "description"],
      },
    },
    duration: { type: "STRING" },
    termination: { type: "STRING" },
    importantClauses: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          explanation: { type: "STRING" },
          whyItMatters: { type: "STRING" },
          sourceRef: { type: "STRING" },
        },
        required: ["title", "explanation", "whyItMatters"],
      },
    },
    questionsForLawyer: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    limitations: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
  },
  required: [
    "documentType",
    "overview",
    "purpose",
    "parties",
    "importantDates",
    "keyObligations",
    "keyRights",
    "financialTerms",
    "duration",
    "termination",
    "importantClauses",
    "questionsForLawyer",
    "limitations",
  ],
};

/**
 * Validates and sanitizes raw AI response payload into a guaranteed StructuredLegalDocumentAnalysis
 */
export function validateDocumentUnderstandingAnalysis(
  raw: any,
  documentId: string
): StructuredLegalDocumentAnalysis {
  const fallbackUnspecified = "Not specified in the document.";

  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid AI analysis output: Expected structured object payload.");
  }

  return {
    documentId: documentId || `doc_${Date.now()}`,
    documentType: typeof raw.documentType === "string" && raw.documentType.trim() ? raw.documentType : "Legal Document",
    overview: typeof raw.overview === "string" && raw.overview.trim() ? raw.overview : fallbackUnspecified,
    purpose: typeof raw.purpose === "string" && raw.purpose.trim() ? raw.purpose : fallbackUnspecified,
    parties: Array.isArray(raw.parties)
      ? raw.parties.map((p: any) => ({
          name: typeof p.name === "string" ? p.name : "Unspecified Party",
          role: typeof p.role === "string" ? p.role : "Mentioned Entity",
          sourceRef: typeof p.sourceRef === "string" ? p.sourceRef : undefined,
        }))
      : [],
    importantDates: Array.isArray(raw.importantDates)
      ? raw.importantDates.map((d: any) => ({
          date: typeof d.date === "string" ? d.date : "Date Not Specified",
          description: typeof d.description === "string" ? d.description : fallbackUnspecified,
          sourceRef: typeof d.sourceRef === "string" ? d.sourceRef : undefined,
        }))
      : [],
    keyObligations: Array.isArray(raw.keyObligations)
      ? raw.keyObligations.map((o: any) => ({
          obligation: typeof o.obligation === "string" ? o.obligation : fallbackUnspecified,
          party: typeof o.party === "string" ? o.party : "All Parties",
          sourceRef: typeof o.sourceRef === "string" ? o.sourceRef : undefined,
        }))
      : [],
    keyRights: Array.isArray(raw.keyRights)
      ? raw.keyRights.map((r: any) => ({
          right: typeof r.right === "string" ? r.right : fallbackUnspecified,
          party: typeof r.party === "string" ? r.party : "Party",
          sourceRef: typeof r.sourceRef === "string" ? r.sourceRef : undefined,
        }))
      : [],
    financialTerms: Array.isArray(raw.financialTerms)
      ? raw.financialTerms.map((f: any) => ({
          term: typeof f.term === "string" ? f.term : "Financial Term",
          amount: typeof f.amount === "string" ? f.amount : undefined,
          description: typeof f.description === "string" ? f.description : fallbackUnspecified,
          sourceRef: typeof f.sourceRef === "string" ? f.sourceRef : undefined,
        }))
      : [],
    duration: typeof raw.duration === "string" && raw.duration.trim() ? raw.duration : fallbackUnspecified,
    termination: typeof raw.termination === "string" && raw.termination.trim() ? raw.termination : fallbackUnspecified,
    importantClauses: Array.isArray(raw.importantClauses)
      ? raw.importantClauses.map((c: any) => ({
          title: typeof c.title === "string" ? c.title : "Attention Clause",
          explanation: typeof c.explanation === "string" ? c.explanation : fallbackUnspecified,
          whyItMatters: typeof c.whyItMatters === "string" ? c.whyItMatters : fallbackUnspecified,
          sourceRef: typeof c.sourceRef === "string" ? c.sourceRef : undefined,
        }))
      : [],
    questionsForLawyer: Array.isArray(raw.questionsForLawyer)
      ? raw.questionsForLawyer.filter((q: any) => typeof q === "string" && q.trim())
      : [],
    limitations: Array.isArray(raw.limitations)
      ? raw.limitations.filter((l: any) => typeof l === "string" && l.trim())
      : [],
    analyzedAt: new Date().toISOString(),
  };
}

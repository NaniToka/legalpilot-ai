/**
 * LegalPilot AI - AI Service Types & Contracts
 */

export type AIErrorType =
  | "MISSING_API_KEY"
  | "INVALID_CONFIG"
  | "RATE_LIMIT_EXCEEDED"
  | "PROVIDER_UNAVAILABLE"
  | "TIMEOUT"
  | "MALFORMED_OUTPUT"
  | "INVALID_REQUEST"
  | "UNKNOWN_ERROR";

export interface AIError {
  code: AIErrorType;
  message: string;
  userMessage: string;
}

export interface AIGroundedContext {
  documentText?: string;
  pages?: { pageNumber: number; text: string }[];
  chunks?: { id: string; heading?: string; text: string; pageNumber?: number }[];
  filename?: string;
}

export interface AIRequestOptions {
  task:
    | "health_check"
    | "document_understanding"
    | "analyze_clauses"
    | "summarize"
    | "detect_risks"
    | "qa"
    | "compare"
    | "checklist"
    | string;
  systemInstruction?: string;
  userInput?: string;
  documentContext?: AIGroundedContext;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  responseSchema?: Record<string, any>;
  timeoutMs?: number;
}

export interface AIUsageStats {
  promptTokens?: number;
  candidatesTokens?: number;
  totalTokens?: number;
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  rawContent: string;
  task: string;
  model: string;
  provider: string;
  usage?: AIUsageStats;
  durationMs: number;
  error?: AIError;
}

// --- Step 7 Document Understanding Structured Contracts ---

export interface DocumentParty {
  name: string;
  role: string;
  sourceRef?: string;
}

export interface ImportantDate {
  date: string;
  description: string;
  sourceRef?: string;
}

export interface KeyObligation {
  obligation: string;
  party: string;
  sourceRef?: string;
}

export interface KeyRight {
  right: string;
  party: string;
  sourceRef?: string;
}

export interface FinancialTerm {
  term: string;
  amount?: string;
  description: string;
  sourceRef?: string;
}

export interface AttentionClause {
  title: string;
  explanation: string;
  whyItMatters: string;
  sourceRef?: string;
}

export interface StructuredLegalDocumentAnalysis {
  documentId: string;
  documentType: string;
  overview: string;
  purpose: string;
  parties: DocumentParty[];
  importantDates: ImportantDate[];
  keyObligations: KeyObligation[];
  keyRights: KeyRight[];
  financialTerms: FinancialTerm[];
  duration: string;
  termination: string;
  importantClauses: AttentionClause[];
  questionsForLawyer: string[];
  limitations: string[];
  analyzedAt: string;
}

// --- Step 8 Clause, Obligation & Attention Point Analysis Contracts ---

export type ReviewSeverity = "Review" | "Important" | "High Attention";

export interface DetailedClauseFinding {
  category: string;
  title: string;
  clauseSummary: string;
  plainLanguageExplanation: string;
  whyItMatters: string;
  sourceReference?: string;
}

export interface DetailedObligation {
  party: string;
  obligation: string;
  deadline?: string;
  consequenceIfStated?: string;
  sourceReference?: string;
}

export interface DetailedRight {
  party: string;
  right: string;
  conditions?: string;
  sourceReference?: string;
}

export interface AttentionPointFinding {
  title: string;
  explanation: string;
  reasonForReview: string;
  severity: ReviewSeverity;
  sourceReference?: string;
}

export interface DetailedDeadline {
  dateOrTrigger: string;
  requirement: string;
  sourceReference?: string;
}

export interface DetailedFinancialCommitment {
  description: string;
  amount?: string;
  currency?: string;
  conditions?: string;
  sourceReference?: string;
}

export interface QuestionForProfessional {
  question: string;
  reason: string;
}

export interface StructuredClauseAnalysisResult {
  documentId: string;
  documentType: string;
  analyzedAt: string;
  importantClauses: DetailedClauseFinding[];
  obligations: DetailedObligation[];
  rights: DetailedRight[];
  attentionPoints: AttentionPointFinding[];
  deadlines: DetailedDeadline[];
  financialCommitments: DetailedFinancialCommitment[];
  questionsForProfessional: QuestionForProfessional[];
  limitations: string[];
}

export interface StructuredLegalAnalysisContract {
  summary?: {
    overview: string;
    keyParties: string[];
    governingLaw?: string;
    effectiveDate?: string;
  };
  keyPoints?: string[];
  clauses?: {
    title: string;
    originalText: string;
    explanation: string;
  }[];
  risks?: {
    severity: "low" | "medium" | "high" | "critical";
    clauseTitle: string;
    explanation: string;
    recommendation: string;
  }[];
  questions?: string[];
  nextSteps?: string[];
}

// --- Step 9 Evidence-Grounded Legal Q&A Contracts ---

export type QAAnswerType = "document_fact" | "document_explanation" | "insufficient_information";

export type QAConfidenceLevel =
  | "Strongly supported by document"
  | "Partially supported by document"
  | "Insufficient document evidence";

export interface QASourceReference {
  pageNumber?: number;
  sectionHeader?: string;
  excerpt?: string;
}

export interface StructuredQAResult {
  question: string;
  answer: string;
  answerType: QAAnswerType;
  confidence: QAConfidenceLevel;
  sources: QASourceReference[];
  limitations: string[];
  suggestedFollowUps: string[];
  answeredAt: string;
}

export interface QAMessageItem {
  id: string;
  question: string;
  result: StructuredQAResult;
  timestamp: string;
}

// --- Step 10 Legal Document Comparison Contracts ---

export type ComparisonChangeType = "added" | "removed" | "modified";

export interface DeterministicDiffChunk {
  id: string;
  changeType: ComparisonChangeType | "unchanged";
  originalChunkId?: string;
  newChunkId?: string;
  originalText?: string;
  newText?: string;
  originalPage?: number;
  newPage?: number;
  originalHeading?: string;
  newHeading?: string;
}

export interface DeterministicDiffResult {
  documentAId: string;
  documentAName: string;
  documentBId: string;
  documentBName: string;
  totalChunksA: number;
  totalChunksB: number;
  addedChunksCount: number;
  removedChunksCount: number;
  modifiedChunksCount: number;
  unchangedChunksCount: number;
  diffs: DeterministicDiffChunk[];
}

export interface ComparisonChangeItem {
  category: string;
  title: string;
  changeType: ComparisonChangeType;
  originalText?: string;
  newText?: string;
  explanation: string;
  whyItMayMatter: string;
  originalSource?: string;
  newSource?: string;
}

export interface ChangedObligationItem {
  party: string;
  originalObligation?: string;
  newObligation?: string;
  explanation: string;
  sourceRef?: string;
}

export interface ChangedFinancialTermItem {
  description: string;
  originalAmount?: string;
  newAmount?: string;
  explanation: string;
  sourceRef?: string;
}

export interface ChangedDateItem {
  dateOrTrigger: string;
  originalRequirement?: string;
  newRequirement?: string;
  explanation: string;
  sourceRef?: string;
}

export interface StructuredDocumentComparisonResult {
  documentAId: string;
  documentAName: string;
  documentBId: string;
  documentBName: string;
  comparedAt: string;
  totalChangesCount: number;
  summary: string;
  affectedCategories: string[];
  changes: ComparisonChangeItem[];
  changedObligations: ChangedObligationItem[];
  changedFinancialTerms: ChangedFinancialTermItem[];
  changedDates: ChangedDateItem[];
  changedTerminationTerms: ComparisonChangeItem[];
  questionsForReview: string[];
  limitations: string[];
}



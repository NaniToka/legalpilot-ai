# LegalPilot AI

> **Understand Your Legal Documents. Know Your Next Step.**

LegalPilot AI is a modern GenAI-powered legal information assistant created for the **PromptWars: Virtual challenge ("AI for Legal Assistance & Access")**.

---

## ⚖️ Project Purpose

Legal contracts, lease agreements, terms of service, and official notices are often filled with dense legal jargon that makes them difficult for individuals, small business owners, and non-lawyers to understand.

**LegalPilot AI** aims to bridge this legal access gap by providing automated, accessible, plain-English document analysis. It breaks down complex agreements into understandable key terms, highlights high-risk clauses, facilitates interactive Q&A on documents, compares contract versions, and generates actionable step-by-step checklists.

---

## 🚀 End-to-End Workflow (Step 12 Implemented)

```
1. UPLOAD PDF / DOCX
         ↓
2. INGESTION & TEXT EXTRACTION (pdf-parse / mammoth)
         ↓
3. NORMALIZATION & STRUCTURAL CHUNKING
         ↓
4. "UNDERSTAND THIS DOCUMENT" (Structured Legal Overview)
         ↓
5. "ANALYZE IMPORTANT CLAUSES" (Clause, Obligation & Points to Review)
         ↓
6. "ASK QUESTIONS (Q&A)" (Evidence-Grounded Document Retrieval & Q&A)
         ↓
7. "COMPARE DOCUMENTS" (Deterministic Diff + AI Legal Difference Analysis)
         ↓
8. "YOUR NEXT STEPS" (Actionable Document Checklist & Task Management)
         ↓
9. "PREPARE CONSULTATION BRIEF" (Structured Legal Professional Preparation Brief)
```

### Document Capabilities

#### 1. Document Understanding (Step 7)
- **Document Type Identification**: Classifies uploaded file (Lease, Service Agreement, NDA, Employment Contract, etc.).
- **Plain-Language Summary**: Accessible breakdown explaining complex legal concepts in simple terms without losing key legal terms.
- **Parties & Entity Mapping**: Extracts party names, roles, and page/section source references.
- **Important Dates & Deadlines**: Effective dates, expiration, notice periods, and milestones.
- **Obligations & Rights**: Clear duty mapping for each party.
- **Financial & Payment Terms**: Monetary fees, deposits, currencies, and payment schedules.
- **Questions for Lawyer**: Practical, tailored questions for the user's next legal meeting.

#### 2. Clause, Obligation & Attention-Point Analysis (Step 8)
- **Important Clauses Breakdown**: Categorized analysis (Payment, Term, Renewal, Termination, IP, Liability, Indemnity, Dispute Resolution, Governing Law, Non-Compete) with summaries, plain-language explanations, and "Why It Matters".
- **Explicit Obligation Tracking**: Maps exact party duties, deadlines, and stated contractual consequences without inventing unstated fallout.
- **Granted Rights Analysis**: Grounded extraction of rights, notice powers, termination rights, and conditions.
- **Points to Review (Attention Points)**: Identifies provisions deserving closer review (auto-renewal, unilateral indemnity, broad restrictions) using non-judgmental, review-priority tiers (`Review`, `Important`, `High Attention`).
- **Deadlines & Notice Windows**: Exact dates or relative triggers (`60 days prior to expiry`) preserved verbatim.
- **Financial Commitments**: Structured extraction of amounts, currencies, and payment conditions.
- **Grounded Legal Questions**: Generates practical, evidence-backed questions for a legal professional based on identified ambiguities.
- **Page & Section Source References**: Attaches page numbers, section headers, or short text references to findings.

#### 3. Evidence-Grounded Legal Q&A (Step 9)
- **Document-Grounded Answers**: Answers user questions using strictly the extracted context of the uploaded file without fabricating legal facts or terms.
- **Evidence Confidence Tiers**: Classifies output confidence (`Strongly supported by document`, `Partially supported by document`, `Insufficient document evidence`).
- **Insufficient Information Handling**: Transparently indicates when a question cannot be answered from document text (`"I couldn't find enough information in the uploaded document..."`).
- **Source Citation Cards**: Highlights exact page numbers, section headers, and concise text excerpts supporting each answer.
- **Suggested Follow-up Questions**: Dynamically generates contextually relevant follow-up questions for deeper exploration.
- **Conversation Session History**: Preserves chat turns for the active document without persisting sensitive data to third parties.

#### 4. Legal Document Comparison (Step 10)
- **Two-Document Processing Workflow**: Upload Document A (Original) and Document B (New Version) in PDF or DOCX format.
- **Deterministic Text & Structural Diff Engine**: Pre-calculates textual differences (`Added`, `Removed`, `Modified`, `Unchanged`) before AI interpretation to ensure zero hallucinated diffs.
- **Side-by-Side Clause View**: Displays side-by-side comparison boxes for Document A vs Document B with color-neutral status badges and source page/section references.
- **Grounded Change Breakdowns**: Dedicated sections for Changed Obligations, Changed Financial Terms, Changed Dates & Deadlines, and Changed Termination Terms.
- **Neutral Change Terminology**: Uses factual change labels (`added`, `removed`, `modified`) instead of fake numerical risk scores.
- **Tailored Legal Review Questions**: Generates practical questions to raise with a legal professional regarding version changes.

#### 5. Actionable Next Steps / Document Checklist (Step 11)
- **Evidence-Grounded Task Checklist**: Automatically derives actionable next steps, deadlines, obligations, payment tasks, and review points directly from uploaded document text.
- **Facts vs. Suggestions**: Clearly separates explicit contractual facts from practical user suggestions.
- **Relative & Explicit Deadlines**: Preserves relative notice windows verbatim (`at least 60 days before termination`) without inventing unbacked calendar dates.
- **Missing Information Tracking**: Generates `INFORMATION_NEEDED` items for absent or ambiguous terms.
- **Interactive Task Management**: Allows users to check/uncheck items (`TODO` $\leftrightarrow$ `COMPLETED`), filter by priority (`HIGH`, `MEDIUM`, `LOW`), filter by status, and view expanded source evidence and clause snippets.
- **Dedicated Lawyer Questions**: Highlights neutral, practical questions to raise with a licensed legal professional.

#### 6. Legal Professional Consultation Brief (Step 12)
- **Preparation Brief Generator**: Transforms document analysis into a structured consultation brief for meeting a licensed attorney or legal professional.
- **11 Essential Sections**: Document Overview, Key Facts, Key Obligations, Important Dates, Financial Terms, Termination & Renewal, Points to Clarify, Questions for Legal Professional, Information to Bring, Source References, and Limitations.
- **Document Comparison Integration**: Includes version comparison highlights when prior comparisons were performed.
- **Plain-Text Export**: Provides one-click "Copy Brief" plain-text clipboard action for printing, email, or meeting preparation notes.
- **Strict Grounding & Safety**: Preserves relative deadlines verbatim, avoids legal conclusions or validity declarations, and prominently renders legal safety disclaimers.

---

## 🤖 AI Foundation & Architecture

LegalPilot AI features a decoupled, provider-agnostic AI infrastructure built behind an abstract provider adapter model:

```
UI / Web Clients
      ↓
/api/ai/process (Server Endpoint — Hides API Keys)
      ↓
aiService Facade (executeAIRequest)
      ↓
GeminiAdapter (Google Gen AI SDK Adapter)
      ↓
Google Gemini API (gemini-2.5-flash)
```

### Key AI Design Guarantees
- **Strict Evidence Grounding**: Prompts enforce that document analysis relies **only** on provided document context without inventing unbacked legal clauses or terms.
- **Responsible Legal Safety**: System instructions establish that LegalPilot AI provides informational document breakdown only and does not replace qualified legal counsel.
- **Structured JSON Output**: Supports typed JSON schemas for contract summaries, clause breakdown, and risk scores.
- **Provider Error Normalization**: Normalizes rate limits, timeouts, and missing API key errors into safe application messages.
- **Client Key Security**: API keys are restricted to server-side execution (`/api/ai/process`) and never exposed to browser bundles.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (React 19, App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI SDK**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini 2.5 Flash)
- **Document Parsers**: `pdf-parse` (PDF extraction) & `mammoth` (DOCX extraction)
- **Testing**: `vitest` for automated unit & integration testing
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/)

---

## 💻 Local Setup & AI Configuration

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Environment Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Google Gemini API key to `.env.local`:
   ```env
   AI_PROVIDER=gemini
   AI_MODEL=gemini-2.5-flash
   GOOGLE_GEMINI_API_KEY=your_actual_gemini_api_key
   ```
   *(Obtain a free API key at [Google AI Studio](https://aistudio.google.com))*

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Run Automated Test Suite**:
   ```bash
   npm test
   ```

---

## ⚠️ Legal Disclaimer

> **IMPORTANT**: LegalPilot AI provides automated informational analysis and document breakdown for educational and navigational purposes only. It does **NOT** provide formal legal advice, legal representation, or establish an attorney-client relationship. Users should always consult with a qualified, licensed attorney or legal professional for formal legal counsel regarding specific legal agreements or disputes.

---

## 📄 License

This project is created for the **PromptWars: Virtual Challenge**. All rights reserved.

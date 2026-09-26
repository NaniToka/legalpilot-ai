# LegalPilot AI

> **Understand Your Legal Documents. Know Your Next Step.**

LegalPilot AI is an AI-powered legal information assistant created for the **PromptWars: Virtual Challenge ("AI for Legal Assistance & Access")**.

---

## ⚖️ Problem Statement & Purpose

Legal contracts, lease agreements, terms of service, employment contracts, and official notices are often filled with dense legal jargon. Important obligations, notice deadlines, payment schedules, restrictive covenants, version changes, and points to review are frequently buried inside lengthy documents.

For individuals, freelancers, and small business owners without in-house legal counsel, reading and interpreting these documents can be daunting and error-prone.

**LegalPilot AI** bridges this legal access gap by transforming complex, unstructured legal documents into clear, plain-English breakdowns, structured clause analyses, evidence-grounded Q&A, version comparisons, actionable next-step checklists, and structured legal consultation briefs.

> **⚠️ IMPORTANT LEGAL DISCLAIMER**: LegalPilot AI provides automated informational assistance and document analysis for educational and navigational purposes only. It is **NOT** a substitute for advice, representation, or counsel from a licensed legal professional.

---

## 🚀 End-to-End Core Workflow

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

### Detailed Stage Breakdown

1. **Upload PDF / DOCX**: Validates binary magic headers (`%PDF`, `PK`), extension, size limit ($\le 15\text{ MB}$), and sanitizes filenames.
2. **Ingestion & Text Extraction**: Parses raw PDF or Word buffers into clean text strings, page arrays, and word counts using `pdf-parse` and `mammoth`.
3. **Normalization & Structural Chunking**: Cleans text noise, repairs hyphenations, and partitions text into page-grounded structural chunks.
4. **Document Understanding**: AI classifies document type, extracts party roles, summarizes core purpose in plain English, and maps key dates, obligations, rights, and financial terms.
5. **Clause & Obligation Analysis**: Categorizes clauses (Payment, Renewal, Termination, IP, Indemnity, Governing Law) and flags provisions deserving review (`Review`, `Important`, `High Attention`) using neutral terminology.
6. **Evidence-Grounded Q&A**: Answers user questions using strictly document context, citing page and section references, and explicitly declaring when information is insufficient.
7. **Document Comparison**: Pre-calculates a deterministic text diff (`Added`, `Removed`, `Modified`, `Unchanged`) between Document A and Document B before AI analysis to guarantee zero hallucinated diffs.
8. **Actionable Next Steps**: Automatically derives an interactive task checklist (`DEADLINE`, `OBLIGATION`, `PAYMENT`, `INFORMATION_NEEDED`) with priority tiers and completion toggles.
9. **Legal Consultation Brief**: Generates an 11-section consultation preparation brief with plain-text copy and print/PDF export features.

---

## 📦 Key Implemented Features

### 1. Document Upload & Extraction
- **PDF & DOCX Support**: Client-side drag-and-drop or file picker with instant file metadata display.
- **Binary Signature Validation**: Verifies `%PDF` and `PK\x03\x04` magic headers to block executable/malicious uploads.
- **Filename Sanitization**: Removes path traversal characters (`../`, `..\`) and control characters.

### 2. Document Understanding (Step 7)
- **Document Classification**: Automatically classifies contract type (Lease, NDA, Service Agreement, etc.).
- **Plain-Language Summary**: Accessible, jargon-free overview of legal purpose.
- **Parties & Entity Mapping**: Party names, roles, and page/section references.
- **Key Obligations, Rights & Financial Terms**: Structured duty tracking and fee extractions.

### 3. Clause & Obligation Analysis (Step 8)
- **Clause Categorization**: Evaluates Payment, Term, Renewal, Termination, IP, Liability, Indemnity, Dispute Resolution, Governing Law, and Restrictions.
- **Points to Review (Attention Points)**: Identifies restrictive provisions using non-judgmental priority badges (`Review`, `Important`, `High Attention`).
- **Verbatim Relative Deadlines**: Preserves relative triggers (`at least 60 days before expiration`) without fabricating unbacked calendar dates.

### 4. Evidence-Grounded Legal Q&A (Step 9)
- **Strict Evidence Retrieval**: Answers user questions grounded strictly in document text.
- **Confidence Tiers**: `Strongly supported by document`, `Partially supported by document`, or `Insufficient document evidence`.
- **Source Citations**: Page numbers, section headers, and text excerpts attached to every answer.
- **Suggested Follow-up Questions**: Dynamically generated contextual follow-up prompts.

### 5. Legal Document Comparison (Step 10)
- **Dual Document Upload**: Upload Document A (Original) and Document B (New Version).
- **Deterministic Diff Engine**: Computes exact textual diffs prior to AI interpretation.
- **Side-by-Side / Mobile Stacked Views**: Color-coded diff boxes with source citations.
- **Changed Obligations, Financials & Dates**: Structured extraction of contractual changes.

### 6. Actionable Next Steps / Document Checklist (Step 11)
- **Automated Task Generation**: Converts obligations and deadlines into actionable items.
- **Interactive Task Management**: Filter by status (`TODO`, `COMPLETED`) or priority (`HIGH`, `MEDIUM`, `LOW`), expand clause sources, and track completion.
- **Missing Information Tracking**: Highlights missing terms (`INFORMATION_NEEDED`) as tasks.

### 7. Legal Professional Consultation Brief (Step 12)
- **Comprehensive Brief Generator**: 11 structured sections preparing users for legal meetings.
- **Version Comparison Highlights**: Automatically includes comparison highlights when available.
- **Copy Brief & Print PDF**: One-click plain-text clipboard export and browser print/PDF integration.

---

## 📁 Directory Structure & Architecture (Frontend & Backend Separation)

 LegalPilot AI uses a clean architectural separation between the **Frontend (Client Presentation Layer)** and **Backend (Server & AI Pipeline Layer)**.

```
legalpilot-ai/
├── 🎨 FRONTEND ARCHITECTURE (Client UI & Presentation Layer)
│   └── src/
│       ├── app/                         # Next.js App Router Pages (Frontend Views)
│       │   ├── page.tsx                 # Main Application Dashboard View
│       │   ├── documents/page.tsx       # Document Upload & Management View
│       │   ├── ask/page.tsx             # Evidence-Grounded Legal Q&A Workspace View
│       │   └── compare/page.tsx         # Legal Document Version Comparison View
│       └── components/                  # Client UI Component Library
│           ├── analysis/                # Clause, Obligation & Attention-Point Cards
│           ├── checklist/               # Actionable Next-Steps Checklist UI
│           ├── compare/                 # Dual Document Diffs & Side-by-Side Views
│           ├── consultation/            # Legal Professional Brief Generator & Print UI
│           ├── dashboard/               # Hero Banner, Workflow Guide & Features
│           ├── layout/                  # Navigation Bar, Mobile Drawer & Footer
│           ├── qa/                      # Interactive Q&A Chat & Citation Cards
│           └── upload/                  # File Drag-and-Drop Zone & Document Cards
│
├── ⚙️ BACKEND ARCHITECTURE (Server APIs, Ingestion & AI Engines)
│   └── src/
│       ├── app/api/                     # Server API Routes (Backend Endpoints)
│       │   ├── documents/route.ts       # Upload Ingestion, Magic Header & Parsing API
│       │   ├── ai/process/route.ts      # Server-Grounded AI Inference API (Isolated Secrets)
│       │   └── health/route.ts          # System Diagnostic & API Health API
│       └── services/                    # Core Backend Services & Business Logic
│           ├── ai/                      # AI Engine Pipeline
│           │   ├── aiFacade.ts          # Service Facade & Provider Router
│           │   ├── adapters/            # Google Gemini 2.5 Flash Provider Adapter
│           │   ├── prompts/             # Typed Legal Analysis & Grounded Prompts
│           │   ├── schemas/             # JSON Output Schema Validators
│           │   └── errors/              # Timeout & Retry Error Normalizer
│           ├── parser/                  # Ingestion & Ingestive Text Extraction
│           │   ├── pdfParser.ts         # pdf-parse Binary Extraction Engine
│           │   ├── docxParser.ts        # mammoth DOCX Extraction Engine
│           │   └── textNormalizer.ts    # Hyphen Repair & Structural Chunking Engine
│           └── compare/                 # Document Comparison Engine
│               ├── diffEngine.ts        # Deterministic Text Diff Calculation
│               └── comparisonService.ts # Legal Difference Analysis & Mapping
│
├── 🔗 SHARED CORE & UTILITIES
│   └── src/
│       ├── types/                       # Shared TypeScript Interfaces & Contracts
│       │   ├── ai.ts                    # Grounded Q&A, Clause & Summary Schemas
│       │   ├── document.ts              # Page Chunks, Upload Payloads & Metadata
│       │   ├── comparison.ts            # Version Diffs & Structural Changes
│       │   ├── checklist.ts             # Actionable Tasks & Priority Categories
│       │   └── brief.ts                 # Consultation Preparation Brief Contracts
│       └── lib/                         # Shared Utilities & System Constants
│           ├── constants.ts             # Max Upload Sizes & Allowed MIME Types
│           └── validation.ts            # Binary Header Verification & Path Sanitization
│
├── 🧪 AUTOMATED TEST SUITE
│   └── tests/                           # 10 Vitest Unit & Integration Test Suites
│       ├── aiClauseAnalysis.test.ts
│       ├── aiConsultationBrief.test.ts
│       ├── aiDocumentUnderstanding.test.ts
│       ├── aiFoundation.test.ts
│       ├── aiNextSteps.test.ts
│       ├── aiQA.test.ts
│       ├── documentComparison.test.ts
│       ├── documentProcessing.test.ts
│       ├── productionHardening.test.ts
│       └── uiResponsiveAccessibility.test.ts
│
└── 📁 ROOT & CONFIGURATION
    ├── fixtures/                        # Synthetic Contract Samples for Evaluator Demo
    ├── .env.example                     # Environment Variables Template
    ├── next.config.ts                   # Security Headers & Next.js Production Config
    └── README.md                        # Production Documentation
```

### Component Responsibility & Architectural Boundaries

| Layer Name | Subdirectories / Files | Key Responsibilities |
| :--- | :--- | :--- |
| **Frontend Architecture** | `src/app/(pages)`, `src/components/` | Renders client UI, interactive state management, responsive breakpoints, accessibility ARIA patterns, visual diff components, and clipboard/print exports. |
| **Backend Architecture** | `src/app/api/`, `src/services/` | Executes server side logic, binary magic header validation, PDF/DOCX text parsing, structural chunking, Gemini API request execution, isolated API secrets, and deterministic text diffing. |
| **Shared Core** | `src/types/`, `src/lib/` | Provides shared TypeScript type definitions, JSON output schema contracts, file size constants, path sanitization, and security validation helpers. |

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) 16.3.6 (React 19, App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **AI Engine**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini 2.5 Flash API)
- **Document Parsers**: `pdf-parse` (PDF extraction) & `mammoth` (DOCX extraction)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) (10 test suites, 81 automated tests)

---

## 💻 Developer Setup & Installation

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Step-by-Step Setup

1. **Clone Repository**:
   ```bash
   git clone https://github.com/NaniToka/legalpilot-ai.git
   cd legalpilot-ai
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your Google Gemini API key to `.env.local`:
   ```env
   AI_PROVIDER=gemini
   AI_MODEL=gemini-2.5-flash
   GOOGLE_GEMINI_API_KEY=your_actual_gemini_api_key
   ```
   *(Obtain a free API key at [Google AI Studio](https://aistudio.google.com))*

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run Automated Test Suite**:
   ```bash
   npm test
   ```

6. **Run Production Build**:
   ```bash
   npm run build
   ```

---

## 🔒 Security Architecture

- **Server-Side API Key Isolation**: API keys (`GOOGLE_GEMINI_API_KEY`) are executed strictly within server endpoints (`/api/ai/process`) and are never exposed to browser client bundles.
- **Binary Signature Validation**: Verifies binary magic headers (`%PDF`, `PK\x03\x04`) to prevent malicious executable uploads spoofing extensions.
- **Untrusted Document Data Isolation**: Uploaded document text is wrapped in explicit delimiters (`<<<BEGIN UNTRUSTED USER DOCUMENT DATA>>>` ... `<<<END UNTRUSTED USER DOCUMENT DATA>>>`) to prevent prompt injection.
- **Structured JSON Schema Enforcement**: AI outputs are validated against typed schemas before reaching the UI to block arbitrary code or HTML rendering.
- **HTTP Security Headers**: Configures `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-XSS-Protection: 1; mode=block`, and `Permissions-Policy`.
- **Sanitized Logging**: Document contents, user prompts, and credentials are never written to operational logs.

---

## 🧪 Testing Coverage

Run the complete test suite:
```bash
npm test
```

The test suite includes **10 test files and 81 automated unit & integration tests**:
- `tests/documentProcessing.test.ts`: Text normalization, word counting, PDF/DOCX parsing, signature validation.
- `tests/aiFoundation.test.ts`: Gemini adapter, facade routing, timeout handling, error normalization.
- `tests/aiDocumentUnderstanding.test.ts`: Document summary, party extraction, key date validation.
- `tests/aiClauseAnalysis.test.ts`: Clause categorization, obligations, attention points.
- `tests/aiQA.test.ts`: Evidence-grounded Q&A, source citations, insufficient information handling.
- `tests/documentComparison.test.ts`: Deterministic diff calculation, change categorization, side-by-side mapping.
- `tests/aiNextSteps.test.ts`: Actionable checklist validation, priority assignment, task status toggling.
- `tests/aiConsultationBrief.test.ts`: Consultation brief schema mapping, relative dates, lawyer questions.
- `tests/productionHardening.test.ts`: Prompt injection isolation, malformed response rejection, rate limit/timeout resilience.
- `tests/uiResponsiveAccessibility.test.ts`: File size formatting, filename sanitization, plain-text export formatting.

---

## 🎯 Evaluator Demo Guide ("Demo Flow")

Follow this step-by-step flow to evaluate LegalPilot AI using the provided synthetic demo contract fixtures:

### 1. Document Upload & Processing
- **Action**: Click "Select Document" or drag `fixtures/synthetic_sample_agreement.txt` into the upload area.
- **Expected Result**: The file is instantly validated and processed. Displays filename, word count (280 words), and page/chunk counts.

### 2. Understand This Document (Step 7)
- **Action**: Click **"Understand This Document"**.
- **Expected Result**: AI generates a structured summary identifying parties (Apex Tech Solutions & Zenith Retail Corp), effective date (1 Jan 2027), monthly fee ($10,000), 60-day notice requirement, and core obligations.

### 3. Clause & Obligation Analysis (Step 8)
- **Action**: Click **"Analyze Clauses"**.
- **Expected Result**: Categorized analysis of Payment, Term, Renewal, Termination, Confidentiality, and Governing Law. Flags 60-day notice requirement as an attention point (`Review`).

### 4. Evidence-Grounded Q&A (Step 9)
- **Action**: Click **"Ask Questions (Q&A)"** and ask: *"How can termination notice be delivered?"*
- **Expected Result**: AI answers that notice must be delivered in writing, but Section 4 does not specify whether email or registered mail is required, citing Section 4 with confidence level `Partially supported by document`.

### 5. Document Version Comparison (Step 10)
- **Action**: Navigate to `/compare`. Upload `fixtures/synthetic_sample_agreement.txt` as Document A (Original) and `fixtures/synthetic_sample_agreement_v2.txt` as Document B (Revised Version).
- **Expected Result**: Shows exact changes: subscription fee increased from $10,000 to $12,500; notice requirement increased from 60 days to 90 days; governing law changed from California to Delaware.

### 6. Actionable Next Steps (Step 11)
- **Action**: Click **"Your Next Steps"**.
- **Expected Result**: Generates an interactive task checklist with high-priority items (e.g. 90-day non-renewal notice deadline), allowing completion checkoffs (`TODO` $\rightarrow$ `COMPLETED`).

### 7. Legal Consultation Brief (Step 12)
- **Action**: Click **"Prepare Consultation Brief"**.
- **Expected Result**: Generates a 11-section structured brief. Click **"Copy Brief"** or **"Print / Save PDF"** to export a clean plain-text or printed document.

---

## 📊 Evaluation Alignment Matrix

| Evaluation Category | Implementation Details in LegalPilot AI |
| :--- | :--- |
| **Code Quality** | Decoupled Next.js 16 App Router architecture, TypeScript strict mode, reusable provider adapters, typed JSON schemas, sanitized component state. |
| **Security** | Server-side API key protection, binary magic header validation, prompt injection data isolation, schema enforcement, sanitized error messages, security headers. |
| **Efficiency** | Reused structured analysis payloads across workflows, bounded context chunks, zero duplicate AI calls on re-renders, fast Next.js static builds (294ms). |
| **Testing** | 10 automated test suites with 81 unit & integration tests covering parsers, AI adapters, security hardening, comparison diffs, and UI export helpers. |
| **Accessibility** | Semantic HTML5 structure, ARIA roles (`aria-expanded`, `aria-current`), keyboard focus outlines, touch targets ($\ge 44\text{px}$), mobile-first responsive layout (320px to 1440px+). |
| **Problem Statement Alignment** | Solves dense legal jargon confusion via evidence-grounded document understanding, clause review, Q&A, version diffs, actionable checklists, and lawyer consultation briefs. |

---

## 📄 License

Created for the **PromptWars: Virtual Challenge**. All rights reserved.

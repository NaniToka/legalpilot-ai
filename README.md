# LegalPilot AI

> **Understand Your Legal Documents. Know Your Next Step.**

LegalPilot AI is a modern GenAI-powered legal information assistant created for the **PromptWars: Virtual challenge ("AI for Legal Assistance & Access")**.

---

## ⚖️ Project Purpose

Legal contracts, lease agreements, terms of service, and official notices are often filled with dense legal jargon that makes them difficult for individuals, small business owners, and non-lawyers to understand.

**LegalPilot AI** aims to bridge this legal access gap by providing automated, accessible, plain-English document analysis. It breaks down complex agreements into understandable key terms, highlights high-risk clauses, facilitates interactive Q&A on documents, compares contract versions, and generates actionable step-by-step checklists.

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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, ArrowLeft, Upload, FileText } from "lucide-react";
import dynamic from "next/dynamic";
import { ProcessedDocumentPayload } from "@/types";

const DocumentQAView = dynamic(
  () => import("@/components/qa/DocumentQAView").then((mod) => mod.DocumentQAView),
  { loading: () => <div className="p-12 text-center text-xs text-amber-400 font-mono animate-pulse">Loading Q&A Assistant Workspace...</div> }
);

const DocumentUploadWorkflow = dynamic(
  () => import("@/components/upload/DocumentUploadWorkflow").then((mod) => mod.DocumentUploadWorkflow),
  { loading: () => <div className="p-12 text-center text-xs text-emerald-400 font-mono animate-pulse">Loading Document Ingestion Engine...</div> }
);

const samplePayload: ProcessedDocumentPayload = {
  documentId: "doc_sample_lease",
  filename: "Sample_Residential_Lease_Agreement.pdf",
  fileType: "pdf",
  fileSize: 34500,
  formattedSize: "33.7 KB",
  processedAt: new Date().toISOString(),
  status: "completed",
  extractedText: `RESIDENTIAL LEASE AGREEMENT

1. PARTIES & PREMISES
This Lease Agreement is entered into on October 1, 2026, by and between Apex Property Management ("Landlord") and Jane Doe ("Tenant"), for the lease of the residential apartment located at 742 Evergreen Terrace, Unit 4B, Springfield ("Premises").

2. TERM & RENEWAL
The initial term of this Lease shall commence on October 1, 2026, and end on September 30, 2027 (12 months). This agreement shall automatically renew for successive 12-month periods unless either party delivers written notice of non-renewal at least sixty (60) days prior to the expiration of the current term.

3. RENT & FINANCIAL COMMITMENTS
Tenant agrees to pay Landlord monthly rent in the amount of $2,200.00 USD, payable on or before the 1st day of each calendar month. A late fee of $100.00 USD shall apply to any payment received after the 5th day of the month. Tenant shall deposit a security deposit of $2,200.00 USD upon execution of this agreement.

4. OBLIGATIONS OF TENANT
Tenant shall maintain the Premises in a clean and safe condition. Tenant shall not perform structural alterations without prior written consent. Tenant agrees to maintain renters insurance with a minimum liability coverage of $100,000.00 USD throughout the term.

5. TERMINATION FOR CONVENIENCE & BREACH
Either party may terminate this Lease for cause upon thirty (30) days written notice in the event of a material breach of any term herein. Tenant may terminate prior to lease end for convenience subject to payment of an Early Termination Fee equal to two (2) months' rent.

6. GOVERNING LAW & DISPUTES
This Agreement shall be governed by and construed in accordance with the laws of the State of California. Any disputes arising hereunder shall be resolved through binding arbitration in Los Angeles County.`,
  characterCount: 1720,
  wordCount: 265,
  pageCount: 2,
  pages: [
    {
      pageNumber: 1,
      text: "RESIDENTIAL LEASE AGREEMENT... PARTIES, TERM, RENT...",
      charCount: 900,
      wordCount: 140,
    },
    {
      pageNumber: 2,
      text: "OBLIGATIONS OF TENANT, TERMINATION, GOVERNING LAW...",
      charCount: 820,
      wordCount: 125,
    },
  ],
  chunks: [
    {
      id: "chunk_1",
      heading: "PARTIES & PREMISES",
      text: "This Lease Agreement is entered into by Apex Property Management (Landlord) and Jane Doe (Tenant) at 742 Evergreen Terrace.",
      charCount: 200,
      wordCount: 30,
      pageNumber: 1,
    },
    {
      id: "chunk_2",
      heading: "TERM & RENEWAL",
      text: "Commences Oct 1, 2026 to Sept 30, 2027. Automatically renews unless 60 days written notice of non-renewal is provided.",
      charCount: 220,
      wordCount: 35,
      pageNumber: 1,
    },
    {
      id: "chunk_3",
      heading: "RENT & FINANCIAL COMMITMENTS",
      text: "Monthly rent $2,200 USD due on 1st. Late fee $100 after 5th. Security deposit $2,200 USD.",
      charCount: 180,
      wordCount: 28,
      pageNumber: 1,
    },
    {
      id: "chunk_4",
      heading: "OBLIGATIONS OF TENANT",
      text: "Tenant must maintain clean premises, no unauthorized alterations, and $100,000 liability renters insurance.",
      charCount: 210,
      wordCount: 32,
      pageNumber: 2,
    },
    {
      id: "chunk_5",
      heading: "TERMINATION FOR CONVENIENCE & BREACH",
      text: "Termination for cause on 30 days notice. Early termination for convenience fee equals 2 months rent.",
      charCount: 200,
      wordCount: 30,
      pageNumber: 2,
    },
  ],
  warnings: [],
  errors: [],
};

export default function AskPage() {
  const [activeDocument, setActiveDocument] = useState<ProcessedDocumentPayload | null>(samplePayload);
  const [useCustomUpload, setUseCustomUpload] = useState(false);

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Document Q&A Assistant</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Ask LegalPilot
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Interactive natural-language Q&A grounded strictly in legal document text
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {useCustomUpload ? (
            <button
              onClick={() => {
                setUseCustomUpload(false);
                setActiveDocument(samplePayload);
              }}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Use Sample Document</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setUseCustomUpload(true);
                setActiveDocument(null);
              }}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Upload Custom File</span>
            </button>
          )}

          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl border border-slate-800 text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      {useCustomUpload && !activeDocument ? (
        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
          <DocumentUploadWorkflow />
        </section>
      ) : activeDocument ? (
        <DocumentQAView
          payload={activeDocument}
          onReset={() => {
            setUseCustomUpload(true);
            setActiveDocument(null);
          }}
        />
      ) : null}
    </div>
  );
}

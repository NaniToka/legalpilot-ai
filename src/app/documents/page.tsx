"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import { DocumentUploadWorkflow } from "@/components/upload/DocumentUploadWorkflow";

export default function DocumentsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Document Preparation Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Legal Document Uploader
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Select a PDF or DOCX agreement to validate and prepare for legal analysis
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Upload Workflow Container */}
      <div className="bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 sm:p-10">
        <DocumentUploadWorkflow />
      </div>
    </div>
  );
}

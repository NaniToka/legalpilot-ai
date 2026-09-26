"use client";

import React from "react";
import Link from "next/link";
import { GitCompare, ArrowLeft } from "lucide-react";
import { DocumentCompareWorkflow } from "@/components/compare/DocumentCompareWorkflow";

export default function ComparePage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-sky-400 font-mono mb-1">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Document Diff Tool</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Compare Legal Documents
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload two contract versions (PDF/DOCX) to identify structural diffs, obligation changes, dates, and financial terms.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Main Compare Workflow */}
      <DocumentCompareWorkflow />
    </div>
  );
}

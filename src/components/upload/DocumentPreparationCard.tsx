"use client";

import React from "react";
import { CheckCircle2, FileText, Sparkles, ArrowLeft, ShieldCheck } from "lucide-react";
import { PreparedDocument } from "@/types";

interface DocumentPreparationCardProps {
  document: PreparedDocument;
  onReset: () => void;
}

export const DocumentPreparationCard: React.FC<DocumentPreparationCardProps> = ({
  document,
  onReset,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl animate-fade-in">
      <div className="flex items-center space-x-3 text-emerald-400 font-mono text-xs uppercase tracking-wider">
        <CheckCircle2 className="w-5 h-5" />
        <span>Document Successfully Prepared for Analysis</span>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight break-all">
          {document.filename}
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-amber-400">
            {document.formattedSize}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 uppercase">
            {document.fileType}
          </span>
          <span className="text-slate-500">ID: {document.id}</span>
        </div>
      </div>

      {/* Step 4 Preparation Callout */}
      <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-5 space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Step 3 Upload Complete — Ready for Step 4 AI Processing</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Your document structure and file metadata are validated and securely stored in local application state. Text extraction, plain-English summarization, and AI clause risk detection will be integrated in **Step 4**.
        </p>
      </div>

      {/* Security Note */}
      <div className="flex items-start space-x-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
        <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <span>No file contents were logged or transmitted to external servers in this step.</span>
      </div>

      {/* Reset Action */}
      <div className="pt-2">
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium px-5 py-2.5 rounded-xl text-xs border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload Another Document</span>
        </button>
      </div>
    </div>
  );
};

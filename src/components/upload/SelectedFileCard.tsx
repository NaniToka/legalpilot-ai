"use client";

import React from "react";
import { FileText, Trash2, CheckCircle2, RefreshCw, ArrowRight } from "lucide-react";
import { PreparedDocument } from "@/types";

interface SelectedFileCardProps {
  document: PreparedDocument;
  onRemove: () => void;
  onReplaceClick: () => void;
  onContinue: () => void;
  isPreparing?: boolean;
}

export const SelectedFileCard: React.FC<SelectedFileCardProps> = ({
  document,
  onRemove,
  onReplaceClick,
  onContinue,
  isPreparing,
}) => {
  const isPdf = document.fileType === "pdf";

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
      {/* File Header Details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-start space-x-4">
          {/* File Extension Icon Badge */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold font-mono text-sm shrink-0 border ${
              isPdf
                ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                : "bg-sky-500/10 border-sky-500/20 text-sky-400"
            }`}
          >
            {isPdf ? "PDF" : "DOCX"}
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-slate-100 text-base sm:text-lg break-all">
              {document.filename}
            </h3>
            <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
              <span>{document.formattedSize}</span>
              <span>•</span>
              <span className="capitalize">{document.fileType} Document</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-medium text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Ready to analyze</span>
          </div>
        </div>
      </div>

      {/* Card Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          {/* Replace Button */}
          <button
            onClick={onReplaceClick}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors py-2 px-3 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Choose different file</span>
          </button>

          {/* Remove Button */}
          <button
            onClick={onRemove}
            className="inline-flex items-center space-x-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors py-2 px-3 rounded-lg hover:bg-rose-950/40 border border-transparent hover:border-rose-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label={`Remove selected file ${document.filename}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onContinue}
          disabled={isPreparing}
          className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-50"
        >
          <span>Analyze Document</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

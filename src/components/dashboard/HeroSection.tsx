"use client";

import React from "react";
import { Upload, GitCompare, Sparkles, Shield, FileCheck, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onActionClick: (actionTitle: string, actionDescription: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onActionClick }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-6">
        {/* Category Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>AI Legal Document Workspace</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Your Legal Documents,{" "}
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-indigo-300 bg-clip-text text-transparent">
            Made Clear.
          </span>
        </h1>

        {/* Supporting Text */}
        <p className="text-slate-300 text-base sm:text-xl leading-relaxed max-w-2xl">
          Upload, understand, compare, and explore your legal documents with AI-powered assistance.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            onClick={() =>
              onActionClick(
                "Upload a Document",
                "Document upload and text extraction capabilities will be enabled in Step 3."
              )
            }
            className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Upload a Document"
          >
            <Upload className="w-5 h-5" />
            <span>Upload a Document</span>
          </button>

          <button
            onClick={() =>
              onActionClick(
                "Compare Documents",
                "Contract comparison and version diff tools will be enabled in future steps."
              )
            }
            className="inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-medium px-6 py-3.5 rounded-xl border border-slate-700 transition-all hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Compare Documents"
          >
            <GitCompare className="w-5 h-5 text-sky-400" />
            <span>Compare Documents</span>
          </button>
        </div>

        {/* Highlights Bar */}
        <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>PDF, DOCX & TXT Support</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Informational Legal Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Plain-English Breakdown</span>
          </div>
        </div>
      </div>
    </section>
  );
};

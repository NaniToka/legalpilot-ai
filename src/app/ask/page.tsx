import React from "react";
import Link from "next/link";
import { MessageSquare, ArrowLeft, Bot } from "lucide-react";

export const metadata = {
  title: "Ask LegalPilot | LegalPilot AI",
  description: "Ask questions and get plain-English explanations about your legal documents.",
};

export default function AskPage() {
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
            Interactive natural-language Q&A based strictly on your uploaded document
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

      {/* Feature Ready Card */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
          <Bot className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-slate-100">
            Interactive Legal Q&A Assistant
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Conversational document querying, clause retrieval, and plain-English explanation will be enabled in future AI processing steps.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium px-5 py-2.5 rounded-xl text-xs border border-slate-700 transition-all"
          >
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowLeft, ShieldCheck, Scale, Sparkles } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export const metadata = {
  title: "About & Help | LegalPilot AI",
  description: "Learn more about LegalPilot AI and responsible AI usage guidelines.",
};

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Information & Help</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            About LegalPilot AI
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Empowering individuals and businesses with accessible legal document breakdown
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

      {/* Main Content */}
      <div className="space-y-6">
        {/* Purpose Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              Our Purpose
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Legal documents are often written in dense legalese that creates barriers to understanding for non-lawyers. **LegalPilot AI** was designed for the **PromptWars: Virtual Challenge ("AI for Legal Assistance & Access")** to make contract terms, agreements, and notices clear, actionable, and accessible to everyone.
          </p>
        </div>

        {/* Responsible AI Guidelines */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              Responsible AI Principles
            </h2>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Informational Assistant Only:</strong> LegalPilot AI provides automated summaries and educational breakdown. It does not replace professional legal representation.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Human Verification Recommended:</strong> Users should always cross-reference AI-generated insights with their original document text.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Privacy & Respect:</strong> Document processing is built with user privacy and secure data handling principles in mind.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  FileText,
  Copy,
  Check,
  ArrowLeft,
  Scale,
  Users,
  Clock,
  CreditCard,
  HelpCircle,
  FolderCheck,
  AlertCircle,
  GitCompare,
  Bookmark,
  Printer,
} from "lucide-react";
import { StructuredConsultationBriefResult } from "@/types";
import { formatConsultationBriefAsPlainText } from "@/services/ai/prompts/consultationPrompt";

interface ConsultationBriefViewProps {
  brief: StructuredConsultationBriefResult;
  filename: string;
  onReset: () => void;
}

export const ConsultationBriefView: React.FC<ConsultationBriefViewProps> = ({
  brief,
  filename,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyBrief = () => {
    const plainText = formatConsultationBriefAsPlainText(brief);
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in print:text-black print:space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl print:border-none print:shadow-none print:bg-none print:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 print:pb-2">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs uppercase tracking-wider print:text-slate-700">
              <FileText className="w-4 h-4 print:hidden" />
              <span>Legal Professional Consultation Brief</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight break-all print:text-black">
              {filename}
            </h1>
            <p className="text-xs text-slate-400 font-mono print:text-slate-600">
              Prepared on: {new Date(brief.generatedAt).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              aria-label="Print or Save Brief to PDF"
            >
              <Printer className="w-4 h-4 text-purple-400" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleCopyBrief}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-purple-500/20 text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              aria-label="Copy Consultation Brief to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-950" />
                  <span>Copy Brief</span>
                </>
              )}
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-100">
            {brief.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Structured consultation brief prepared strictly from document evidence to assist your next legal meeting
          </p>
        </div>
      </div>

      {/* 1. DOCUMENT OVERVIEW */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Bookmark className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-100 text-base sm:text-lg">
            1. Document Overview & Summary
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5">
          {brief.documentSummary}
        </p>
      </section>

      {/* 2. KEY FACTS & OBLIGATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Facts */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">
              2. Key Document Facts ({brief.keyFacts.length})
            </h3>
          </div>

          {brief.keyFacts.length === 0 ? (
            <p className="text-xs text-slate-400">No specific key facts highlighted.</p>
          ) : (
            <div className="space-y-3">
              {brief.keyFacts.map((fact) => (
                <div key={fact.id} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-1">
                  <span className="font-bold text-slate-100 block">{fact.title}</span>
                  <p className="text-slate-300 leading-relaxed">{fact.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Key Obligations */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">
              3. Key Obligations ({brief.keyObligations.length})
            </h3>
          </div>

          {brief.keyObligations.length === 0 ? (
            <p className="text-xs text-slate-400">No specific obligations detailed.</p>
          ) : (
            <div className="space-y-3">
              {brief.keyObligations.map((ob) => (
                <div key={ob.id} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-1">
                  <span className="font-bold text-emerald-300 font-mono text-[11px] uppercase tracking-wider block">
                    [{ob.party}]
                  </span>
                  <p className="text-slate-300 leading-relaxed">{ob.obligation}</p>
                  {ob.deadlineText && (
                    <p className="text-amber-400 text-[11px] font-mono pt-1">Deadline: {ob.deadlineText}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 3. DATES & FINANCIAL TERMS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Important Dates */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">
              4. Important Dates & Deadlines ({brief.importantDates.length})
            </h3>
          </div>

          {brief.importantDates.length === 0 ? (
            <p className="text-xs text-slate-400">No specific deadlines specified.</p>
          ) : (
            <div className="space-y-3">
              {brief.importantDates.map((d) => (
                <div key={d.id} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-1">
                  <span className="font-bold text-amber-300 font-mono">{d.dateOrTrigger}</span>
                  <p className="text-slate-300">{d.requirement}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Financial Terms */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">
              5. Financial Terms ({brief.financialTerms.length})
            </h3>
          </div>

          {brief.financialTerms.length === 0 ? (
            <p className="text-xs text-slate-400">No financial terms specified.</p>
          ) : (
            <div className="space-y-3">
              {brief.financialTerms.map((fin) => (
                <div key={fin.id} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{fin.description}</span>
                    {fin.amount && (
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        {fin.amount}
                      </span>
                    )}
                  </div>
                  {fin.conditions && (
                    <p className="text-slate-400 text-[11px] leading-relaxed">Conditions: {fin.conditions}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 4. POINTS TO CLARIFY & TERMINATION */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">
              6. Points to Clarify & Review ({brief.pointsToClarify.length})
            </h3>
            <p className="text-xs text-slate-400">Unclear, ambiguous, or restrictive provisions to review with your attorney</p>
          </div>
        </div>

        {brief.pointsToClarify.length === 0 ? (
          <p className="text-xs text-slate-400">No specific points to clarify identified.</p>
        ) : (
          <div className="space-y-3">
            {brief.pointsToClarify.map((pt) => (
              <div key={pt.id} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-1">
                <span className="font-bold text-slate-100 block">{pt.title}</span>
                <p className="text-slate-300 leading-relaxed">{pt.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. QUESTIONS FOR A LEGAL PROFESSIONAL */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">
              7. Questions to Discuss With a Legal Professional ({brief.questionsForLegalProfessional.length})
            </h3>
            <p className="text-xs text-slate-400">Tailored, document-grounded questions for your consultation</p>
          </div>
        </div>

        {brief.questionsForLegalProfessional.length === 0 ? (
          <p className="text-xs text-slate-400">No specific questions suggested.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {brief.questionsForLegalProfessional.map((q, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed font-medium">
                {idx + 1}. {q}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. INFORMATION / DOCUMENTS TO HAVE READY */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <FolderCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">
              8. Information & Records to Have Ready ({brief.informationToBring.length})
            </h3>
            <p className="text-xs text-slate-400">Documents, records, or correspondence you may want to bring to your legal meeting</p>
          </div>
        </div>

        {brief.informationToBring.length === 0 ? (
          <p className="text-xs text-slate-400">No specific supporting records suggested.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {brief.informationToBring.map((item, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed font-medium">
                • {item}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. VERSION COMPARISON HIGHLIGHTS (IF AVAILABLE) */}
      {brief.comparisonHighlights && brief.comparisonHighlights.length > 0 && (
        <section className="bg-slate-900/80 border border-sky-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <GitCompare className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">
              Version Comparison Highlights ({brief.comparisonHighlights.length})
            </h3>
          </div>

          <div className="space-y-2">
            {brief.comparisonHighlights.map((c, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-300 font-mono">
                • {c}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Copy Brief Sticky Footer Callout */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl print:hidden">
        <div className="space-y-1">
          <span className="font-bold text-slate-100 text-sm block">
            Ready for your legal meeting?
          </span>
          <p className="text-xs text-slate-400">
            Click "Copy Brief" to copy the full plain-text brief to your clipboard for printing, email, or notes.
          </p>
        </div>

        <button
          onClick={handleCopyBrief}
          className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-slate-950 font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-purple-500/20 text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-950" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-950" />
              <span>Copy Brief</span>
            </>
          )}
        </button>
      </div>

      {/* Footer Legal Safety Disclaimer */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 flex items-start space-x-3 text-slate-400 text-xs">
        <Scale className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          LegalPilot AI provides informational assistance based on the documents you provide. It is not a substitute for advice from a qualified legal professional.
        </p>
      </div>
    </div>
  );
};

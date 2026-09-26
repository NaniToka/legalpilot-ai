"use client";

import React, { useState } from "react";
import {
  GitCompare,
  ArrowLeft,
  FileCheck2,
  AlertTriangle,
  Scale,
  PlusCircle,
  MinusCircle,
  Edit3,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Clock,
  CreditCard,
  Users,
  ShieldCheck,
} from "lucide-react";
import {
  StructuredDocumentComparisonResult,
  ComparisonChangeItem,
  ChangedObligationItem,
  ChangedFinancialTermItem,
  ChangedDateItem,
  ComparisonChangeType,
} from "@/types";

interface DocumentComparisonViewProps {
  comparison: StructuredDocumentComparisonResult;
  onReset: () => void;
}

export const DocumentComparisonView: React.FC<DocumentComparisonViewProps> = ({
  comparison,
  onReset,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    differences: true,
    obligations: true,
    financial: true,
    dates: true,
    termination: true,
    questions: true,
  });

  const toggleSection = (sec: string) => {
    setExpandedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const getChangeBadge = (changeType: ComparisonChangeType) => {
    switch (changeType) {
      case "added":
        return {
          label: "Added",
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          icon: <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />,
        };
      case "removed":
        return {
          label: "Removed",
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
          icon: <MinusCircle className="w-3.5 h-3.5 text-rose-400" />,
        };
      case "modified":
      default:
        return {
          label: "Modified",
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
          icon: <Edit3 className="w-3.5 h-3.5 text-amber-300" />,
        };
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs uppercase tracking-wider">
              <GitCompare className="w-4 h-4" />
              <span>Document Comparison Analysis Complete</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
              {comparison.documentAName} <span className="text-slate-500">vs</span> {comparison.documentBName}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Compared at: {new Date(comparison.comparedAt).toLocaleString()}
            </p>
          </div>

          <button
            onClick={onReset}
            className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Compare New Documents</span>
          </button>
        </div>

        {/* Comparison Summary Card */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-3 text-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                Comparison Summary
              </span>
              <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-sky-950 border border-sky-500/30 text-sky-300">
                {comparison.totalChangesCount} Total Changes Identified
              </span>
            </div>

            {comparison.affectedCategories.length > 0 && (
              <div className="flex items-center space-x-1.5 flex-wrap">
                {comparison.affectedCategories.map((cat, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
          <p className="text-slate-300 sm:text-sm leading-relaxed">{comparison.summary}</p>
        </div>
      </div>

      {/* 1. IMPORTANT DIFFERENCES (SIDE-BY-SIDE VIEW) */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <button
          onClick={() => toggleSection("differences")}
          className="w-full px-6 sm:px-8 py-5 flex items-center justify-between text-left border-b border-slate-800 bg-slate-950/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-base sm:text-lg">
                Important Differences ({comparison.changes.length})
              </h3>
              <p className="text-xs text-slate-400">Side-by-side breakdown of changed, added, and removed provisions</p>
            </div>
          </div>
          {expandedSections.differences ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {expandedSections.differences && (
          <div className="p-6 sm:p-8">
            {comparison.changes.length === 0 ? (
              <p className="text-xs text-slate-400">No major clause differences identified between documents.</p>
            ) : (
              <div className="space-y-6">
                {comparison.changes.map((item: ComparisonChangeItem, idx: number) => {
                  const badge = getChangeBadge(item.changeType);
                  return (
                    <div
                      key={idx}
                      className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4 text-xs"
                    >
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            {item.category}
                          </span>
                          <h4 className="font-bold text-slate-100 text-sm sm:text-base">{item.title}</h4>
                        </div>

                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${badge.bg}`}>
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>
                      </div>

                      {/* Side-by-Side Text Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Original Document A */}
                        <div className="bg-slate-900/90 border border-rose-500/20 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-mono text-rose-300 font-semibold border-b border-rose-500/20 pb-1.5">
                            <span>Document A (Original)</span>
                            {item.originalSource && <span className="text-[10px] text-slate-400">{item.originalSource}</span>}
                          </div>
                          <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                            {item.originalText || "No corresponding text in Document A."}
                          </p>
                        </div>

                        {/* New Version Document B */}
                        <div className="bg-slate-900/90 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 font-semibold border-b border-emerald-500/20 pb-1.5">
                            <span>Document B (New Version)</span>
                            {item.newSource && <span className="text-[10px] text-slate-400">{item.newSource}</span>}
                          </div>
                          <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                            {item.newText || "No corresponding text in Document B."}
                          </p>
                        </div>
                      </div>

                      {/* Explanations */}
                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        <p className="text-slate-300 leading-relaxed">
                          <strong className="text-slate-200">Explanation:</strong> {item.explanation}
                        </p>

                        <div className="bg-slate-900/80 border border-amber-500/20 rounded-xl p-3.5 text-slate-300">
                          <strong className="text-amber-400 font-mono text-[11px] block mb-0.5">Why it may matter:</strong>
                          <p className="leading-relaxed">{item.whyItMayMatter}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 2. CHANGED OBLIGATIONS */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <button
          onClick={() => toggleSection("obligations")}
          className="w-full px-6 sm:px-8 py-5 flex items-center justify-between text-left border-b border-slate-800/80 bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Changed Obligations ({comparison.changedObligations.length})
              </h3>
              <p className="text-xs text-slate-400">Duties and commitments modified between versions</p>
            </div>
          </div>
          {expandedSections.obligations ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {expandedSections.obligations && (
          <div className="p-6 sm:p-8">
            {comparison.changedObligations.length === 0 ? (
              <p className="text-xs text-slate-400">No obligation changes identified.</p>
            ) : (
              <div className="space-y-4">
                {comparison.changedObligations.map((ob: ChangedObligationItem, idx: number) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300 font-mono text-[11px] uppercase tracking-wider bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded">
                        {ob.party}
                      </span>
                      {ob.sourceRef && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          {ob.sourceRef}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                      {ob.originalObligation && (
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300">
                          <span className="text-rose-400 text-[10px] block mb-1">ORIGINAL OBLIGATION:</span>
                          <p>{ob.originalObligation}</p>
                        </div>
                      )}
                      {ob.newObligation && (
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300">
                          <span className="text-emerald-400 text-[10px] block mb-1">NEW OBLIGATION:</span>
                          <p>{ob.newObligation}</p>
                        </div>
                      )}
                    </div>

                    <p className="text-slate-300 leading-relaxed font-sans"><strong className="text-slate-200">Explanation:</strong> {ob.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. CHANGED FINANCIAL TERMS & DATES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Financial Terms */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">
              Changed Financial Terms ({comparison.changedFinancialTerms.length})
            </h3>
          </div>

          {comparison.changedFinancialTerms.length === 0 ? (
            <p className="text-xs text-slate-400">No financial term changes detected.</p>
          ) : (
            <div className="space-y-3">
              {comparison.changedFinancialTerms.map((fc: ChangedFinancialTermItem, idx: number) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-2">
                  <span className="font-bold text-slate-200 block">{fc.description}</span>
                  <div className="flex items-center justify-between font-mono text-[11px] bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-rose-400">Old: {fc.originalAmount || "N/A"}</span>
                    <span className="text-emerald-400 font-bold">New: {fc.newAmount || "N/A"}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{fc.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Changed Dates */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">
              Changed Dates & Deadlines ({comparison.changedDates.length})
            </h3>
          </div>

          {comparison.changedDates.length === 0 ? (
            <p className="text-xs text-slate-400">No date or deadline changes detected.</p>
          ) : (
            <div className="space-y-3">
              {comparison.changedDates.map((dl: ChangedDateItem, idx: number) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-2">
                  <span className="font-bold text-amber-300 font-mono block">{dl.dateOrTrigger}</span>
                  <div className="text-[11px] font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    {dl.originalRequirement && <p className="text-slate-400">Old: {dl.originalRequirement}</p>}
                    {dl.newRequirement && <p className="text-emerald-400 font-semibold">New: {dl.newRequirement}</p>}
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{dl.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. QUESTIONS FOR REVIEW */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">
              Questions to Review with a Legal Professional ({comparison.questionsForReview.length})
            </h3>
            <p className="text-xs text-slate-400">Practical questions based on identified document differences</p>
          </div>
        </div>

        {comparison.questionsForReview.length === 0 ? (
          <p className="text-xs text-slate-400">No specific review questions suggested.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {comparison.questionsForReview.map((q, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed font-medium">
                • {q}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Legal Disclaimer Callout */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 flex items-start space-x-3 text-slate-400 text-xs">
        <Scale className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          LegalPilot AI highlights differences between the provided documents for informational purposes. It does not determine the legal effect or enforceability of those changes. Consider consulting a qualified legal professional for situation-specific advice.
        </p>
      </div>
    </div>
  );
};

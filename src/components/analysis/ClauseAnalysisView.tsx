"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  FileCheck2,
  Users,
  Clock,
  CreditCard,
  HelpCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Scale,
  Bookmark,
  CheckCircle2,
} from "lucide-react";
import {
  StructuredClauseAnalysisResult,
  DetailedClauseFinding,
  DetailedObligation,
  DetailedRight,
  AttentionPointFinding,
  DetailedDeadline,
  DetailedFinancialCommitment,
  QuestionForProfessional,
} from "@/types";

interface ClauseAnalysisViewProps {
  analysis: StructuredClauseAnalysisResult;
  filename: string;
  onReset: () => void;
}

export const ClauseAnalysisView: React.FC<ClauseAnalysisViewProps> = ({
  analysis,
  filename,
  onReset,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    attention: true,
    clauses: true,
    obligations: true,
    rights: true,
    deadlines: true,
    financial: true,
    questions: true,
  });

  const toggleSection = (sec: string) => {
    setExpandedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "High Attention":
        return "bg-rose-500/10 border-rose-500/30 text-rose-400";
      case "Important":
        return "bg-amber-500/10 border-amber-500/30 text-amber-300";
      default:
        return "bg-slate-800 border-slate-700 text-slate-300";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Clause & Obligation Analysis Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight break-all">
              {filename}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Analyzed at: {new Date(analysis.analyzedAt).toLocaleString()}
            </p>
          </div>

          <button
            onClick={onReset}
            className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Analyze Another Document</span>
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-100">
            Clause Breakdown & Points to Review
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Grounded analysis of obligations, rights, deadlines, and attention points in your document
          </p>
        </div>
      </div>

      {/* 1. POINTS TO REVIEW / ATTENTION POINTS */}
      <section className="bg-slate-900/90 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl">
        <button
          onClick={() => toggleSection("attention")}
          className="w-full px-6 sm:px-8 py-5 flex items-center justify-between text-left border-b border-slate-800 bg-slate-950/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-base sm:text-lg">
                Points to Review ({analysis.attentionPoints.length})
              </h3>
              <p className="text-xs text-slate-400">
                Provisions that may deserve closer attention. These are review priorities, not legal conclusions.
              </p>
            </div>
          </div>
          {expandedSections.attention ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {expandedSections.attention && (
          <div className="p-6 sm:p-8">
            {analysis.attentionPoints.length === 0 ? (
              <p className="text-xs text-slate-400">No specific attention points were identified in this document.</p>
            ) : (
              <div className="space-y-4">
                {analysis.attentionPoints.map((item: AttentionPointFinding, idx: number) => (
                  <div
                    key={idx}
                    className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="font-bold text-slate-100 text-sm sm:text-base">
                        {item.title}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border uppercase ${getSeverityBadge(item.severity)}`}>
                          {item.severity}
                        </span>
                        {item.sourceReference && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            {item.sourceReference}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
                          What the document says:
                        </span>
                        <p className="text-slate-300 leading-relaxed">{item.explanation}</p>
                      </div>

                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-slate-300">
                        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block mb-0.5">
                          Why to review:
                        </span>
                        <p className="leading-relaxed">{item.reasonForReview}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 2. IMPORTANT CLAUSES */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <button
          onClick={() => toggleSection("clauses")}
          className="w-full px-6 sm:px-8 py-5 flex items-center justify-between text-left border-b border-slate-800/80 bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Important Clauses ({analysis.importantClauses.length})
              </h3>
              <p className="text-xs text-slate-400">Key contractual provisions identified in the text</p>
            </div>
          </div>
          {expandedSections.clauses ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {expandedSections.clauses && (
          <div className="p-6 sm:p-8">
            {analysis.importantClauses.length === 0 ? (
              <p className="text-xs text-slate-400">No specific important clauses were identified.</p>
            ) : (
              <div className="space-y-4">
                {analysis.importantClauses.map((clause: DetailedClauseFinding, idx: number) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                          {clause.category}
                        </span>
                        <h4 className="font-bold text-slate-100 text-sm">{clause.title}</h4>
                      </div>
                      {clause.sourceReference && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 self-start sm:self-center">
                          {clause.sourceReference}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-slate-300 leading-relaxed"><strong className="text-slate-200">Summary:</strong> {clause.clauseSummary}</p>
                      <p className="text-slate-300 leading-relaxed"><strong className="text-slate-200">Plain Language:</strong> {clause.plainLanguageExplanation}</p>
                      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 text-slate-300">
                        <strong className="text-amber-400 font-mono text-[11px] block mb-0.5">Why it matters:</strong>
                        <p>{clause.whyItMatters}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. OBLIGATIONS & RIGHTS */}
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
                Party Obligations & Rights
              </h3>
              <p className="text-xs text-slate-400">Duties, conditions, deadlines, and rights explicitly stated in the text</p>
            </div>
          </div>
          {expandedSections.obligations ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {expandedSections.obligations && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Obligations */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider text-emerald-400 font-mono">
                Party Obligations ({analysis.obligations.length})
              </h4>
              {analysis.obligations.length === 0 ? (
                <p className="text-xs text-slate-400">No specific obligations identified.</p>
              ) : (
                <div className="space-y-3">
                  {analysis.obligations.map((ob: DetailedObligation, idx: number) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-300 font-mono text-[11px] uppercase tracking-wider bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                          {ob.party}
                        </span>
                        {ob.sourceReference && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            {ob.sourceReference}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 leading-relaxed">{ob.obligation}</p>
                      {ob.deadline && (
                        <p className="text-amber-400 text-[11px] font-mono">Deadline: {ob.deadline}</p>
                      )}
                      {ob.consequenceIfStated && (
                        <p className="text-slate-400 text-[11px] italic">Stated Consequence: {ob.consequenceIfStated}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rights */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider text-sky-400 font-mono">
                Granted Rights ({analysis.rights.length})
              </h4>
              {analysis.rights.length === 0 ? (
                <p className="text-xs text-slate-400">No specific rights explicitly detailed.</p>
              ) : (
                <div className="space-y-3">
                  {analysis.rights.map((rt: DetailedRight, idx: number) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sky-300 font-mono text-[11px] uppercase tracking-wider bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded">
                          {rt.party}
                        </span>
                        {rt.sourceReference && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            {rt.sourceReference}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 leading-relaxed">{rt.right}</p>
                      {rt.conditions && (
                        <p className="text-slate-400 text-[11px]">Conditions: {rt.conditions}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 4. DEADLINES & FINANCIAL COMMITMENTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Deadlines */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">
              Deadlines & Notice Windows ({analysis.deadlines.length})
            </h3>
          </div>

          {analysis.deadlines.length === 0 ? (
            <p className="text-xs text-slate-400">No specific deadlines were identified in the document.</p>
          ) : (
            <div className="space-y-3">
              {analysis.deadlines.map((dl: DetailedDeadline, idx: number) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 font-mono">{dl.dateOrTrigger}</span>
                    {dl.sourceReference && (
                      <span className="text-[10px] font-mono text-slate-400">{dl.sourceReference}</span>
                    )}
                  </div>
                  <p className="text-slate-300">{dl.requirement}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Financial Commitments */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">
              Financial Commitments ({analysis.financialCommitments.length})
            </h3>
          </div>

          {analysis.financialCommitments.length === 0 ? (
            <p className="text-xs text-slate-400">No specific financial commitments identified.</p>
          ) : (
            <div className="space-y-3">
              {analysis.financialCommitments.map((fc: DetailedFinancialCommitment, idx: number) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{fc.description}</span>
                    {fc.amount && (
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        {fc.amount} {fc.currency || ""}
                      </span>
                    )}
                  </div>
                  {fc.conditions && (
                    <p className="text-slate-400 text-[11px]">Conditions: {fc.conditions}</p>
                  )}
                  {fc.sourceReference && (
                    <span className="text-[10px] font-mono text-slate-500 block pt-1">{fc.sourceReference}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. QUESTIONS FOR A LEGAL PROFESSIONAL */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">
              Questions to Raise with a Legal Professional ({analysis.questionsForProfessional.length})
            </h3>
            <p className="text-xs text-slate-400">Grounded questions based on complex or ambiguous document terms</p>
          </div>
        </div>

        {analysis.questionsForProfessional.length === 0 ? (
          <p className="text-xs text-slate-400">No specific questions suggested.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {analysis.questionsForProfessional.map((q: QuestionForProfessional, idx: number) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-1.5">
                <span className="font-bold text-slate-100 block">{q.question}</span>
                <p className="text-slate-400 text-[11px] leading-relaxed"><strong className="text-slate-300">Reason:</strong> {q.reason}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Legal Disclaimer Callout & Bottom Return Navigation */}
      <div className="space-y-4">
        <div className="bg-amber-950/20 border border-amber-900/30 rounded-3xl p-6 flex items-start space-x-3 text-amber-200/90 text-xs sm:text-sm">
          <Scale className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-amber-400 uppercase text-[11px] tracking-wider block">
              Informational Legal Analysis Notice
            </span>
            <p className="leading-relaxed text-amber-200/80 text-xs">
              LegalPilot AI provides general informational assistance and is not a substitute for advice from a qualified legal professional. Points identified here are based on the contents of the uploaded document and are not legal conclusions.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onReset}
            className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold px-5 py-2.5 rounded-xl border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Analyze Another Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};

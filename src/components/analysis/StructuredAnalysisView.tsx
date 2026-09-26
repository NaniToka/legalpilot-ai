"use client";

import React, { useState } from "react";
import {
  Sparkles,
  FileText,
  Users,
  Calendar,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Scale,
  Bookmark,
} from "lucide-react";
import {
  StructuredLegalDocumentAnalysis,
  DocumentParty,
  ImportantDate,
  KeyObligation,
  KeyRight,
  FinancialTerm,
  AttentionClause,
} from "@/types";

interface StructuredAnalysisViewProps {
  analysis: StructuredLegalDocumentAnalysis;
  filename: string;
  onReset: () => void;
}

export const StructuredAnalysisView: React.FC<StructuredAnalysisViewProps> = ({
  analysis,
  filename,
  onReset,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    parties: true,
    dates: true,
    obligations: true,
    financial: true,
    clauses: true,
    questions: true,
    limitations: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header & Status */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Document Analysis Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight break-all">
              {filename}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Analyzed at: {new Date(analysis.analyzedAt).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="px-3.5 py-1.5 rounded-full font-mono text-xs font-bold uppercase bg-amber-500/10 border border-amber-500/20 text-amber-300">
              {analysis.documentType}
            </span>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Here's what we found
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Structured plain-English document breakdown grounded in your uploaded text
            </p>
          </div>

          <button
            onClick={onReset}
            className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Analyze Another Document</span>
          </button>
        </div>
      </div>

      {/* 1. Executive Overview & Purpose */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <button
          onClick={() => toggleSection("overview")}
          className="w-full px-6 sm:px-8 py-5 flex items-center justify-between text-left border-b border-slate-800/80 bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                1. Executive Overview & Purpose
              </h3>
              <p className="text-xs text-slate-400">Plain-language summary for non-lawyers</p>
            </div>
          </div>
          {expandedSections.overview ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {expandedSections.overview && (
          <div className="p-6 sm:p-8 space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider text-amber-400 font-mono">
                Plain-English Summary
              </h4>
              <p className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 text-slate-200">
                {analysis.overview}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-1">
                <span className="font-semibold text-slate-200 text-xs uppercase tracking-wider text-indigo-400 font-mono block">
                  Document Purpose
                </span>
                <p className="text-xs text-slate-300">{analysis.purpose}</p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-1">
                <span className="font-semibold text-slate-200 text-xs uppercase tracking-wider text-sky-400 font-mono block">
                  Duration & Term Length
                </span>
                <p className="text-xs text-slate-300">{analysis.duration}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Parties Mentioned */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <button
          onClick={() => toggleSection("parties")}
          className="w-full px-6 sm:px-8 py-5 flex items-center justify-between text-left border-b border-slate-800/80 bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                2. Parties Mentioned ({analysis.parties.length})
              </h3>
              <p className="text-xs text-slate-400">Entities and individuals named in the agreement</p>
            </div>
          </div>
          {expandedSections.parties ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {expandedSections.parties && (
          <div className="p-6 sm:p-8">
            {analysis.parties.length === 0 ? (
              <p className="text-xs text-slate-400">Not specified in the document.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analysis.parties.map((party: DocumentParty, idx: number) => (
                  <div
                    key={idx}
                    className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 text-sm">{party.name}</span>
                      {party.sourceRef && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          {party.sourceRef}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-400 font-mono">{party.role}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. Important Dates & Deadlines */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <button
          onClick={() => toggleSection("dates")}
          className="w-full px-6 sm:px-8 py-5 flex items-center justify-between text-left border-b border-slate-800/80 bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                3. Important Dates & Deadlines ({analysis.importantDates.length})
              </h3>
              <p className="text-xs text-slate-400">Effective dates, expiration, notice periods, and milestones</p>
            </div>
          </div>
          {expandedSections.dates ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {expandedSections.dates && (
          <div className="p-6 sm:p-8">
            {analysis.importantDates.length === 0 ? (
              <p className="text-xs text-slate-400">Not specified in the document.</p>
            ) : (
              <div className="space-y-3">
                {analysis.importantDates.map((item: ImportantDate, idx: number) => (
                  <div
                    key={idx}
                    className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <span className="font-bold text-amber-300 text-sm font-mono block">
                        {item.date}
                      </span>
                      <p className="text-slate-300">{item.description}</p>
                    </div>
                    {item.sourceRef && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 self-start sm:self-center">
                        {item.sourceRef}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. Key Obligations & Rights */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <button
          onClick={() => toggleSection("obligations")}
          className="w-full px-6 sm:px-8 py-5 flex items-center justify-between text-left border-b border-slate-800/80 bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                4. Key Obligations & Rights
              </h3>
              <p className="text-xs text-slate-400">Duties, commitments, and protected rights for each party</p>
            </div>
          </div>
          {expandedSections.obligations ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {expandedSections.obligations && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Obligations */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider text-emerald-400 font-mono">
                Key Obligations ({analysis.keyObligations.length})
              </h4>
              {analysis.keyObligations.length === 0 ? (
                <p className="text-xs text-slate-400">Not specified in the document.</p>
              ) : (
                <div className="space-y-3">
                  {analysis.keyObligations.map((ob: KeyObligation, idx: number) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                          {ob.party}
                        </span>
                        {ob.sourceRef && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            {ob.sourceRef}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 leading-relaxed">{ob.obligation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rights */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider text-sky-400 font-mono">
                Key Rights ({analysis.keyRights.length})
              </h4>
              {analysis.keyRights.length === 0 ? (
                <p className="text-xs text-slate-400">Not specified in the document.</p>
              ) : (
                <div className="space-y-3">
                  {analysis.keyRights.map((rt: KeyRight, idx: number) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950/60 border border-sky-500/30 text-sky-300">
                          {rt.party}
                        </span>
                        {rt.sourceRef && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            {rt.sourceRef}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 leading-relaxed">{rt.right}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 5. Financial & Payment Terms */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <button
          onClick={() => toggleSection("financial")}
          className="w-full px-6 sm:px-8 py-5 flex items-center justify-between text-left border-b border-slate-800/80 bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                5. Financial & Payment Terms ({analysis.financialTerms.length})
              </h3>
              <p className="text-xs text-slate-400">Monetary obligations, fees, deposits, and payment schedules</p>
            </div>
          </div>
          {expandedSections.financial ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {expandedSections.financial && (
          <div className="p-6 sm:p-8">
            {analysis.financialTerms.length === 0 ? (
              <p className="text-xs text-slate-400">Not specified in the document.</p>
            ) : (
              <div className="space-y-3">
                {analysis.financialTerms.map((fin: FinancialTerm, idx: number) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 text-sm">{fin.term}</span>
                      {fin.amount && (
                        <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                          {fin.amount}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 leading-relaxed">{fin.description}</p>
                    {fin.sourceRef && (
                      <span className="text-[10px] font-mono text-slate-500 inline-block pt-1">
                        Source: {fin.sourceRef}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 6. Important Clauses (Attention Points) */}
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
                6. Important Clauses & Attention Points ({analysis.importantClauses.length})
              </h3>
              <p className="text-xs text-slate-400">Key provisions requiring careful review</p>
            </div>
          </div>
          {expandedSections.clauses ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {expandedSections.clauses && (
          <div className="p-6 sm:p-8">
            {analysis.importantClauses.length === 0 ? (
              <p className="text-xs text-slate-400">Not specified in the document.</p>
            ) : (
              <div className="space-y-4">
                {analysis.importantClauses.map((clause: AttentionClause, idx: number) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 text-sm">{clause.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                        Attention Point
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
                          Plain-English Explanation:
                        </span>
                        <p className="text-slate-300 leading-relaxed">{clause.explanation}</p>
                      </div>

                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-slate-300">
                        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block mb-0.5">
                          Why It Matters:
                        </span>
                        <p className="leading-relaxed">{clause.whyItMatters}</p>
                      </div>
                    </div>

                    {clause.sourceRef && (
                      <span className="text-[10px] font-mono text-slate-500 inline-block pt-1">
                        Source: {clause.sourceRef}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 7. Questions for Lawyer & Limitations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Questions for Lawyer */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">
              Questions to Ask a Lawyer
            </h3>
          </div>

          {analysis.questionsForLawyer.length === 0 ? (
            <p className="text-xs text-slate-400">None suggested.</p>
          ) : (
            <ul className="space-y-2.5 text-xs text-slate-300">
              {analysis.questionsForLawyer.map((q: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-2 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span className="leading-relaxed">{q}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Limitations / Unspecified */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">
              Unspecified Items / Limitations
            </h3>
          </div>

          {analysis.limitations.length === 0 ? (
            <p className="text-xs text-slate-400">No missing standard items detected.</p>
          ) : (
            <ul className="space-y-2.5 text-xs text-slate-300">
              {analysis.limitations.map((lim: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-2 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                  <span className="text-amber-400 font-bold">•</span>
                  <span className="leading-relaxed">{lim}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer Legal Disclaimer Callout & Bottom Return Navigation */}
      <div className="space-y-4">
        <div className="bg-amber-950/20 border border-amber-900/30 rounded-3xl p-6 flex items-start space-x-3 text-amber-200/90 text-xs sm:text-sm">
          <Scale className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-amber-400 uppercase text-[11px] tracking-wider block">
              Responsible AI Legal Information Notice
            </span>
            <p className="leading-relaxed text-amber-200/80 text-xs">
              This analysis provides general informational document breakdown for educational purposes. It does NOT provide legal advice or create an attorney-client relationship. Please consult a qualified lawyer regarding your specific legal rights and obligations.
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

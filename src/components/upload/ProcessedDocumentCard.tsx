"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldCheck,
  Loader2,
  BrainCircuit,
  Bookmark,
  MessageSquare,
  ListTodo,
  FileText as BriefIcon,
} from "lucide-react";
import {
  ProcessedDocumentPayload,
  StructuredLegalDocumentAnalysis,
  StructuredClauseAnalysisResult,
  StructuredNextStepsResult,
  StructuredConsultationBriefResult,
} from "@/types";
import { analyzeDocumentUnderstanding } from "@/services/ai/documentAnalysisService";
import { analyzeImportantClauses } from "@/services/ai/clauseAnalysisService";
import { generateDocumentNextSteps } from "@/services/ai/nextStepsService";
import { generateConsultationBrief } from "@/services/ai/consultationService";
import { StructuredAnalysisView } from "../analysis/StructuredAnalysisView";
import { ClauseAnalysisView } from "../analysis/ClauseAnalysisView";
import { DocumentQAView } from "../qa/DocumentQAView";
import { DocumentChecklistCard } from "../checklist/DocumentChecklistCard";
import { ConsultationBriefView } from "../consultation/ConsultationBriefView";

interface ProcessedDocumentCardProps {
  payload: ProcessedDocumentPayload;
  onReset: () => void;
}

export const ProcessedDocumentCard: React.FC<ProcessedDocumentCardProps> = ({
  payload,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "chunks" | "text">("overview");
  const [showFullText, setShowFullText] = useState(false);
  const [copied, setCopied] = useState(false);

  const [activeAction, setActiveAction] = useState<"none" | "understanding" | "clauses" | "checklist" | "consultation" | "qa">("none");
  const [showQAView, setShowQAView] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [understandingResult, setUnderstandingResult] = useState<StructuredLegalDocumentAnalysis | null>(null);
  const [clauseResult, setClauseResult] = useState<StructuredClauseAnalysisResult | null>(null);
  const [nextStepsResult, setNextStepsResult] = useState<StructuredNextStepsResult | null>(null);
  const [consultationResult, setConsultationResult] = useState<StructuredConsultationBriefResult | null>(null);

  const isPdf = payload.fileType === "pdf";

  const handleCopy = () => {
    if (payload.extractedText) {
      navigator.clipboard.writeText(payload.extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUnderstandDocument = async () => {
    setActiveAction("understanding");
    setAnalysisError(null);

    try {
      const res = await fetch("/api/ai/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "document_understanding",
          documentContext: {
            filename: payload.filename,
            pages: payload.pages,
            chunks: payload.chunks,
            documentText: payload.extractedText,
          },
          userInput: `Analyze the uploaded legal document (${payload.filename}) and extract a comprehensive structured legal overview.`,
        }),
      });

      if (res.ok) {
        const aiRes = await res.json();
        if (aiRes.success && aiRes.data) {
          setUnderstandingResult(aiRes.data);
          setActiveAction("none");
          return;
        }
      }

      const analysis = await analyzeDocumentUnderstanding(payload);
      setUnderstandingResult(analysis);
      setActiveAction("none");
    } catch (err: any) {
      setAnalysisError(err.message || "AI Analysis failed. Please verify API configuration and try again.");
      setActiveAction("none");
    }
  };

  const handleAnalyzeClauses = async () => {
    setActiveAction("clauses");
    setAnalysisError(null);

    try {
      const res = await fetch("/api/ai/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "analyze_clauses",
          documentContext: {
            filename: payload.filename,
            pages: payload.pages,
            chunks: payload.chunks,
            documentText: payload.extractedText,
          },
          userInput: `Analyze the uploaded document (${payload.filename}) for key clauses, obligations, rights, attention points, deadlines, and financial commitments.`,
        }),
      });

      if (res.ok) {
        const aiRes = await res.json();
        if (aiRes.success && aiRes.data) {
          setClauseResult(aiRes.data);
          setActiveAction("none");
          return;
        }
      }

      const clauses = await analyzeImportantClauses(payload);
      setClauseResult(clauses);
      setActiveAction("none");
    } catch (err: any) {
      setAnalysisError(err.message || "AI Clause Analysis failed. Please check API configuration.");
      setActiveAction("none");
    }
  };

  const handleGenerateChecklist = async () => {
    setActiveAction("checklist");
    setAnalysisError(null);

    try {
      const res = await fetch("/api/ai/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "checklist",
          documentContext: {
            filename: payload.filename,
            pages: payload.pages,
            chunks: payload.chunks,
            documentText: payload.extractedText,
          },
          userInput: `Analyze the uploaded document (${payload.filename}) and extract an actionable checklist of next steps, obligations, deadlines, and questions for a legal professional.`,
        }),
      });

      if (res.ok) {
        const aiRes = await res.json();
        if (aiRes.success && aiRes.data) {
          setNextStepsResult(aiRes.data);
          setActiveAction("none");
          return;
        }
      }

      const checklist = await generateDocumentNextSteps(payload);
      setNextStepsResult(checklist);
      setActiveAction("none");
    } catch (err: any) {
      setAnalysisError(err.message || "Failed to generate next steps checklist. Please check API configuration.");
      setActiveAction("none");
    }
  };

  const handlePrepareConsultationBrief = async () => {
    setActiveAction("consultation");
    setAnalysisError(null);

    try {
      const res = await fetch("/api/ai/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "consultation_brief",
          documentContext: {
            filename: payload.filename,
            pages: payload.pages,
            chunks: payload.chunks,
            documentText: payload.extractedText,
          },
          userInput: `Analyze the uploaded document (${payload.filename}) and prepare a concise, structured legal professional consultation brief.`,
        }),
      });

      if (res.ok) {
        const aiRes = await res.json();
        if (aiRes.success && aiRes.data) {
          setConsultationResult(aiRes.data);
          setActiveAction("none");
          return;
        }
      }

      const brief = await generateConsultationBrief(payload);
      setConsultationResult(brief);
      setActiveAction("none");
    } catch (err: any) {
      setAnalysisError(err.message || "Failed to prepare legal consultation brief. Please check API configuration.");
      setActiveAction("none");
    }
  };

  if (consultationResult) {
    return (
      <ConsultationBriefView
        brief={consultationResult}
        filename={payload.filename}
        onReset={() => setConsultationResult(null)}
      />
    );
  }

  if (nextStepsResult) {
    return (
      <DocumentChecklistCard
        checklist={nextStepsResult}
        filename={payload.filename}
        onReset={onReset}
      />
    );
  }

  if (showQAView) {
    return (
      <DocumentQAView
        payload={payload}
        onReset={() => setShowQAView(false)}
      />
    );
  }

  if (clauseResult) {
    return (
      <ClauseAnalysisView
        analysis={clauseResult}
        filename={payload.filename}
        onReset={onReset}
      />
    );
  }

  if (understandingResult) {
    return (
      <StructuredAnalysisView
        analysis={understandingResult}
        filename={payload.filename}
        onReset={onReset}
      />
    );
  }

  const previewText = showFullText
    ? payload.extractedText
    : payload.extractedText.slice(0, 800) + (payload.extractedText.length > 800 ? "..." : "");

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl animate-fade-in">
      {/* Header Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Document Processing Completed</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight break-all">
            {payload.filename}
          </h2>
        </div>

        {/* Format Badge */}
        <div className="flex items-center space-x-2">
          <span
            className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-bold uppercase border ${
              isPdf
                ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                : "bg-sky-500/10 border-sky-500/20 text-sky-400"
            }`}
          >
            {payload.fileType}
          </span>
          <span className="px-3.5 py-1.5 rounded-full font-mono text-xs bg-slate-950 border border-slate-800 text-slate-300">
            {payload.formattedSize}
          </span>
        </div>
      </div>

      {/* Analysis Error Alert */}
      {analysisError && (
        <div className="bg-rose-950/40 border border-rose-900/50 rounded-2xl p-4 text-rose-200 text-xs sm:text-sm space-y-1">
          <div className="flex items-center space-x-2 font-semibold text-rose-400 uppercase text-[11px] tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>AI Analysis Notice</span>
          </div>
          <p className="text-rose-200/90 leading-relaxed">{analysisError}</p>
        </div>
      )}

      {/* Warnings Banner if any */}
      {payload.warnings.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-900/40 rounded-2xl p-4 text-amber-200 text-xs sm:text-sm space-y-1">
          <div className="flex items-center space-x-2 font-semibold text-amber-400 uppercase text-[11px] tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Extraction Notice</span>
          </div>
          {payload.warnings.map((warn, i) => (
            <p key={i} className="text-amber-200/90 leading-relaxed">
              {warn}
            </p>
          ))}
        </div>
      )}

      {/* Prominent Action Banner for AI Workflows */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 p-0.5 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-100">
              Ready for AI Legal Document Analysis
            </h3>
            <p className="text-xs text-slate-400">
              Select an AI legal analysis workflow below to analyze your document text.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-mono">
            {payload.wordCount.toLocaleString()} words • {payload.pageCount} pages ready
          </span>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleUnderstandDocument}
              disabled={activeAction !== "none"}
              className="inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold px-5 py-3 rounded-xl border border-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-50"
            >
              {activeAction === "understanding" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Understanding document...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Understand This Document</span>
                </>
              )}
            </button>

            <button
              onClick={handleAnalyzeClauses}
              disabled={activeAction !== "none"}
              className="inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold px-5 py-3 rounded-xl border border-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-50"
            >
              {activeAction === "clauses" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Analyzing clauses...</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>Analyze Clauses</span>
                </>
              )}
            </button>

            <button
              onClick={handleGenerateChecklist}
              disabled={activeAction !== "none"}
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold px-6 py-3 rounded-xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-50"
            >
              {activeAction === "checklist" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing next steps...</span>
                </>
              ) : (
                <>
                  <ListTodo className="w-4 h-4" />
                  <span>Your Next Steps</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrepareConsultationBrief}
              disabled={activeAction !== "none"}
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-slate-950 font-extrabold px-6 py-3 rounded-xl shadow-xl shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:opacity-50"
            >
              {activeAction === "consultation" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-950" />
                  <span>Preparing consultation brief...</span>
                </>
              ) : (
                <>
                  <BriefIcon className="w-4 h-4" />
                  <span>Prepare Consultation Brief</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowQAView(true)}
              disabled={activeAction !== "none"}
              className="inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold px-5 py-3 rounded-xl border border-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-50"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Ask Questions (Q&A)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metadata Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 text-center space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Page Count
          </span>
          <span className="text-xl font-bold text-slate-100">{payload.pageCount}</span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 text-center space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Total Words
          </span>
          <span className="text-xl font-bold text-amber-400">
            {payload.wordCount.toLocaleString()}
          </span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 text-center space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Characters
          </span>
          <span className="text-xl font-bold text-indigo-300">
            {payload.characterCount.toLocaleString()}
          </span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 text-center space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Sections / Chunks
          </span>
          <span className="text-xl font-bold text-sky-400">{payload.chunks.length}</span>
        </div>
      </div>

      {/* Detail Tabs */}
      <div className="space-y-4">
        <div className="flex border-b border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors border-b-2 focus-visible:outline-none ${
              activeTab === "overview"
                ? "border-amber-400 text-amber-300 bg-slate-950/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Overview & Status
          </button>
          <button
            onClick={() => setActiveTab("chunks")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors border-b-2 focus-visible:outline-none ${
              activeTab === "chunks"
                ? "border-amber-400 text-amber-300 bg-slate-950/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Structural Chunks ({payload.chunks.length})
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors border-b-2 focus-visible:outline-none ${
              activeTab === "text"
                ? "border-amber-400 text-amber-300 bg-slate-950/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Extracted Text Preview
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 space-y-4 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Pipeline Status — Document Processed & Ready</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              The document text has been extracted, sanitized of formatting noise, and mapped into page-grounded structural chunks. Select an AI action above to begin analysis.
            </p>
          </div>
        )}

        {activeTab === "chunks" && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {payload.chunks.length === 0 ? (
              <p className="text-xs text-slate-400 p-4">No chunks created.</p>
            ) : (
              payload.chunks.map((chunk) => (
                <div
                  key={chunk.id}
                  className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="text-amber-400 font-semibold">{chunk.id}</span>
                    {chunk.pageNumber && (
                      <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
                        Page {chunk.pageNumber}
                      </span>
                    )}
                  </div>
                  {chunk.heading && (
                    <h4 className="font-bold text-slate-200 text-xs">{chunk.heading}</h4>
                  )}
                  <p className="text-slate-300 leading-relaxed font-sans">{chunk.text}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "text" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Normalized Document Text ({payload.characterCount.toLocaleString()} characters)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Text"}</span>
                </button>
                <button
                  onClick={() => setShowFullText(!showFullText)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  {showFullText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showFullText ? "Collapse Text" : "Expand All"}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 max-h-96 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-text">
              {previewText || "No text available."}
            </div>
          </div>
        )}
      </div>

      {/* Security Note & Reset Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Extracted text prepared securely in memory. No third-party transmission without action.</span>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium px-5 py-2.5 rounded-xl text-xs border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Process Another Document</span>
        </button>
      </div>
    </div>
  );
};

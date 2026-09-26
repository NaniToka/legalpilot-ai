"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  Sparkles,
  ArrowLeft,
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";
import { ProcessedDocumentPayload } from "@/types";

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

  const isPdf = payload.fileType === "pdf";

  const handleCopy = () => {
    if (payload.extractedText) {
      navigator.clipboard.writeText(payload.extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
            Overview & Summary
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
              <span>Pipeline Status — Step 4 Ingestion Foundation Complete</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              The document text has been extracted, sanitized of formatting noise, and mapped into page-grounded structural chunks. Original legal terms and clause wording have been 100% preserved without modification or interpretation.
            </p>
            <div className="pt-2 text-xs text-slate-400 font-mono space-y-1">
              <p>• Document ID: {payload.documentId}</p>
              <p>• Ingestion Date: {new Date(payload.processedAt).toLocaleString()}</p>
            </div>
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
                  <div className="text-[10px] font-mono text-slate-500 pt-1">
                    {chunk.wordCount} words • {chunk.charCount} chars
                  </div>
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
          <span>Extracted text prepared securely in memory. No third-party transmission.</span>
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

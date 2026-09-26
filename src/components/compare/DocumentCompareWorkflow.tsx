"use client";

import React, { useState } from "react";
import {
  GitCompare,
  Upload,
  FileCheck2,
  AlertTriangle,
  Loader2,
  Trash2,
  ArrowRight,
  FileText,
  RotateCcw,
} from "lucide-react";
import { ProcessedDocumentPayload, StructuredDocumentComparisonResult } from "@/types";
import { compareLegalDocuments } from "@/services/comparison/documentComparisonService";
import { DocumentComparisonView } from "./DocumentComparisonView";

export const DocumentCompareWorkflow: React.FC = () => {
  const [fileA, setFileA] = useState<File | null>(null);
  const [payloadA, setPayloadA] = useState<ProcessedDocumentPayload | null>(null);
  const [isProcessingA, setIsProcessingA] = useState(false);
  const [errorA, setErrorA] = useState<string | null>(null);

  const [fileB, setFileB] = useState<File | null>(null);
  const [payloadB, setPayloadB] = useState<ProcessedDocumentPayload | null>(null);
  const [isProcessingB, setIsProcessingB] = useState(false);
  const [errorB, setErrorB] = useState<string | null>(null);

  const [isComparing, setIsComparing] = useState(false);
  const [compareStepText, setCompareStepText] = useState("Comparing documents...");
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] = useState<StructuredDocumentComparisonResult | null>(null);

  const processFilePayload = async (selectedFile: File): Promise<ProcessedDocumentPayload> => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await fetch("/api/documents/process", {
      method: "POST",
      body: formData,
    });

    const payload: ProcessedDocumentPayload = await res.json();

    if (!res.ok || payload.status === "failed") {
      const errorMsg =
        payload.errors && payload.errors.length > 0
          ? payload.errors[0]
          : "Failed to process document. Please verify document format.";
      throw new Error(errorMsg);
    }

    return payload;
  };

  const handleSelectFile = async (selectedFile: File, docTarget: "A" | "B") => {
    if (docTarget === "A") {
      setFileA(selectedFile);
      setErrorA(null);
      setIsProcessingA(true);
      try {
        const payload = await processFilePayload(selectedFile);
        setPayloadA(payload);
      } catch (err: any) {
        setErrorA(err.message || "Failed to process Original Document.");
      } finally {
        setIsProcessingA(false);
      }
    } else {
      setFileB(selectedFile);
      setErrorB(null);
      setIsProcessingB(true);
      try {
        const payload = await processFilePayload(selectedFile);
        setPayloadB(payload);
      } catch (err: any) {
        setErrorB(err.message || "Failed to process New Document Version.");
      } finally {
        setIsProcessingB(false);
      }
    }
  };

  const handleCompareClick = async () => {
    if (!payloadA || !payloadB || isComparing) return;

    setIsComparing(true);
    setComparisonError(null);

    try {
      setCompareStepText("Comparing document text...");

      const res = await fetch("/api/ai/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "compare",
          documentContext: {
            filename: `${payloadA.filename} vs ${payloadB.filename}`,
            documentText: `${payloadA.extractedText.slice(0, 5000)}\n\n${payloadB.extractedText.slice(0, 5000)}`,
          },
          userInput: `Compare Document A (${payloadA.filename}) and Document B (${payloadB.filename}) and extract key differences.`,
        }),
      });

      setCompareStepText("Analyzing important differences...");

      if (res.ok) {
        const aiRes = await res.json();
        if (aiRes.success && aiRes.data) {
          setComparisonResult(aiRes.data);
          setIsComparing(false);
          return;
        }
      }

      const result = await compareLegalDocuments(payloadA, payloadB);
      setComparisonResult(result);
    } catch (err: any) {
      setComparisonError(
        err.message || "Document comparison failed. Please check your document formats and try again."
      );
    } finally {
      setIsComparing(false);
    }
  };

  const resetAll = () => {
    setFileA(null);
    setPayloadA(null);
    setErrorA(null);
    setFileB(null);
    setPayloadB(null);
    setErrorB(null);
    setComparisonResult(null);
    setComparisonError(null);
  };

  if (comparisonResult) {
    return <DocumentComparisonView comparison={comparisonResult} onReset={resetAll} />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Upload Zone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document A (Original) Zone */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-mono text-xs font-bold text-rose-400 uppercase tracking-wider">
              Document A — Original Version
            </span>
            {payloadA && (
              <button
                onClick={() => {
                  setFileA(null);
                  setPayloadA(null);
                }}
                className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {isProcessingA ? (
            <div className="p-8 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-rose-400 mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Processing Document A...</p>
            </div>
          ) : payloadA ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <FileCheck2 className="w-4 h-4" />
                <span className="truncate text-slate-100">{payloadA.filename}</span>
              </div>
              <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                <span>{payloadA.formattedSize}</span>
                <span>•</span>
                <span>{payloadA.pageCount} pages</span>
                <span>•</span>
                <span>{payloadA.wordCount.toLocaleString()} words</span>
              </div>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-slate-800 hover:border-rose-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/50">
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleSelectFile(e.target.files[0], "A");
                  }
                }}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <span className="font-semibold text-xs text-slate-200 block">Select Original Document</span>
              <span className="text-[11px] text-slate-500 block mt-1">PDF or DOCX format</span>
            </label>
          )}

          {errorA && (
            <p className="text-xs text-rose-400 bg-rose-950/40 p-3 rounded-xl border border-rose-900/50">
              {errorA}
            </p>
          )}
        </div>

        {/* Document B (New Version) Zone */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Document B — New Version
            </span>
            {payloadB && (
              <button
                onClick={() => {
                  setFileB(null);
                  setPayloadB(null);
                }}
                className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {isProcessingB ? (
            <div className="p-8 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Processing Document B...</p>
            </div>
          ) : payloadB ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <FileCheck2 className="w-4 h-4" />
                <span className="truncate text-slate-100">{payloadB.filename}</span>
              </div>
              <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                <span>{payloadB.formattedSize}</span>
                <span>•</span>
                <span>{payloadB.pageCount} pages</span>
                <span>•</span>
                <span>{payloadB.wordCount.toLocaleString()} words</span>
              </div>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/50">
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleSelectFile(e.target.files[0], "B");
                  }
                }}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <span className="font-semibold text-xs text-slate-200 block">Select New Version Document</span>
              <span className="text-[11px] text-slate-500 block mt-1">PDF or DOCX format</span>
            </label>
          )}

          {errorB && (
            <p className="text-xs text-rose-400 bg-rose-950/40 p-3 rounded-xl border border-rose-900/50">
              {errorB}
            </p>
          )}
        </div>
      </div>

      {/* Comparison Action Trigger */}
      {comparisonError && (
        <div className="bg-rose-950/40 border border-rose-900/50 rounded-2xl p-4 flex items-center justify-between text-rose-200 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{comparisonError}</span>
          </div>
          <button
            onClick={handleCompareClick}
            className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-rose-900/60 text-rose-100 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      <div className="text-center pt-2">
        <button
          onClick={handleCompareClick}
          disabled={!payloadA || !payloadB || isComparing}
          className="inline-flex items-center space-x-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-sky-500/20 text-sm transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:opacity-50"
        >
          {isComparing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
              <span>{compareStepText}</span>
            </>
          ) : (
            <>
              <GitCompare className="w-5 h-5 text-slate-950" />
              <span>Compare Documents</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

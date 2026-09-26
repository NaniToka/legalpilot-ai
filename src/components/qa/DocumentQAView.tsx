"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Loader2,
  Bot,
  User,
  ArrowLeft,
  AlertTriangle,
  FileText,
  RotateCcw,
  Scale,
  Sparkles,
  BookmarkCheck,
  CheckCircle2,
  HelpCircle,
  CornerDownRight,
  Trash2,
} from "lucide-react";
import {
  ProcessedDocumentPayload,
  StructuredQAResult,
  QAMessageItem,
  QAConfidenceLevel,
} from "@/types";
import { answerLegalQuestion } from "@/services/ai/qaService";

interface DocumentQAViewProps {
  payload: ProcessedDocumentPayload;
  onReset: () => void;
}

export const DocumentQAView: React.FC<DocumentQAViewProps> = ({ payload, onReset }) => {
  const [questionInput, setQuestionInput] = useState("");
  const [messages, setMessages] = useState<QAMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What are my main obligations under this document?",
    "When can this agreement be terminated?",
    "Are there any automatic renewal requirements?",
    "What financial commitments or payments are specified?",
    "What notice periods are required?",
    "What questions should I ask a lawyer about this agreement?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmitQuestion = async (customQuestion?: string) => {
    const targetQuestion = (customQuestion || questionInput).trim();
    if (!targetQuestion || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Call server endpoint /api/ai/process via service abstraction
      let result: StructuredQAResult;

      const res = await fetch("/api/ai/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "qa",
          documentContext: {
            filename: payload.filename,
            pages: payload.pages,
            chunks: payload.chunks,
            documentText: payload.extractedText,
          },
          userInput: `USER QUESTION: "${targetQuestion}"`,
        }),
      });

      if (res.ok) {
        const aiRes = await res.json();
        if (aiRes.success && aiRes.data) {
          result = aiRes.data;
        } else {
          result = await answerLegalQuestion(payload, targetQuestion, messages);
        }
      } else {
        result = await answerLegalQuestion(payload, targetQuestion, messages);
      }

      const newItem: QAMessageItem = {
        id: `msg_${Date.now()}`,
        question: targetQuestion,
        result,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, newItem]);
      setQuestionInput("");
    } catch (err: any) {
      setErrorMessage(
        err.message || "Unable to complete Q&A lookup. Please check API configuration and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitQuestion();
    }
  };

  const getConfidenceBadge = (confidence: QAConfidenceLevel) => {
    switch (confidence) {
      case "Strongly supported by document":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      case "Partially supported by document":
        return "bg-amber-500/10 border-amber-500/30 text-amber-300";
      case "Insufficient document evidence":
        return "bg-rose-500/10 border-rose-500/30 text-rose-400";
      default:
        return "bg-slate-800 border-slate-700 text-slate-300";
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      {/* Top Banner & Context Info */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Ask LegalPilot — Evidence-Grounded Legal Q&A</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight break-all">
              {payload.filename}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              {payload.wordCount.toLocaleString()} words • {payload.pageCount} pages loaded
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="inline-flex items-center space-x-1.5 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                title="Clear conversation history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              onClick={onReset}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium px-4 py-2 rounded-xl border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Document</span>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-100">
            Ask questions about your uploaded document
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Answers are generated strictly using the extracted text of your uploaded file with supporting source references.
          </p>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="space-y-6">
        {messages.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-8 sm:p-10 space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <Bot className="w-7 h-7" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="font-extrabold text-slate-100 text-lg">
                What would you like to know about this agreement?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click a suggested question below or type your own question into the box to receive an evidence-grounded answer.
              </p>
            </div>

            {/* Suggested Questions Grid */}
            <div className="pt-2 text-left space-y-3">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block text-center">
                Suggested Questions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubmitQuestion(q)}
                    disabled={isLoading}
                    className="p-3.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl text-xs text-slate-300 text-left transition-all hover:scale-[1.01] flex items-start space-x-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-50"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:text-amber-300" />
                    <span className="leading-snug">{q}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((item) => (
              <div key={item.id} className="space-y-4 animate-fade-in">
                {/* User Question Speech Bubble */}
                <div className="flex justify-end">
                  <div className="bg-slate-800 border border-slate-700/80 text-slate-100 rounded-3xl rounded-tr-sm p-4 sm:p-5 max-w-2xl space-y-1.5 shadow-lg">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono gap-4">
                      <span className="font-bold text-amber-400 uppercase tracking-wider">You</span>
                      <span>{item.timestamp}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-100">{item.question}</p>
                  </div>
                </div>

                {/* LegalPilot Answer Card */}
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl rounded-tl-sm p-6 sm:p-8 max-w-3xl space-y-5 shadow-2xl w-full">
                    {/* Answer Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                          <Bot className="w-4 h-4" />
                        </div>
                        <span className="font-extrabold text-slate-100 text-sm">LegalPilot AI</span>
                      </div>

                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${getConfidenceBadge(item.result.confidence)}`}>
                          {item.result.confidence}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-slate-950 border border-slate-800 text-slate-400 uppercase">
                          {item.result.answerType.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Main Answer Content */}
                    <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {item.result.answer}
                    </div>

                    {/* Sources Section */}
                    {item.result.sources.length > 0 && (
                      <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-2 text-xs">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                          Document Source Evidence ({item.result.sources.length})
                        </span>
                        <div className="space-y-2">
                          {item.result.sources.map((src, sIdx) => (
                            <div key={sIdx} className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 space-y-1">
                              <div className="flex items-center space-x-2 font-mono text-[11px] text-amber-400 font-semibold">
                                {src.pageNumber && <span>Page {src.pageNumber}</span>}
                                {src.sectionHeader && <span>• Section: {src.sectionHeader}</span>}
                              </div>
                              {src.excerpt && (
                                <p className="text-slate-300 font-mono text-[11px] italic border-l-2 border-amber-500/40 pl-2 mt-1">
                                  "{src.excerpt}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Limitations or Scope Warning */}
                    {item.result.limitations.length > 0 && (
                      <div className="bg-slate-950/60 border border-amber-500/20 rounded-xl p-3.5 text-xs text-amber-300/90 space-y-1">
                        <span className="font-mono text-[10px] uppercase font-bold text-amber-400 block">
                          Context Notice
                        </span>
                        {item.result.limitations.map((lim, lIdx) => (
                          <p key={lIdx}>{lim}</p>
                        ))}
                      </div>
                    )}

                    {/* Suggested Follow-Ups */}
                    {item.result.suggestedFollowUps.length > 0 && (
                      <div className="pt-2 space-y-2 border-t border-slate-800/80">
                        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                          Suggested Follow-up Questions
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {item.result.suggestedFollowUps.map((fu, fIdx) => (
                            <button
                              key={fIdx}
                              onClick={() => handleSubmitQuestion(fu)}
                              disabled={isLoading}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-50"
                            >
                              <CornerDownRight className="w-3 h-3 text-amber-400" />
                              <span>{fu}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="bg-rose-950/40 border border-rose-900/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-200 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onReset}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Document</span>
            </button>
            <button
              onClick={() => handleSubmitQuestion()}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-100 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* Question Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3 shadow-2xl">
        <div className="relative">
          <textarea
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask LegalPilot about your document (e.g., What does this agreement say about termination?)"
            disabled={isLoading || payload.wordCount === 0}
            maxLength={500}
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all resize-none disabled:opacity-50"
          />

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
            <span className="font-mono text-[11px]">
              Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Enter</kbd> to ask
            </span>

            <div className="flex items-center space-x-3">
              <span className="font-mono text-[11px] text-slate-500">
                {questionInput.length} / 500
              </span>

              <button
                onClick={() => handleSubmitQuestion()}
                disabled={!questionInput.trim() || isLoading || payload.wordCount === 0}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reviewing your document...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Ask Question</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Legal Disclaimer & Bottom Navigation */}
      <div className="space-y-4">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-start space-x-3 text-slate-400 text-xs">
          <Scale className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            LegalPilot AI provides general informational answers grounded in your document text. It is not a substitute for advice from a qualified legal professional.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onReset}
            className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold px-5 py-2.5 rounded-xl border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Document Overview</span>
          </button>
        </div>
      </div>
    </div>
  );
};

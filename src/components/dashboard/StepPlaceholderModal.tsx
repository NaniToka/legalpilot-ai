"use client";

import React, { useEffect } from "react";
import { X, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface StepPlaceholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export const StepPlaceholderModal: React.FC<StepPlaceholderModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 id="modal-title" className="text-xl font-bold text-slate-100">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 text-slate-400">
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-[11px] uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Step 2 Dashboard Preview</span>
          </div>
          <p className="leading-relaxed">
            The full dashboard UI and navigation shell are complete. Document processing, upload endpoints, and AI models will be integrated in upcoming development steps.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold py-3 px-4 rounded-xl border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <span>Got it, explore Dashboard</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

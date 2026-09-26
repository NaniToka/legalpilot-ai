"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface UploadErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export const UploadErrorAlert: React.FC<UploadErrorAlertProps> = ({ message, onDismiss }) => {
  return (
    <div
      role="alert"
      className="bg-rose-950/40 border border-rose-900/50 rounded-2xl p-4 flex items-start justify-between gap-3 text-rose-200 animate-fade-in"
    >
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-rose-400 uppercase text-[11px] tracking-wider block">
            File Validation Error
          </span>
          <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <button
        onClick={onDismiss}
        className="p-1 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-900/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        aria-label="Dismiss validation error"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, FileCheck2, AlertCircle } from "lucide-react";
import { ALLOWED_EXTENSIONS } from "@/lib/fileValidation";

interface UploadAreaProps {
  onFileSelected: (file: File) => void;
  isProcessing?: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelected, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) setIsDragActive(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      onFileSelected(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      onFileSelected(selectedFile);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.join(",")}
        onChange={handleFileChange}
        className="hidden"
        id="legal-document-upload-input"
        aria-label="Upload legal document file input"
      />

      {/* Main Drag & Drop Box */}
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={0}
        role="button"
        aria-label="Drag and drop your legal document here or click to choose a file"
        aria-disabled={isProcessing}
        className={`relative group overflow-hidden rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
          isDragActive
            ? "border-amber-400 bg-amber-500/10 shadow-2xl shadow-amber-500/10 scale-[1.01]"
            : "border-slate-800 hover:border-amber-500/40 bg-slate-900/60 hover:bg-slate-900/90"
        }`}
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="relative z-10 max-w-md mx-auto space-y-5">
          {/* Upload Icon */}
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border transition-all duration-300 ${
              isDragActive
                ? "bg-amber-400 text-slate-950 border-amber-300 scale-110"
                : "bg-slate-950 border-slate-800 text-amber-400 group-hover:scale-105 group-hover:border-amber-500/30"
            }`}
          >
            <UploadCloud className="w-8 h-8" />
          </div>

          {/* Text Instructions */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
              Drag & drop your document here
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              or <span className="text-amber-400 font-semibold underline underline-offset-4">choose a file</span> from your device
            </p>
          </div>

          {/* Supported Format Pill */}
          <div className="pt-2 flex items-center justify-center space-x-3 text-xs text-slate-400 font-mono">
            <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
              PDF (.pdf)
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
              Word (.docx)
            </span>
            <span className="text-slate-500">| Max 15 MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

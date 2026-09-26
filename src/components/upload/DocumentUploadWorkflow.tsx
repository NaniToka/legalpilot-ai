"use client";

import React, { useState } from "react";
import { UploadArea } from "./UploadArea";
import { SelectedFileCard } from "./SelectedFileCard";
import { UploadErrorAlert } from "./UploadErrorAlert";
import { ProcessedDocumentCard } from "./ProcessedDocumentCard";
import { validateLegalDocument, formatFileSize } from "@/lib/fileValidation";
import { PreparedDocument, ProcessedDocumentPayload } from "@/types";
import { Loader2 } from "lucide-react";

interface DocumentUploadWorkflowProps {
  onDocumentProcessed?: (payload: ProcessedDocumentPayload) => void;
}

export const DocumentUploadWorkflow: React.FC<DocumentUploadWorkflowProps> = ({
  onDocumentProcessed,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<PreparedDocument | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedPayload, setProcessedPayload] = useState<ProcessedDocumentPayload | null>(null);

  const handleFileSelected = (file: File) => {
    setErrorMessage(null);
    setProcessedPayload(null);

    const validation = validateLegalDocument(file);

    if (!validation.isValid || !validation.fileType) {
      setErrorMessage(validation.error || "Failed to validate selected document.");
      return;
    }

    const preparedDoc: PreparedDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      file,
      filename: file.name,
      fileType: validation.fileType,
      fileSize: file.size,
      formattedSize: formatFileSize(file.size),
      uploadedAt: new Date().toISOString(),
      status: "ready",
    };

    setSelectedDoc(preparedDoc);
  };

  const handleRemove = () => {
    setSelectedDoc(null);
    setErrorMessage(null);
    setProcessedPayload(null);
    setIsProcessing(false);
  };

  const handleAnalyzeAndProcess = async () => {
    if (!selectedDoc) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedDoc.file);

      const res = await fetch("/api/documents/process", {
        method: "POST",
        body: formData,
      });

      const payload: ProcessedDocumentPayload = await res.json();

      if (!res.ok || payload.status === "failed") {
        const errorMsg =
          payload.errors && payload.errors.length > 0
            ? payload.errors[0]
            : "Failed to process document. Please verify the document format.";
        setErrorMessage(errorMsg);
        setIsProcessing(false);
        return;
      }

      setProcessedPayload(payload);
      setIsProcessing(false);

      if (onDocumentProcessed) {
        onDocumentProcessed(payload);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "Network error while connecting to processing service. Please try again."
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Error Alert */}
      {errorMessage && (
        <UploadErrorAlert
          message={errorMessage}
          onDismiss={() => setErrorMessage(null)}
        />
      )}

      {/* Loading Overlay State */}
      {isProcessing && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-10 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-100">Processing Legal Document...</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Extracting text, building page structures, and normalizing legal wording
            </p>
          </div>
        </div>
      )}

      {/* Workflow States */}
      {!selectedDoc && !isProcessing && !processedPayload && (
        <div className="space-y-4">
          <div className="space-y-1 text-center max-w-xl mx-auto mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              Upload your legal document
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Upload a PDF or DOCX file to begin understanding your document.
            </p>
          </div>

          <UploadArea onFileSelected={handleFileSelected} />
        </div>
      )}

      {selectedDoc && !isProcessing && !processedPayload && (
        <SelectedFileCard
          document={selectedDoc}
          onRemove={handleRemove}
          onReplaceClick={handleRemove}
          onContinue={handleAnalyzeAndProcess}
          isPreparing={isProcessing}
        />
      )}

      {processedPayload && !isProcessing && (
        <ProcessedDocumentCard
          payload={processedPayload}
          onReset={handleRemove}
        />
      )}
    </div>
  );
};

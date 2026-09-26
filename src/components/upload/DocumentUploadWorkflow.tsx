"use client";

import React, { useState } from "react";
import { UploadArea } from "./UploadArea";
import { SelectedFileCard } from "./SelectedFileCard";
import { UploadErrorAlert } from "./UploadErrorAlert";
import { DocumentPreparationCard } from "./DocumentPreparationCard";
import { validateLegalDocument, formatFileSize } from "@/lib/fileValidation";
import { PreparedDocument } from "@/types";

interface DocumentUploadWorkflowProps {
  onDocumentPrepared?: (doc: PreparedDocument) => void;
}

export const DocumentUploadWorkflow: React.FC<DocumentUploadWorkflowProps> = ({
  onDocumentPrepared,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<PreparedDocument | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPrepared, setIsPrepared] = useState<boolean>(false);

  const handleFileSelected = (file: File) => {
    setErrorMessage(null);

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
    setIsPrepared(false);
  };

  const handleRemove = () => {
    setSelectedDoc(null);
    setErrorMessage(null);
    setIsPrepared(false);
  };

  const handleContinue = () => {
    if (!selectedDoc) return;
    const updatedDoc: PreparedDocument = {
      ...selectedDoc,
      status: "preparing",
    };
    setSelectedDoc(updatedDoc);
    setIsPrepared(true);

    if (onDocumentPrepared) {
      onDocumentPrepared(updatedDoc);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Error Alert if validation fails */}
      {errorMessage && (
        <UploadErrorAlert
          message={errorMessage}
          onDismiss={() => setErrorMessage(null)}
        />
      )}

      {/* Conditional Workflow States */}
      {!selectedDoc && (
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

      {selectedDoc && !isPrepared && (
        <SelectedFileCard
          document={selectedDoc}
          onRemove={handleRemove}
          onReplaceClick={handleRemove}
          onContinue={handleContinue}
        />
      )}

      {selectedDoc && isPrepared && (
        <DocumentPreparationCard
          document={selectedDoc}
          onReset={handleRemove}
        />
      )}
    </div>
  );
};

import React from "react";
import Link from "next/link";
import { FileText, Upload, ArrowLeft, Clock } from "lucide-react";

export const metadata = {
  title: "Documents | LegalPilot AI",
  description: "Manage and view your uploaded legal documents in LegalPilot AI.",
};

export default function DocumentsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Document Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            My Documents
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            View, organize, and inspect your analyzed legal files
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Empty State / Step 3 Placeholder Card */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
          <Clock className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-slate-100">
            No Uploaded Documents Yet
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Document storage and text extraction capabilities will be enabled in **Step 3**. You will be able to upload PDF, DOCX, and TXT files here.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-500/10 hover:from-amber-400 hover:to-amber-500 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

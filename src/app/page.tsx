"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { QuickActionCards } from "@/components/dashboard/QuickActionCards";
import { HowItWorksSection } from "@/components/dashboard/HowItWorksSection";
import { TrustPrivacySection } from "@/components/dashboard/TrustPrivacySection";
import { UploadModal } from "@/components/upload/UploadModal";
import { StepPlaceholderModal } from "@/components/dashboard/StepPlaceholderModal";
import { DocumentUploadWorkflow } from "@/components/upload/DocumentUploadWorkflow";

export default function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [placeholderState, setPlaceholderState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
  });

  const handleActionClick = (title: string, description: string) => {
    if (
      title.includes("Upload") ||
      title.includes("Simplify") ||
      title.includes("Analyze") ||
      title.includes("Ask")
    ) {
      setIsUploadModalOpen(true);
    } else {
      setPlaceholderState({
        isOpen: true,
        title,
        description,
      });
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero / Welcome Section */}
      <HeroSection onActionClick={handleActionClick} />

      {/* 2. Embedded Upload Section */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <DocumentUploadWorkflow />
      </section>

      {/* 3. Quick Action Cards */}
      <QuickActionCards onCardClick={handleActionClick} />

      {/* 4. How It Works Section */}
      <HowItWorksSection />

      {/* 5. Trust & Privacy Section */}
      <TrustPrivacySection />

      {/* Upload Modal triggered by action buttons */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Placeholder Modal for Compare & Non-Upload Actions */}
      <StepPlaceholderModal
        isOpen={placeholderState.isOpen}
        onClose={() => setPlaceholderState((prev) => ({ ...prev, isOpen: false }))}
        title={placeholderState.title}
        description={placeholderState.description}
      />
    </div>
  );
}

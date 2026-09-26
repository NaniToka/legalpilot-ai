"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { QuickActionCards } from "@/components/dashboard/QuickActionCards";
import { HowItWorksSection } from "@/components/dashboard/HowItWorksSection";
import { TrustPrivacySection } from "@/components/dashboard/TrustPrivacySection";
import { StepPlaceholderModal } from "@/components/dashboard/StepPlaceholderModal";

export default function Home() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
  });

  const handleActionClick = (title: string, description: string) => {
    setModalState({
      isOpen: true,
      title,
      description,
    });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero / Welcome Section */}
      <HeroSection onActionClick={handleActionClick} />

      {/* 2. Quick Action Cards */}
      <QuickActionCards onCardClick={handleActionClick} />

      {/* 3. How It Works Section */}
      <HowItWorksSection />

      {/* 4. Trust & Privacy Section */}
      <TrustPrivacySection />

      {/* Interactive Step 3 Placeholder Modal */}
      <StepPlaceholderModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={modalState.title}
        description={modalState.description}
      />
    </div>
  );
}

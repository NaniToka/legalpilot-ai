"use client";

import React from "react";
import { FileText, ShieldAlert, GitCompare, MessageSquare, ArrowRight } from "lucide-react";

interface QuickActionCardsProps {
  onCardClick: (title: string, description: string) => void;
}

const ACTION_CARDS = [
  {
    id: "simplify",
    title: "Simplify a Document",
    description: "Turn complex legal language into clear, easy-to-understand information.",
    icon: FileText,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    buttonText: "Simplify Document",
  },
  {
    id: "analyze-clauses",
    title: "Analyze Important Clauses",
    description: "Identify key obligations, deadlines, risks, and important provisions.",
    icon: ShieldAlert,
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/10 border-rose-500/20",
    buttonText: "Analyze Clauses",
  },
  {
    id: "compare-docs",
    title: "Compare Documents",
    description: "Compare agreements and understand what changed between versions.",
    icon: GitCompare,
    iconColor: "text-sky-400",
    iconBg: "bg-sky-500/10 border-sky-500/20",
    buttonText: "Compare Agreements",
  },
  {
    id: "ask-document",
    title: "Ask About a Document",
    description: "Ask questions and get answers based on the document you provide.",
    icon: MessageSquare,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    buttonText: "Ask Questions",
  },
];

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({ onCardClick }) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Document Actions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Select a legal workflow to get started
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {ACTION_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onCardClick(card.title, card.description)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onCardClick(card.title, card.description);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${card.title}: ${card.description}`}
              className="group relative bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 transition-all duration-200 hover:bg-slate-900 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <div className="space-y-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl border ${card.iconBg} flex items-center justify-center transition-transform group-hover:scale-105`}
                >
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-100 text-base group-hover:text-amber-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Card Action Link */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-300 group-hover:text-amber-400 transition-colors">
                <span>{card.buttonText}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

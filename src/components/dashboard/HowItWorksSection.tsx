import React from "react";
import { UploadCloud, FileSearch, CheckCircle } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Upload",
    description: "Provide your legal document.",
    detail: "Upload contracts, agreements, or legal notices in PDF, DOCX, or TXT format.",
    icon: UploadCloud,
    accent: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  },
  {
    step: "02",
    title: "Understand",
    description: "LegalPilot AI analyzes the document and explains important information in plain language.",
    detail: "Break down dense legal terms, identify risk areas, and generate clear executive summaries.",
    icon: FileSearch,
    accent: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  {
    step: "03",
    title: "Take the Next Step",
    description: "Use the resulting summary, checklist, or questions to better understand what to discuss with a qualified legal professional.",
    detail: "Prepare for your legal meetings with structured action items and informed questions.",
    icon: CheckCircle,
    accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
          How LegalPilot AI Works
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          A transparent 3-step process to navigate your contracts and agreements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {STEPS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="relative bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                    STEP {item.step}
                  </span>
                  <div className={`w-9 h-9 rounded-xl border ${item.accent} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-slate-100 text-lg">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                    "{item.description}"
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-400 pt-3 border-t border-slate-800/60 leading-relaxed">
                {item.detail}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

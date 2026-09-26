import React from "react";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 text-slate-400 mt-auto">
      {/* Disclaimer Banner */}
      <div className="bg-amber-950/20 border-b border-amber-900/30 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-start space-x-3 text-amber-200/90 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <span className="font-semibold text-amber-400 uppercase text-[11px] tracking-wider block">
              Legal Disclaimer
            </span>
            <p className="leading-relaxed text-amber-200/80">
              LegalPilot AI provides general informational assistance and is not a substitute for advice from a qualified legal professional. AI-generated information may be incomplete or inaccurate. Consult a qualified lawyer for advice about your specific situation.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Links & Credits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-amber-400/80" aria-hidden="true" />
          <span>© {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.</span>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          PromptWars: Virtual Challenge — AI for Legal Assistance & Access
        </div>
      </div>
    </footer>
  );
};

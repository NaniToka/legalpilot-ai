import React from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400 mt-auto">
      {/* Disclaimer Banner */}
      <div className="bg-amber-950/20 border-b border-amber-900/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-start space-x-3 text-amber-200/90 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-400 uppercase text-[11px] tracking-wider block mb-0.5">
              Legal Information Disclaimer
            </span>
            <p className="leading-relaxed text-amber-200/80">
              {APP_CONFIG.disclaimer}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-slate-500" />
          <span>© {new Date().getFullYear()} {APP_CONFIG.name}. Built for PromptWars: Virtual Challenge.</span>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          AI for Legal Assistance & Access
        </div>
      </div>
    </footer>
  );
};

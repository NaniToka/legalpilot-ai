import React from "react";
import { ShieldCheck, Lock, Eye, AlertCircle } from "lucide-react";

export const TrustPrivacySection: React.FC = () => {
  return (
    <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100">
            Trust & Responsible AI Use
          </h2>
          <p className="text-xs text-slate-400">
            Transparent principles guiding how LegalPilot AI handles your documents and information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2 text-slate-200 font-semibold text-xs sm:text-sm">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Secure Handling</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your documents are intended for private analysis and handled with strict access controls.
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2 text-slate-200 font-semibold text-xs sm:text-sm">
            <Eye className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Careful AI Review</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-generated breakdowns provide insights that should be carefully reviewed alongside your original text.
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2 text-slate-200 font-semibold text-xs sm:text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Informational Assistant</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Designed to increase legal comprehension and document clarity for everyday individuals and professionals.
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2 text-slate-200 font-semibold text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Not a Lawyer</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            LegalPilot AI does not provide formal legal representation or replace consultations with licensed attorneys.
          </p>
        </div>
      </div>
    </section>
  );
};

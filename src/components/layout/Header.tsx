import React from "react";
import { Scale, ShieldCheck, Terminal } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-100 tracking-tight">
                {APP_CONFIG.name}
              </span>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                v{APP_CONFIG.version}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI-Powered Legal Information Assistant
            </p>
          </div>
        </div>

        {/* Status / Badge */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-full px-3 py-1.5 text-xs text-slate-300">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-300 hidden md:inline">
              PromptWars: Virtual Challenge
            </span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="text-slate-400 font-mono text-[11px]">Step 1 Foundation Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
};

import React from "react";
import {
  Scale,
  FileText,
  Sparkles,
  ShieldAlert,
  MessageSquare,
  GitCompare,
  CheckSquare,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { APP_CONFIG, PLANNED_FEATURES } from "@/lib/constants";

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-5 h-5 text-amber-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-indigo-400" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-rose-400" />,
  MessageSquare: <MessageSquare className="w-5 h-5 text-emerald-400" />,
  GitCompare: <GitCompare className="w-5 h-5 text-sky-400" />,
  CheckSquare: <CheckSquare className="w-5 h-5 text-purple-400" />,
};

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4 pb-8 max-w-4xl mx-auto">
        {/* Phase Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium text-slate-200">
            Phase 1: Project Foundation & Architecture
          </span>
        </div>

        {/* Hero Title & Tagline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-amber-200 via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              {APP_CONFIG.name}
            </span>
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-amber-400/90 tracking-normal">
            "{APP_CONFIG.tagline}"
          </p>
        </div>

        {/* Subtitle Description */}
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {APP_CONFIG.description}
        </p>

        {/* System Ready Banner */}
        <div className="pt-4 flex items-center justify-center">
          <div className="inline-flex items-center space-x-3 bg-slate-900/80 border border-amber-500/30 rounded-2xl px-5 py-3 text-sm text-slate-300 backdrop-blur-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-left">
              <span className="font-semibold text-slate-200 block text-xs uppercase tracking-wider">
                System Status
              </span>
              <span className="text-xs text-slate-400">
                Core foundation initialized. Ready for Step 2 AI document processing integration.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Architecture Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
            Planned AI Legal Capabilities
          </h2>
          <p className="text-sm text-slate-400">
            Scalable modular architecture designed for end-to-end document breakdown
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANNED_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="group relative bg-slate-900/60 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {ICON_MAP[feature.icon] || <FileText className="w-5 h-5 text-amber-400" />}
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/50">
                    {feature.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-100 text-base mb-1.5 group-hover:text-amber-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center text-xs text-slate-500 font-mono">
                <span>Module Ready</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security & Architecture Highlights */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-bold text-slate-100">
            Architectural Guarantees
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="space-y-2">
            <div className="font-semibold text-slate-200 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Full-Stack Next.js</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              React 19 App Router with serverless API route capabilities for secure document processing.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-slate-200 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Environment Security</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strict secret isolation preventing exposure of AI API keys or confidential credentials.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-slate-200 flex items-center space-x-2">
              <Scale className="w-4 h-4 text-indigo-400" />
              <span>Informational Focus</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed explicitly to provide transparent assistance without substituting for licensed legal advice.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

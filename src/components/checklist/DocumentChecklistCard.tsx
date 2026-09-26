"use client";

import React, { useState } from "react";
import {
  ListTodo,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Scale,
  Calendar,
  Filter,
  FileText,
  RotateCcw,
} from "lucide-react";
import {
  StructuredNextStepsResult,
  ChecklistItem,
  ChecklistCategory,
  ChecklistPriority,
  ChecklistStatus,
} from "@/types";

interface DocumentChecklistCardProps {
  checklist: StructuredNextStepsResult;
  filename: string;
  onReset: () => void;
}

export const DocumentChecklistCard: React.FC<DocumentChecklistCardProps> = ({
  checklist,
  filename,
  onReset,
}) => {
  const [items, setItems] = useState<ChecklistItem[]>(checklist.items);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "TODO" | "COMPLETED" | "HIGH">("ALL");
  const [expandedItemIds, setExpandedItemIds] = useState<Record<string, boolean>>({});

  const toggleItemStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus: ChecklistStatus = item.status === "COMPLETED" ? "TODO" : "COMPLETED";
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
  };

  const toggleItemExpand = (id: string) => {
    setExpandedItemIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = React.useMemo(() => items.filter((i) => i.status === "COMPLETED").length, [items]);
  const remainingCount = items.length - completedCount;

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      if (activeFilter === "TODO") return item.status !== "COMPLETED";
      if (activeFilter === "COMPLETED") return item.status === "COMPLETED";
      if (activeFilter === "HIGH") return item.priority === "HIGH";
      return true;
    });
  }, [items, activeFilter]);

  const getCategoryBadge = (cat: ChecklistCategory) => {
    switch (cat) {
      case "DEADLINE":
        return "bg-amber-500/10 border-amber-500/30 text-amber-300";
      case "OBLIGATION":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      case "PAYMENT":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
      case "TERMINATION":
      case "RENEWAL":
        return "bg-rose-500/10 border-rose-500/30 text-rose-400";
      case "INFORMATION_NEEDED":
        return "bg-sky-500/10 border-sky-500/30 text-sky-300";
      case "PROFESSIONAL_CONSULTATION":
        return "bg-purple-500/10 border-purple-500/30 text-purple-300";
      default:
        return "bg-slate-800 border-slate-700 text-slate-300";
    }
  };

  const getPriorityBadge = (prio: ChecklistPriority) => {
    switch (prio) {
      case "HIGH":
        return "bg-rose-500/10 border-rose-500/30 text-rose-400 font-bold";
      case "MEDIUM":
        return "bg-amber-500/10 border-amber-500/30 text-amber-300 font-medium";
      case "LOW":
      default:
        return "bg-slate-800 border-slate-700 text-slate-400";
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
              <ListTodo className="w-4 h-4" />
              <span>Actionable Next Steps Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight break-all">
              {filename}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Generated at: {new Date(checklist.generatedAt).toLocaleString()}
            </p>
          </div>

          <button
            onClick={onReset}
            className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Analyze Another Document</span>
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-100">
            Your Next Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Actionable checklist generated strictly from explicit document provisions and obligations
          </p>
        </div>

        {/* Progress Bar & Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Total Items</span>
            <span className="text-xl font-bold text-slate-100">{items.length}</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">Remaining</span>
            <span className="text-xl font-bold text-amber-400">{remainingCount}</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Completed</span>
            <span className="text-xl font-bold text-emerald-400">{completedCount}</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
            <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block">High Priority</span>
            <span className="text-xl font-bold text-rose-400">{checklist.highPriorityCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2 flex-wrap">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Filter Items:</span>
        </div>

        <div className="flex border border-slate-800 rounded-xl bg-slate-950/60 p-1 gap-1">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none ${
              activeFilter === "ALL" ? "bg-slate-800 text-amber-300" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setActiveFilter("TODO")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none ${
              activeFilter === "TODO" ? "bg-slate-800 text-amber-300" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            To-Do ({remainingCount})
          </button>
          <button
            onClick={() => setActiveFilter("COMPLETED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none ${
              activeFilter === "COMPLETED" ? "bg-slate-800 text-emerald-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setActiveFilter("HIGH")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none ${
              activeFilter === "HIGH" ? "bg-slate-800 text-rose-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            High Priority ({checklist.highPriorityCount})
          </button>
        </div>
      </div>

      {/* Checklist Items List */}
      <section className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 text-center space-y-2">
            <p className="text-xs text-slate-400">No checklist items match the selected filter.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isCompleted = item.status === "COMPLETED";
            const isExpanded = !!expandedItemIds[item.id];

            return (
              <div
                key={item.id}
                className={`bg-slate-900/90 border transition-all rounded-2xl p-5 space-y-3 text-xs shadow-lg ${
                  isCompleted ? "border-slate-800/60 opacity-75" : "border-slate-800"
                }`}
              >
                {/* Item Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleItemStatus(item.id)}
                      className="mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
                      title={isCompleted ? "Mark as TODO" : "Mark as Completed"}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-amber-400 shrink-0 transition-colors" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] border uppercase ${getCategoryBadge(item.category)}`}>
                          {item.category.replace("_", " ")}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] border uppercase ${getPriorityBadge(item.priority)}`}>
                          {item.priority} Priority
                        </span>
                        {(item.dueDateText || item.dueDate) && (
                          <span className="inline-flex items-center space-x-1 font-mono text-[10px] text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>{item.dueDateText || item.dueDate}</span>
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => toggleItemStatus(item.id)}
                        className={`font-bold text-sm sm:text-base cursor-pointer ${
                          isCompleted ? "text-slate-400 line-through" : "text-slate-100"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed font-sans">{item.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleItemExpand(item.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg bg-slate-950 border border-slate-800 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    title={isExpanded ? "Collapse Details" : "View Supporting Evidence"}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expandable Evidence Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-3 bg-slate-950/70 rounded-xl p-4">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block mb-0.5">
                        Why To Review / Reason:
                      </span>
                      <p className="text-slate-300 leading-relaxed">{item.reason}</p>
                    </div>

                    {item.relatedClause && (
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
                          Related Clause Text:
                        </span>
                        <p className="text-slate-300 font-mono text-[11px] bg-slate-900 border border-slate-800 p-2.5 rounded-lg italic">
                          "{item.relatedClause}"
                        </p>
                      </div>
                    )}

                    {item.sourceReferences && item.sourceReferences.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
                          Source Evidence References:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.sourceReferences.map((src, sIdx) => (
                            <span key={sIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                              {src}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Questions for a Legal Professional Section */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">
              Questions to Discuss With a Legal Professional ({checklist.questionsForProfessional.length})
            </h3>
            <p className="text-xs text-slate-400">Neutral questions based on identified document deadlines, provisions, or missing terms</p>
          </div>
        </div>

        {checklist.questionsForProfessional.length === 0 ? (
          <p className="text-xs text-slate-400">No specific legal consultation questions suggested.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checklist.questionsForProfessional.map((q, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed font-medium">
                • {q}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Legal Safety Disclaimer */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 flex items-start space-x-3 text-slate-400 text-xs">
        <Scale className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          LegalPilot AI provides informational assistance based on the documents you provide. It is not a substitute for advice from a qualified legal professional.
        </p>
      </div>
    </div>
  );
};

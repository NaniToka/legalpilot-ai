"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scale,
  LayoutDashboard,
  FileText,
  GitCompare,
  MessageSquare,
  HelpCircle,
  Menu,
  X,
  User,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Compare", href: "/compare", icon: GitCompare },
  { name: "Ask LegalPilot", href: "/ask", icon: MessageSquare },
  { name: "About / Help", href: "/about", icon: HelpCircle },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <Link
          href="/"
          className="flex items-center space-x-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-1"
          aria-label="LegalPilot AI Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Scale className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base sm:text-lg text-slate-100 tracking-tight group-hover:text-amber-300 transition-colors">
                {APP_CONFIG.name}
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 hidden sm:inline-block">
                Dashboard
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isActive
                    ? "bg-slate-800/90 text-amber-300 border border-amber-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/80"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile / User Area (Non-functional UI Shell) */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-full px-3 py-1.5 text-xs text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label="User Profile Menu"
              aria-expanded={profileDropdownOpen}
            >
              <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium text-slate-300 hidden lg:inline">Guest User</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 hidden xl:inline">Demo</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown Shell */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-800 space-y-1">
                  <p className="font-semibold text-slate-200">Guest User (Demo Session)</p>
                  <p className="text-[11px] text-slate-400">LegalPilot AI Workspace</p>
                </div>
                <div className="pt-2 px-3 py-1.5 text-[11px] text-emerald-400/90 font-mono">
                  Local Document Privacy Enabled
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-1" aria-label="Mobile Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-800 text-amber-300 border border-amber-500/30"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};

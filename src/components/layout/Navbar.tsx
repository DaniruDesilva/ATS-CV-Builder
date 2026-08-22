'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  CheckCircle2,
  Crown,
  LayoutDashboard,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Layers,
  FileSearch
} from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cvDropdownOpen, setCvDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base leading-tight tracking-tight text-slate-900 flex items-center gap-1.5">
              ResumAI <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold">PRO</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">ATS CV Builder & AI Analyzer</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          
          {/* CV Tools Dropdown */}
          <div className="relative" onMouseLeave={() => setCvDropdownOpen(false)}>
            <button
              onMouseEnter={() => setCvDropdownOpen(true)}
              onClick={() => setCvDropdownOpen(!cvDropdownOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <span>CV Tools</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${cvDropdownOpen ? 'rotate-180 text-emerald-600' : ''}`} />
            </button>

            {cvDropdownOpen && (
              <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link
                  href="/builder"
                  onClick={() => setCvDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">AI CV Builder</span>
                    <span className="text-[11px] text-slate-500">Helps you land interviews</span>
                  </div>
                </Link>

                <Link
                  href="/checker"
                  onClick={() => setCvDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FileSearch className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">CV Checker</span>
                    <span className="text-[11px] text-slate-500">Is your CV good enough?</span>
                  </div>
                </Link>

                <Link
                  href="/builder?step=6"
                  onClick={() => setCvDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">CV Templates</span>
                    <span className="text-[11px] text-slate-500">100% ATS-Safe Layouts</span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/dashboard"
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              pathname.startsWith('/dashboard') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/pricing"
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              pathname.startsWith('/pricing') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Pricing
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/builder"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 transition-all"
          >
            Build Your CV <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2">
          <Link
            href="/builder"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-slate-50"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" /> AI CV Builder
          </Link>
          <Link
            href="/checker"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-slate-50"
          >
            <FileSearch className="w-4 h-4 text-blue-600" /> CV Checker
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-slate-50"
          >
            <Crown className="w-4 h-4 text-amber-600" /> Pricing
          </Link>

          <div className="pt-2">
            <Link
              href="/builder"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full block text-center py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-md"
            >
              Build Your CV Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

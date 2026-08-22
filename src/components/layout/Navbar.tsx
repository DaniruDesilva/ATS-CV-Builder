'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Layers,
  FileSearch,
  Zap,
  Crown
} from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resumeDropdownOpen, setResumeDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100/90 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
        
        {/* Brand Logo (Enhancv Style) */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            ResumAI
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          
          {/* Resume Dropdown */}
          <div className="relative" onMouseLeave={() => setResumeDropdownOpen(false)}>
            <button
              onMouseEnter={() => setResumeDropdownOpen(true)}
              onClick={() => setResumeDropdownOpen(!resumeDropdownOpen)}
              className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              <span>Resume</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${resumeDropdownOpen ? 'rotate-180 text-emerald-600' : ''}`} />
            </button>

            {resumeDropdownOpen && (
              <div className="absolute top-full left-0 w-64 bg-white border border-slate-200/80 rounded-2xl shadow-xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link
                  href="/builder"
                  onClick={() => setResumeDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0eb075] group-hover:text-white transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">AI Resume Builder</span>
                    <span className="text-[11px] text-slate-500">Create ATS-friendly CVs</span>
                  </div>
                </Link>

                <Link
                  href="/builder?step=6"
                  onClick={() => setResumeDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Resume Templates</span>
                    <span className="text-[11px] text-slate-500">Recruiter-approved styles</span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Tools Dropdown */}
          <div className="relative" onMouseLeave={() => setToolsDropdownOpen(false)}>
            <button
              onMouseEnter={() => setToolsDropdownOpen(true)}
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              <span>Tools</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${toolsDropdownOpen ? 'rotate-180 text-emerald-600' : ''}`} />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full left-0 w-64 bg-white border border-slate-200/80 rounded-2xl shadow-xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link
                  href="/checker"
                  onClick={() => setToolsDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FileSearch className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">ATS Resume Checker</span>
                    <span className="text-[11px] text-slate-500">Scan & score your resume</span>
                  </div>
                </Link>

                <Link
                  href="/builder"
                  onClick={() => setToolsDropdownOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">AI Bullet Optimizer</span>
                    <span className="text-[11px] text-slate-500">Google X-Y-Z formula</span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/dashboard"
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              pathname.startsWith('/dashboard') ? 'text-emerald-700 font-bold' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/pricing"
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              pathname.startsWith('/pricing') ? 'text-emerald-700 font-bold' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Pricing
          </Link>
        </nav>

        {/* Right Actions: Sign In & Get Started Button (Enhancv Style) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg border border-slate-800 text-slate-800 text-sm font-bold hover:bg-slate-50 transition-colors"
          >
            Sign In
          </Link>

          <Link
            href="/builder"
            className="px-5 py-2 rounded-lg bg-[#0eb075] hover:bg-[#0ca068] text-white text-sm font-bold shadow-sm hover:shadow transition-all"
          >
            Get Started
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
            <Sparkles className="w-4 h-4 text-emerald-600" /> AI Resume Builder
          </Link>
          <Link
            href="/checker"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-slate-50"
          >
            <FileSearch className="w-4 h-4 text-blue-600" /> Resume Checker
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-slate-50"
          >
            <Crown className="w-4 h-4 text-amber-600" /> Pricing
          </Link>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-slate-800 text-slate-800 font-bold text-sm"
            >
              Sign In
            </Link>
            <Link
              href="/builder"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full block text-center py-2.5 rounded-lg bg-[#0eb075] hover:bg-[#0ca068] text-white font-bold text-sm shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

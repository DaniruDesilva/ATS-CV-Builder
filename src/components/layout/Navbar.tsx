'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Layers,
  FileSearch,
  Zap,
  Crown,
  User,
  LogOut,
  LayoutDashboard,
  FileText,
  Target,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, initAuth } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resumeDropdownOpen, setResumeDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toolsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    initAuth();
  }, [initAuth]);

  // Smooth hover handlers with small grace delay to prevent flicker/disappearing gap
  const handleResumeEnter = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    setResumeDropdownOpen(true);
  };
  const handleResumeLeave = () => {
    resumeTimeoutRef.current = setTimeout(() => {
      setResumeDropdownOpen(false);
    }, 120);
  };

  const handleToolsEnter = () => {
    if (toolsTimeoutRef.current) clearTimeout(toolsTimeoutRef.current);
    setToolsDropdownOpen(true);
  };
  const handleToolsLeave = () => {
    toolsTimeoutRef.current = setTimeout(() => {
      setToolsDropdownOpen(false);
    }, 120);
  };

  const handleUserEnter = () => {
    if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
    setUserDropdownOpen(true);
  };
  const handleUserLeave = () => {
    userTimeoutRef.current = setTimeout(() => {
      setUserDropdownOpen(false);
    }, 120);
  };

  const handleSignOut = async () => {
    await logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  // User initials helper
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isUserLoggedIn = mounted && isAuthenticated;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100/90 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
        
        {/* Brand Logo */}
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
          
          {/* Dashboard link - ONLY visible when user is signed in */}
          {isUserLoggedIn && (
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname.startsWith('/dashboard')
                  ? 'text-emerald-700 bg-emerald-50/80 font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>Dashboard</span>
            </Link>
          )}

          {/* ── RESUME DROPDOWN ── */}
          <div
            className="relative"
            onMouseEnter={handleResumeEnter}
            onMouseLeave={handleResumeLeave}
          >
            <button
              type="button"
              onClick={() => setResumeDropdownOpen(!resumeDropdownOpen)}
              className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname.startsWith('/builder') || pathname.startsWith('/templates')
                  ? 'text-emerald-700 bg-emerald-50/80 font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Resume</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  resumeDropdownOpen ? 'rotate-180 text-emerald-600' : ''
                }`}
              />
            </button>

            {resumeDropdownOpen && (
              <div className="absolute top-full left-0 pt-2 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl p-2 space-y-1">
                  
                  {/* Item 1: Builder */}
                  <Link
                    href="/builder"
                    onClick={() => setResumeDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700 transition-colors">
                        AI ATS Resume Builder
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Create &amp; edit ATS-compliant CVs
                      </span>
                    </div>
                  </Link>

                  {/* Item 2: Dedicated Templates Showcase */}
                  <Link
                    href="/templates"
                    onClick={() => setResumeDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block group-hover:text-indigo-700 transition-colors">
                        ATS Resume Templates
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Browse 4 certified single-column styles
                      </span>
                    </div>
                  </Link>

                </div>
              </div>
            )}
          </div>

          {/* ── TOOLS DROPDOWN ── */}
          <div
            className="relative"
            onMouseEnter={handleToolsEnter}
            onMouseLeave={handleToolsLeave}
          >
            <button
              type="button"
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname.startsWith('/checker') || pathname.startsWith('/bullet-optimizer')
                  ? 'text-emerald-700 bg-emerald-50/80 font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Tools</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  toolsDropdownOpen ? 'rotate-180 text-emerald-600' : ''
                }`}
              />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full left-0 pt-2 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl p-2 space-y-1">
                  
                  {/* Item 1: ATS Resume Checker */}
                  <Link
                    href="/checker"
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <FileSearch className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700 transition-colors">
                        ATS Resume Checker
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Scan &amp; score your PDF/DOCX (0–100)
                      </span>
                    </div>
                  </Link>

                  {/* Item 2: Dedicated ATS Bullet Optimizer Tool */}
                  <Link
                    href="/bullet-optimizer"
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block group-hover:text-amber-700 transition-colors">
                        ATS Bullet Optimizer
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Google X-Y-Z achievement rewriter
                      </span>
                    </div>
                  </Link>

                  {/* Item 3: Job Keyword Gap Matcher */}
                  <Link
                    href="/checker"
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-700 transition-colors">
                        Job Keyword Gap Matcher
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Target job description scanner
                      </span>
                    </div>
                  </Link>

                </div>
              </div>
            )}
          </div>

          <Link
            href="/pricing"
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              pathname.startsWith('/pricing')
                ? 'text-emerald-700 bg-emerald-50/80 font-bold'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Pricing
          </Link>
        </nav>

        {/* Right Actions: Authenticated Profile vs Guest Sign In */}
        <div className="hidden md:flex items-center gap-3">
          {isUserLoggedIn ? (
            /* Logged-In User Profile Menu */
            <div
              className="relative"
              onMouseEnter={handleUserEnter}
              onMouseLeave={handleUserLeave}
            >
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/40 transition-all shadow-2xs group"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || 'User avatar'}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-300 shadow-2xs"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
                    {getInitials(user?.name)}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-800 max-w-[120px] truncate">
                  {user?.name || 'Account'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform ${
                    userDropdownOpen ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute top-full right-0 pt-2 w-56 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {user?.plan === 'lifetime'
                          ? 'Lifetime Pass'
                          : user?.plan === 'pro_monthly' || user?.plan === 'pro'
                          ? 'Pro Monthly'
                          : 'Free Tier'}
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" /> My Dashboard
                    </Link>

                    <Link
                      href="/builder"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" /> Resume Builder
                    </Link>

                    <Link
                      href="/templates"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5 text-indigo-600" /> ATS Templates
                    </Link>

                    <Link
                      href="/checker"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                    >
                      <FileSearch className="w-3.5 h-3.5 text-emerald-600" /> ATS Checker
                    </Link>

                    <Link
                      href="/bullet-optimizer"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-600" /> Bullet Optimizer
                    </Link>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated / Guest State: Sign In & Get Started */
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-2xs hover:shadow transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in fade-in duration-150">
          {isUserLoggedIn && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-emerald-50 text-emerald-800"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" /> Dashboard
            </Link>
          )}

          <Link
            href="/builder"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-slate-50"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" /> AI ATS Resume Builder
          </Link>

          <Link
            href="/templates"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-slate-50"
          >
            <Layers className="w-4 h-4 text-indigo-600" /> ATS Resume Templates
          </Link>

          <Link
            href="/checker"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-slate-50"
          >
            <FileSearch className="w-4 h-4 text-emerald-600" /> ATS Resume Checker
          </Link>

          <Link
            href="/bullet-optimizer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-slate-50"
          >
            <Zap className="w-4 h-4 text-amber-600" /> ATS Bullet Optimizer
          </Link>

          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-slate-50"
          >
            <Crown className="w-4 h-4 text-amber-600" /> Pricing
          </Link>

          <div className="pt-2 flex flex-col gap-2 border-t border-slate-100">
            {isUserLoggedIn ? (
              <>
                <div className="px-4 py-2 bg-slate-50 rounded-xl">
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full text-center py-2.5 rounded-xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold text-xs"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block text-center py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-2xs"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
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
  FileText
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resumeDropdownOpen, setResumeDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    logout();
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
          
          {/* Dashboard link - ONLY visible when user is signed in! */}
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

          {/* Resume Dropdown */}
          <div className="relative" onMouseLeave={() => setResumeDropdownOpen(false)}>
            <button
              onMouseEnter={() => setResumeDropdownOpen(true)}
              onClick={() => setResumeDropdownOpen(!resumeDropdownOpen)}
              className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
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
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-[#0eb075] group-hover:text-white transition-colors">
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
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
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
              className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
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
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
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
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
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
            <div className="relative" onMouseLeave={() => setUserDropdownOpen(false)}>
              <button
                type="button"
                onMouseEnter={() => setUserDropdownOpen(true)}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/40 transition-all shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
                  {getInitials(user?.name)}
                </div>
                <span className="text-xs font-bold text-slate-800 max-w-[120px] truncate">
                  {user?.name || 'Account'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform ${userDropdownOpen ? 'rotate-180 text-emerald-600' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute top-full right-0 w-56 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
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
                    <FileText className="w-3.5 h-3.5 text-blue-600" /> Resume Builder
                  </Link>

                  <Link
                    href="/checker"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                  >
                    <FileSearch className="w-3.5 h-3.5 text-purple-600" /> ATS Checker
                  </Link>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
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
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2">
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

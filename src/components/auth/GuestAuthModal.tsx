'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Zap,
  Target,
  Download,
  Cloud,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Lock,
  X,
  FileCheck2,
} from 'lucide-react';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

export type GuestFeatureType =
  | 'checker'
  | 'bullet'
  | 'keyword'
  | 'builder_save'
  | 'builder_export'
  | 'builder_ai';

interface GuestAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: GuestFeatureType;
  redirectUrl?: string;
}

const FEATURE_CONFIG: Record<
  GuestFeatureType,
  {
    badge: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }
> = {
  checker: {
    badge: '1 Free Scan Completed',
    title: 'Unlock Unlimited ATS Resume Scans',
    description:
      'You have used your 1 free guest scan. Sign in or create a free account to scan unlimited resumes, unlock in-depth AI bullet rewrites, and save your scores.',
    icon: Shield,
    accentColor: 'emerald',
  },
  builder_save: {
    badge: 'Guest Draft • Save to Cloud',
    title: 'Save Your CV to Your Account',
    description:
      'Sign in or create a free account to permanently save your built CV to the cloud and edit it anytime. Your current progress will be preserved automatically!',
    icon: Cloud,
    accentColor: 'emerald',
  },
  builder_export: {
    badge: '1 Free Download Completed',
    title: 'Unlock Unlimited ATS Downloads',
    description:
      'You have downloaded your 1 free guest resume. Sign in or create a free account to download unlimited PDFs, switch between all 4 ATS templates, and sync changes.',
    icon: Download,
    accentColor: 'emerald',
  },
  bullet: {
    badge: '1 Free Bullet Optimization Used',
    title: 'Unlock Unlimited Achievement Rewrites',
    description:
      'You have used your 1 free bullet point optimization. Sign in or create a free account to optimize unlimited bullet points using Google’s X-Y-Z formula.',
    icon: Zap,
    accentColor: 'emerald',
  },
  keyword: {
    badge: '1 Free Job Match Used',
    title: 'Unlock Unlimited Job Keyword Scans',
    description:
      'You have used your 1 free keyword analysis. Sign in or create a free account to compare your resume against unlimited job postings and close skill gaps.',
    icon: Target,
    accentColor: 'purple',
  },
  builder_ai: {
    badge: '1 Free AI Generation Used',
    title: 'Unlock Unlimited AI Enhancements',
    description:
      'Sign in or create a free account to generate unlimited AI summaries, bullet optimizations, and keyword tailoring inside the Resume Builder.',
    icon: Sparkles,
    accentColor: 'emerald',
  },
};

export function GuestAuthModal({
  isOpen,
  onClose,
  feature = 'checker',
  redirectUrl,
}: GuestAuthModalProps) {
  const [mounted, setMounted] = useState(false);
  const [currentPath, setCurrentPath] = useState('/builder');

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setCurrentPath(redirectUrl || window.location.pathname);
    }
  }, [redirectUrl]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const config = FEATURE_CONFIG[feature] || FEATURE_CONFIG.checker;
  const IconComponent = config.icon;
  const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
  const registerUrl = `/register?redirect=${encodeURIComponent(currentPath)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-5 relative overflow-hidden animate-scale-in">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Icon and Badge */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center shadow-2xs shrink-0">
              <IconComponent className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>{config.badge}</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {config.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* Feature Benefits Checklist */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-2 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Cloud Sync:</strong> Save and edit your built CV from any device</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Unlimited ATS Scans:</strong> Score and benchmark multiple resumes</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Instant Access:</strong> Free forever account — no credit card needed</span>
          </div>
        </div>

        {/* Auth CTA Actions */}
        <div className="space-y-3 pt-1">
          {/* 1-Click Google Sign In */}
          <div className="flex justify-center w-full">
            <GoogleAuthButton safeRedirect={currentPath} mode="signin" />
          </div>

          <div className="relative flex items-center justify-center py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Or continue with email
            </span>
          </div>

          {/* Email Sign In & Register Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href={loginUrl}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all text-center"
            >
              <span>Sign In</span>
            </Link>

            <Link
              href={registerUrl}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all text-center"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Privacy & Auto-preserve reassurance */}
        <div className="text-center pt-1 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 inline" />
            <span>Your current resume data will automatically sync upon sign in.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

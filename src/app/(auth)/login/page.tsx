'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      login({ email });
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setLoading(true);
    login({
      email: 'daniru.desilva2023@gmail.com',
      name: 'Daniru De Silva',
    });
    router.push(redirectUrl);
  };

  return (
    <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6 animate-fade-in">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mb-1 shadow-2xs">
          <svg
            className="w-7 h-7 text-emerald-600"
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
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to ResumAI</h1>
        <p className="text-xs text-slate-500">Access your saved ATS resumes, live score analysis, and career tools</p>
      </div>

      {/* Quick Demo Sign-In Button */}
      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 hover:border-emerald-300 text-emerald-800 text-xs font-bold transition-all shadow-2xs hover:shadow flex items-center justify-center gap-2 group"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 group-hover:rotate-12 transition-transform" />
        <span>Quick Demo Sign-In (Daniru De Silva)</span>
        <ArrowRight className="w-3.5 h-3.5 ml-auto text-emerald-600 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px bg-slate-200 flex-1" />
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">or sign in with email</span>
        <div className="h-px bg-slate-200 flex-1" />
      </div>

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="daniru.desilva2023@gmail.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">Password</label>
            <span className="text-[11px] text-emerald-600 font-semibold cursor-pointer hover:underline">
              Forgot?
            </span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-emerald-600 font-bold hover:underline">
          Create an account free
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <Suspense fallback={<div className="text-slate-400 text-xs font-semibold">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

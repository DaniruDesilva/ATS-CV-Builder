'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { loginSchema, sanitizeRedirect } from '@/lib/validation/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const safeRedirect = sanitizeRedirect(searchParams.get('redirect'), '/dashboard');
  const urlError = searchParams.get('error');

  const { signInWithEmail, signInWithGoogle } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState(
    urlError === 'auth-code-error'
      ? 'Authentication callback failed. Please try signing in again.'
      : ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setError('');

    // Strict client-side Zod validation
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    setLoading(true);

    const res = await signInWithEmail(validation.data.email, validation.data.password);
    if (res.error) {
      // User-friendly error mapping
      if (res.error.toLowerCase().includes('invalid login credentials')) {
        setError('Incorrect email or password. Please verify and try again.');
      } else if (res.error.toLowerCase().includes('email not confirmed')) {
        setError('Please check your inbox and verify your email before signing in.');
      } else if (res.error.toLowerCase().includes('too many requests')) {
        setError('Too many failed attempts. Please wait a moment and try again.');
      } else {
        setError(res.error);
      }
      setLoading(false);
    } else {
      router.push(safeRedirect);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    const res = await signInWithGoogle(safeRedirect);
    if (res.error) {
      setError(res.error);
      setGoogleLoading(false);
    }
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

      {/* Google Sign-In Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading || loading}
        className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs hover:shadow flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
      >
        {googleLoading ? (
          <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
        ) : (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px bg-slate-200 flex-1" />
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">or sign in with email</span>
        <div className="h-px bg-slate-200 flex-1" />
      </div>

      {/* Standard Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="you@example.com"
              autoComplete="email"
              className={`w-full bg-slate-50 border rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                formErrors.email
                  ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'
              }`}
            />
          </div>
          {formErrors.email && (
            <p className="mt-1 text-[11px] text-red-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{formErrors.email}</span>
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">Password</label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`w-full bg-slate-50 border rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                formErrors.password
                  ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {formErrors.password && (
            <p className="mt-1 text-[11px] text-red-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{formErrors.password}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center flex items-center justify-center gap-1.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in securely...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
        Don&apos;t have an account?{' '}
        <Link
          href={`/register${safeRedirect !== '/dashboard' ? `?redirect=${encodeURIComponent(safeRedirect)}` : ''}`}
          className="text-emerald-600 font-bold hover:underline"
        >
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

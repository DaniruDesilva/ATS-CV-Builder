'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { loginSchema, sanitizeRedirect } from '@/lib/validation/auth';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const safeRedirect = sanitizeRedirect(searchParams.get('redirect'), '/dashboard');
  const urlError = searchParams.get('error');

  const { isAuthenticated, isLoading, signInWithEmail, signInWithGoogle } = useAuthStore();
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

  // Auto-redirect if user is already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = safeRedirect;
      } else {
        router.push(safeRedirect);
      }
    }
  }, [isAuthenticated, isLoading, safeRedirect, router]);

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
      if (typeof window !== 'undefined') {
        window.location.href = safeRedirect;
      } else {
        router.push(safeRedirect);
      }
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

  if (isAuthenticated) {
    return (
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-4 text-center animate-fade-in">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mb-1">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Signed In Successfully</h2>
        <p className="text-xs text-slate-500">Redirecting to your dashboard...</p>
      </div>
    );
  }

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

      {/* Google Sign-In Button (Direct Popup via Google Identity Services) */}
      <GoogleAuthButton
        mode="signin"
        safeRedirect={safeRedirect}
        onError={(msg) => setError(msg)}
      />

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

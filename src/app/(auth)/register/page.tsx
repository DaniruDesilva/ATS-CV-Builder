'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, User, Lock, Sparkles, CheckCircle2, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { registerSchema, sanitizeRedirect } from '@/lib/validation/auth';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const safeRedirect = sanitizeRedirect(searchParams.get('redirect'), '/dashboard');

  const { isAuthenticated, isLoading, signUpWithEmail, signInWithGoogle } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [error, setError] = useState('');

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

  // Password strength calculator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-amber-400' };
    if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  const pwdStrength = getPasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setError('');

    // Strict client-side validation
    const validation = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const fieldErrors: {
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
      } = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof fieldErrors;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    setLoading(true);

    const res = await signUpWithEmail(
      validation.data.email,
      validation.data.password,
      validation.data.name
    );

    if (res.error) {
      if (res.error.toLowerCase().includes('already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
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

  const handleGoogleSignup = async () => {
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
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Free Account</h1>
        <p className="text-xs text-slate-500">Build 100% ATS-compliant vector PDF resumes with AI assistance</p>
      </div>

      {/* Google Sign-Up Button (Direct Popup via Google Identity Services) */}
      <GoogleAuthButton
        mode="signup"
        safeRedirect={safeRedirect}
        onError={(msg) => setError(msg)}
      />

      <div className="flex items-center gap-3">
        <div className="h-px bg-slate-200 flex-1" />
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">or sign up with email</span>
        <div className="h-px bg-slate-200 flex-1" />
      </div>

      <form onSubmit={handleRegister} noValidate className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Daniru De Silva"
              autoComplete="name"
              className={`w-full bg-slate-50 border rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                formErrors.name
                  ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'
              }`}
            />
          </div>
          {formErrors.name && (
            <p className="mt-1 text-[11px] text-red-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{formErrors.name}</span>
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Work / Professional Email</label>
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

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="Minimum 8 characters with letters & numbers"
              autoComplete="new-password"
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

          {/* Real-time Password Strength Indicator */}
          {password && (
            <div className="mt-1.5 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                <span>Strength</span>
                <span className={pwdStrength.score >= 3 ? 'text-emerald-700 font-bold' : 'text-slate-600'}>
                  {pwdStrength.label}
                </span>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                <div className={`h-full flex-1 transition-all ${password.length >= 8 ? pwdStrength.color : 'bg-slate-200'}`} />
                <div className={`h-full flex-1 transition-all ${/[A-Z]/.test(password) && /[0-9]/.test(password) ? pwdStrength.color : 'bg-slate-200'}`} />
                <div className={`h-full flex-1 transition-all ${pwdStrength.score >= 4 ? pwdStrength.color : 'bg-slate-200'}`} />
              </div>
            </div>
          )}

          {formErrors.password && (
            <p className="mt-1 text-[11px] text-red-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{formErrors.password}</span>
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (formErrors.confirmPassword) setFormErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              className={`w-full bg-slate-50 border rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                formErrors.confirmPassword
                  ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
              tabIndex={-1}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {formErrors.confirmPassword && (
            <p className="mt-1 text-[11px] text-red-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{formErrors.confirmPassword}</span>
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
              <span>Setting up your workspace...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Started Free</span>
            </>
          )}
        </button>
      </form>

      <div className="space-y-2 pt-2">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>5 Free AI Credits included • No credit card required</span>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
        Already have an account?{' '}
        <Link
          href={`/login${safeRedirect !== '/dashboard' ? `?redirect=${encodeURIComponent(safeRedirect)}` : ''}`}
          className="text-emerald-600 font-bold hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <Suspense fallback={<div className="text-slate-400 text-xs font-semibold">Loading registration...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}

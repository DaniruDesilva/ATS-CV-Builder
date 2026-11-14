'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Check,
  Crown,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
  X,
  CreditCard,
  Lock,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  Layers,
  FileText,
  Star,
} from 'lucide-react';
import { useAuthStore, PlanTier } from '@/lib/store/useAuthStore';

interface PlanPricing {
  id: 'free' | 'pro_monthly' | 'lifetime';
  name: string;
  tagline: string;
  price: string;
  period: string;
  badge?: string;
  badgeColor?: string;
  aiCreditsText: string;
  aiCreditsBadge: string;
  description: string;
  featuresTitle: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
}

const plans: PlanPricing[] = [
  {
    id: 'free',
    name: 'Free Starter',
    tagline: 'Essential ATS resume drafting',
    price: '$0',
    period: 'forever',
    aiCreditsText: '5 AI Trial Credits',
    aiCreditsBadge: 'One-Time Trial',
    description: 'Perfect for drafting an ATS-compliant single-column resume and testing our scoring engine.',
    featuresTitle: "WHAT'S INCLUDED:",
    features: [
      '1 ATS Single-Column Vector PDF Export',
      '5 AI Bullet Rewriting & Summary Credits',
      'Classic ATS Template (Workday Certified)',
      'Real-Time Live Document & A4 Scale Preview',
      'Browser Cloud Auto-Save Drafts',
      'Deterministic ATS Header & Formatting Audit',
      'Full Job Description Comparison Scan',
      'Standard Community Support',
    ],
    ctaText: 'Get Started Free',
    popular: false,
  },
  {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    tagline: 'For active job seekers',
    price: '$9',
    period: '/ month',
    badge: '🔥 Most Popular',
    badgeColor: 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/25',
    aiCreditsText: '150 AI Credits / Month',
    aiCreditsBadge: 'Refreshes Monthly',
    description: 'Everything you need to optimize multiple job applications and beat enterprise ATS filters.',
    featuresTitle: 'EVERYTHING IN FREE, PLUS:',
    features: [
      'Unlimited ATS-Friendly PDF & JSON Exports',
      '150 AI Bullet Rewriting Credits / Month',
      'Unlimited Real-Time ATS Compatibility Audits',
      'Google X-Y-Z Achievement Bullet Optimizer',
      'Target Job Description Keyword Gap Matcher',
      'All 4 ATS Templates (Classic, Traditional, Tech, Executive)',
      'Priority Cloud Document Rendering',
      'Cancel Anytime in 1-Click with Zero Fees',
    ],
    ctaText: 'Upgrade to Pro Monthly',
    popular: true,
  },
  {
    id: 'lifetime',
    name: 'Lifetime Access',
    tagline: 'Permanent access, zero subscriptions',
    price: '$29',
    period: 'one-time payment',
    badge: '⚡ Best Value • Save 70%',
    badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black shadow-md shadow-amber-500/25',
    aiCreditsText: '300 AI Credits Starter Pack',
    aiCreditsBadge: 'Included Upfront',
    description: 'Pay once, use forever. Permanent access to all 4 ATS templates and export engines.',
    featuresTitle: 'EVERYTHING IN PRO FOREVER, PLUS:',
    features: [
      'Permanent Access to All 4 ATS Templates Forever',
      'Unlimited ATS Single-Column PDF Exports Forever',
      'Unlimited Deterministic ATS Scanner Audits Forever',
      '300 AI Credits Starter Pack Included Upfront',
      'Export to PDF, JSON & Plain Text ATS Formats',
      'Zero Monthly or Annual Subscriptions Forever',
      'All Future ATS Template & Formatting Updates Free',
      'Affordable AI Credit Top-Ups Available Anytime',
    ],
    ctaText: 'Get Lifetime Access ($29)',
    popular: false,
  },
];

export default function PricingPage() {
  const [mounted, setMounted] = useState(false);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'lifetime'>('monthly');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<'pro_monthly' | 'lifetime' | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutSuccessPlan, setCheckoutSuccessPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const { user, isAuthenticated, upgradePlan, login } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    if (user?.email) {
      setCheckoutEmail(user.email);
    }
  }, [user]);

  const currentPlanId = user?.plan || 'free';

  const handleOpenCheckout = (planId: 'pro_monthly' | 'lifetime') => {
    setSelectedPlanForCheckout(planId);
  };

  const handleConfirmActivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForCheckout) return;

    setIsProcessingCheckout(true);

    setTimeout(() => {
      // If user is not logged in, auto log them in with email
      if (!isAuthenticated || !user) {
        login({
          email: checkoutEmail || 'candidate@resumai.pro',
          name: checkoutEmail ? checkoutEmail.split('@')[0] : 'Pro Candidate',
          plan: selectedPlanForCheckout,
        });
      } else {
        upgradePlan(selectedPlanForCheckout);
      }

      setIsProcessingCheckout(false);
      setCheckoutSuccessPlan(selectedPlanForCheckout === 'lifetime' ? 'Lifetime Access' : 'Pro Monthly');
      setSelectedPlanForCheckout(null);
    }, 1200);
  };

  const faqs = [
    {
      q: 'Why are AI credits metered instead of unlimited lifetime?',
      a: 'High-speed LLM processing (Google Gemini 1.5 & OpenRouter) incurs real cloud computing costs on every single bullet rewrite and resume scan. Providing a generous starter pack (300 credits on Lifetime, 150/mo on Pro) rather than an unsustainable "free forever" claim ensures lightning-fast response times, top-tier model quality, and a reliable platform that never cuts corners on quality.',
    },
    {
      q: 'Can I cancel my Pro Monthly subscription at any time?',
      a: 'Yes, absolutely. You can cancel with a single click from your User Dashboard or billing receipt. There are zero cancellation fees, and you will retain full Pro access until the end of your prepaid monthly billing cycle.',
    },
    {
      q: 'Is the Lifetime plan really a one-time payment?',
      a: 'Yes! You pay $29 once and receive permanent access to all 4 ATS templates, future template updates, and unlimited single-column PDF exports forever. There are zero recurring monthly or annual fees.',
    },
    {
      q: 'What happens when my AI credits run out on Lifetime?',
      a: 'You can continue creating resumes, using all 4 ATS templates, and exporting unlimited PDFs and deterministic ATS score audits forever without paying anything further. If you need additional AI bullet point rewrites down the line, affordable credit top-up packs are available anytime right from your dashboard.',
    },
    {
      q: 'What is your 7-Day Money-Back Guarantee?',
      a: 'We stand 100% behind our ATS compliance. If ResumAI does not improve your resume formatting, ATS scan score, or confidence in passing screening algorithms within 7 days, simply email support@resumai.pro for a complete, no-questions-asked refund.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-20 w-full animate-fade-in relative">
      
      {/* Ambient background subtle lighting */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* ── HEADER ── */}
      <div className="text-center space-y-4 max-w-3xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Simple, Transparent ATS Pricing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Invest in Your Next <span className="text-emerald-700">Career Breakthrough</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Pass applicant tracking screening bots with confidence. Unlock high-impact Google X-Y-Z bullet rewrites, real-time scoring audits, and verified ATS templates.
        </p>

        {/* Billing Interval Toggle Pill */}
        <div className="pt-4 flex items-center justify-center">
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200/80 shadow-inner">
            <button
              type="button"
              onClick={() => setBillingInterval('monthly')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                billingInterval === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Subscription
            </button>
            <button
              type="button"
              onClick={() => setBillingInterval('lifetime')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                billingInterval === 'lifetime'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Lifetime One-Time Pass</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap">
                Save 70%
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* ── 3 PRICING CARDS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch relative z-10">
        {plans.map((plan) => {
          const isCurrent =
            mounted &&
            (currentPlanId === plan.id ||
              (currentPlanId === 'pro' && plan.id === 'pro_monthly'));
          const isHighlighted =
            (billingInterval === 'monthly' && plan.id === 'pro_monthly') ||
            (billingInterval === 'lifetime' && plan.id === 'lifetime');

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 bg-white border ${
                plan.id === 'pro_monthly'
                  ? 'border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/15 md:-translate-y-2'
                  : isHighlighted
                  ? 'border-2 border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/15 md:-translate-y-2'
                  : 'border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Badge with whitespace-nowrap guaranteed */}
              {plan.badge && (
                <div
                  className={`absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 whitespace-nowrap z-20 ${
                    plan.badgeColor || 'bg-slate-900 text-white'
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6 flex-1 flex flex-col">
                
                {/* Header & Tagline */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {plan.name}
                    </h3>
                    {plan.id === 'lifetime' && (
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Zap className="w-4 h-4 fill-amber-500 text-amber-600" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{plan.tagline}</p>
                </div>

                {/* Price Display */}
                <div className="space-y-1 pb-2 border-b border-slate-100 min-h-[90px] flex flex-col justify-center">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{plan.period}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {plan.description}
                  </p>
                </div>

                {/* Metered AI Credits Pill */}
                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-extrabold text-emerald-950">
                      {plan.aiCreditsText}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase px-2 py-0.5 rounded-full bg-white border border-emerald-200 whitespace-nowrap">
                    {plan.aiCreditsBadge}
                  </span>
                </div>

                {/* Features List with Hierarchical Subhead */}
                <div className="space-y-3 flex-1">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    {plan.featuresTitle}
                  </span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-snug">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Action Button - Aligned across all cards */}
              <div className="pt-8 mt-auto">
                {isCurrent ? (
                  <div className="w-full py-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-xs font-extrabold flex items-center justify-center gap-2 text-center shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Your Active Plan</span>
                  </div>
                ) : plan.id === 'free' ? (
                  <Link
                    href={isAuthenticated ? '/builder' : '/register?redirect=/pricing'}
                    className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold flex items-center justify-center gap-2 text-center transition-colors shadow-2xs"
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenCheckout(plan.id as 'pro_monthly' | 'lifetime')}
                    className={`w-full py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md ${
                      plan.popular
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:scale-102'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20 hover:scale-102'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* ── GUARANTEE & TRUST BAR ── */}
      <div className="max-w-4xl mx-auto rounded-3xl p-5 sm:p-6 bg-slate-50/90 border border-slate-200/90 flex flex-wrap items-center justify-around gap-6 text-xs text-slate-700 text-center shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-slate-900 block leading-tight">7-Day Guarantee</span>
            <span className="text-[11px] text-slate-500">100% money-back refund</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-slate-900 block leading-tight">256-Bit SSL Encrypted</span>
            <span className="text-[11px] text-slate-500">Safe, compliant checkout</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-slate-900 block leading-tight">Cancel Anytime</span>
            <span className="text-[11px] text-slate-500">Zero fees or lock-ins</span>
          </div>
        </div>
      </div>

      {/* ── SIDE-BY-SIDE FEATURE COMPARISON MATRIX ── */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Compare All Features Side-by-Side
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Transparent breakdown of every single capability across our three pricing tiers.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200/90 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="p-4 sm:p-5 font-extrabold text-slate-900 w-2/5">Capability</th>
                <th className="p-4 sm:p-5 font-bold text-slate-700 text-center w-1/5">Free Starter</th>
                <th className="p-4 sm:p-5 font-extrabold text-emerald-800 text-center w-1/5 bg-emerald-50/60">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase mb-1">
                    Popular
                  </span>
                  <div>Pro Monthly ($9)</div>
                </th>
                <th className="p-4 sm:p-5 font-extrabold text-amber-900 text-center w-1/5 bg-amber-50/40">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase mb-1">
                    Best Value
                  </span>
                  <div>Lifetime ($29)</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">
                  Single-Column Vector PDF Exports
                </td>
                <td className="p-4 sm:p-5 text-center text-slate-600">1 Full Export</td>
                <td className="p-4 sm:p-5 text-center font-bold text-emerald-700 bg-emerald-50/20">
                  Unlimited
                </td>
                <td className="p-4 sm:p-5 text-center font-bold text-slate-900 bg-amber-50/10">
                  Unlimited Forever
                </td>
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">
                  AI Bullet Point Rewriter (Google X-Y-Z)
                </td>
                <td className="p-4 sm:p-5 text-center text-slate-600">5 Trial Credits</td>
                <td className="p-4 sm:p-5 text-center font-bold text-emerald-700 bg-emerald-50/20">
                  150 Credits / Mo
                </td>
                <td className="p-4 sm:p-5 text-center font-bold text-slate-900 bg-amber-50/10">
                  300 Credits Included
                </td>
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">
                  ATS Templates Unlocked
                </td>
                <td className="p-4 sm:p-5 text-center text-slate-600">Classic ATS Only</td>
                <td className="p-4 sm:p-5 text-center font-bold text-emerald-700 bg-emerald-50/20">
                  All 4 Layouts
                </td>
                <td className="p-4 sm:p-5 text-center font-bold text-slate-900 bg-amber-50/10">
                  All 4 Layouts + Future
                </td>
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">
                  Real-Time Deterministic ATS Audit
                </td>
                <td className="p-4 sm:p-5 text-center text-slate-600">Basic 1-Page Scan</td>
                <td className="p-4 sm:p-5 text-center font-bold text-emerald-700 bg-emerald-50/20">
                  Unlimited 14-Point Checks
                </td>
                <td className="p-4 sm:p-5 text-center font-bold text-slate-900 bg-amber-50/10">
                  Unlimited Forever
                </td>
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">
                  Target Job Description Keyword Gap Matcher
                </td>
                <td className="p-4 sm:p-5 text-center text-slate-300 font-bold text-base">—</td>
                <td className="p-4 sm:p-5 text-center bg-emerald-50/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                </td>
                <td className="p-4 sm:p-5 text-center bg-amber-50/10">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                </td>
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">
                  Export Formats Supported
                </td>
                <td className="p-4 sm:p-5 text-center text-slate-600">PDF Only</td>
                <td className="p-4 sm:p-5 text-center font-bold text-emerald-700 bg-emerald-50/20">
                  PDF &amp; JSON
                </td>
                <td className="p-4 sm:p-5 text-center font-bold text-slate-900 bg-amber-50/10">
                  PDF, JSON &amp; TXT
                </td>
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">
                  Billing Term
                </td>
                <td className="p-4 sm:p-5 text-center text-slate-600">Free Forever</td>
                <td className="p-4 sm:p-5 text-center font-bold text-emerald-700 bg-emerald-50/20">
                  $9 / month
                </td>
                <td className="p-4 sm:p-5 text-center font-bold text-slate-900 bg-amber-50/10">
                  $29 One-Time Only
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* ── FREQUENTLY ASKED QUESTIONS (FAQ) ── */}
      <div className="max-w-3xl mx-auto space-y-6 pt-4 pb-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything you need to know about our plans, AI credits, and ATS compatibility.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all shadow-2xs ${
                  isOpen
                    ? 'border-emerald-500/80 bg-white ring-2 ring-emerald-500/10'
                    : 'border-slate-200/90 bg-white hover:border-slate-300'
                } p-4 sm:p-5`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4 font-bold text-slate-900 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className={`w-4 h-4 ${isOpen ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-100 animate-in fade-in duration-200 pl-6">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          INTERACTIVE CHECKOUT & PLAN ACTIVATION MODAL
          ═══════════════════════════════════════════════════════════ */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Activate {selectedPlanForCheckout === 'lifetime' ? 'Lifetime Access' : 'Pro Monthly'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Instant Activation • Secure Checkout
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlanForCheckout(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Order Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Plan Selected:</span>
                <span className="text-slate-900 font-extrabold text-sm">
                  {selectedPlanForCheckout === 'lifetime' ? 'Lifetime Access Pass' : 'Pro Monthly Subscription'}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Total Due Today:</span>
                <span className="text-base font-black text-emerald-700">
                  {selectedPlanForCheckout === 'lifetime' ? '$29.00 (One-Time)' : '$9.00 / month'}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 border-t border-slate-200 pt-2">
                <span>AI Credits Allocated:</span>
                <span className="font-extrabold text-slate-900">
                  {selectedPlanForCheckout === 'lifetime' ? '300 Starter Credits' : '150 Credits / month'}
                </span>
              </div>
            </div>

            {/* Payment & Email Form */}
            <form onSubmit={handleConfirmActivation} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Account Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <span className="text-[11px] text-slate-400 block">
                  Your upgraded status and templates will be linked to this email.
                </span>
              </div>

              {/* Payment Method simulation */}
              <div className="p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    Encrypted Sandbox Checkout
                  </span>
                  <span className="text-[10px] text-emerald-700 font-black uppercase px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                    Paddle Sandbox
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <span>Test Card: •••• 4242</span>
                  <span>•</span>
                  <span>Instant Verification</span>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                type="submit"
                disabled={isProcessingCheckout}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessingCheckout ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Activating Account...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      Confirm &amp; Activate{' '}
                      {selectedPlanForCheckout === 'lifetime' ? 'Lifetime ($29)' : 'Pro ($9/mo)'}
                    </span>
                  </>
                )}
              </button>
            </form>

            <p className="text-[11px] text-slate-400 text-center">
              Backed by our 7-Day Money-Back Guarantee. Cancel or request support anytime.
            </p>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SUCCESS CELEBRATION MODAL
          ═══════════════════════════════════════════════════════════ */}
      {checkoutSuccessPlan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">
                🎉 Welcome to {checkoutSuccessPlan}!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your account has been upgraded successfully. All 4 ATS templates and export engines are now unlocked, and your AI credits have been added to your profile.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1 font-semibold text-left">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>What is now active:</span>
              </div>
              <ul className="text-[11px] text-emerald-800 space-y-1 pl-5 list-disc">
                <li>All 4 ATS Templates (Classic, Traditional, Tech, Executive)</li>
                <li>Unlimited Single-Column PDF Exports</li>
                <li>{checkoutSuccessPlan.includes('Lifetime') ? '300 AI Credits Starter Pack' : '150 AI Credits / Month'}</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/builder"
                onClick={() => setCheckoutSuccessPlan(null)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Go to Resume Builder</span>
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setCheckoutSuccessPlan(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                View Dashboard
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
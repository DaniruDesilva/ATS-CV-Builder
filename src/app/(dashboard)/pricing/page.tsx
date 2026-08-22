'use client';

import { Check, Crown, Zap, ShieldCheck } from 'lucide-react';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Free',
      id: 'free',
      price: '$0',
      period: 'forever',
      description: 'Essential tools for drafting ATS resumes and quick scan checks.',
      features: [
        '1 ATS-compliant PDF Export',
        '1 Basic Resume Scan',
        'Classic ATS Template',
        'Live PDF Preview',
        'Auto-Save Drafts'
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'secondary',
      popular: false
    },
    {
      name: 'Pro Monthly',
      id: 'pro_monthly',
      price: '$9',
      period: '/ month',
      description: 'Everything you need to beat ATS filters and land interviews.',
      features: [
        'Unlimited PDF Exports',
        'Unlimited AI Resume Scans',
        'Google X-Y-Z Bullet Rewriter',
        'Keyword Gap Analyzer',
        'All Premium Templates',
        'Priority Support'
      ],
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'primary',
      popular: true
    },
    {
      name: 'Lifetime',
      id: 'lifetime',
      price: '$29',
      period: 'one-time',
      description: 'Permanent access to all current and future features. No subscription.',
      features: [
        'Everything in Pro Forever',
        'Zero Recurring Fees',
        'Lifetime AI Credits',
        'Early Access to Templates',
        'Export to DOCX & JSON',
        'VIP Email Support'
      ],
      buttonText: 'Get Lifetime Access',
      buttonVariant: 'gradient',
      popular: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 w-full animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5" />
          <span>Simple, Transparent Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Invest in Your Next <span className="text-blue-600">Career Move</span>
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Upgrade to unlock unlimited AI analysis, bullet rewrites, and premium ATS templates.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {tiers.map((t) => (
          <div
            key={t.id}
            className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
              t.popular
                ? 'bg-white border-2 border-blue-500 shadow-xl shadow-blue-100 scale-[1.02]'
                : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md'
            }`}
          >
            {t.popular && (
              <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center justify-between">
                  {t.name}
                  {t.id === 'lifetime' && <Zap className="w-5 h-5 text-amber-500" />}
                </h3>
                <p className="text-sm text-slate-500 mt-1 min-h-[40px]">{t.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">{t.price}</span>
                <span className="text-sm text-slate-400 font-medium">{t.period}</span>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  What&apos;s included:
                </span>
                <ul className="space-y-2.5">
                  {t.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              {t.buttonVariant === 'gradient' ? (
                <button className="w-full py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-all">
                  {t.buttonText}
                </button>
              ) : t.buttonVariant === 'primary' ? (
                <button className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all">
                  {t.buttonText}
                </button>
              ) : (
                <button disabled className="w-full py-3 rounded-lg bg-slate-100 text-slate-400 text-sm font-semibold cursor-default">
                  {t.buttonText}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Guarantee Footer */}
      <div className="max-w-2xl mx-auto text-center space-y-2 pt-4">
        <div className="inline-flex items-center gap-1.5 text-sm text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>7-Day Money-Back Guarantee • Cancel Anytime • Powered by Paddle</span>
        </div>
      </div>
    </div>
  );
}

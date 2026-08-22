'use client';

import { Award, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const getScoreColor = () => {
    if (score >= 80) return { stroke: '#10b981', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score >= 60) return { stroke: '#f59e0b', text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { stroke: '#ef4444', text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const colors = getScoreColor();
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getStatusText = () => {
    if (score >= 85) return { title: 'Exceptional Match', icon: CheckCircle2, desc: 'Your resume passes enterprise ATS filters with ease. Great job!' };
    if (score >= 70) return { title: 'Strong Match', icon: Award, desc: 'Solid parseability. Address bullet impact and missing keywords to reach the top tier.' };
    if (score >= 50) return { title: 'Moderate Match', icon: AlertTriangle, desc: 'At risk of rejection by strict ATS filters. Focus on formatting and keyword density.' };
    return { title: 'High Risk', icon: ShieldAlert, desc: 'Major structural gaps detected. Significant improvements needed before submitting.' };
  };

  const status = getStatusText();
  const StatusIcon = status.icon;

  return (
    <div className={`p-8 rounded-2xl bg-white border ${colors.border} flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm relative overflow-hidden`}>
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-64 h-64 ${colors.bg} rounded-full blur-3xl -z-10 opacity-50 transform translate-x-1/3 -translate-y-1/3`} />

      {/* Circle Gauge */}
      <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Inner ring background */}
          <circle cx="80" cy="80" r={radius - 12} className="stroke-slate-100" strokeWidth="4" fill="transparent" />
          
          {/* Main ring background */}
          <circle cx="80" cy="80" r={radius} className="stroke-slate-100" strokeWidth="12" fill="transparent" />
          
          {/* Main ring progress */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={colors.stroke}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="animate-score transition-all duration-1000 ease-out drop-shadow-md"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-black tracking-tighter ${colors.text} drop-shadow-sm`}>
            {score}
          </span>
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 space-y-3 text-center md:text-left">
        <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border} text-xs font-bold shadow-sm`}>
          <StatusIcon className="w-4 h-4" />
          <span>{status.title}</span>
        </div>
        <div className="space-y-1.5">
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">ATS Compatibility Score</h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-xl">{status.desc}</p>
        </div>
      </div>
    </div>
  );
}

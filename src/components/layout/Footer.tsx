'use client';

import Link from 'next/link';
import { FileText, Shield, Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Product */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Resume Tools
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/builder" className="hover:text-emerald-600 transition-colors">
                  AI Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/checker" className="hover:text-emerald-600 transition-colors">
                  ATS Resume Checker
                </Link>
              </li>
              <li>
                <Link href="/builder?step=6" className="hover:text-emerald-600 transition-colors">
                  Resume Templates
                </Link>
              </li>
              <li>
                <Link href="/builder" className="hover:text-emerald-600 transition-colors">
                  Executive CV Maker
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: AI Features */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              AI Features
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/builder" className="hover:text-emerald-600 transition-colors">
                  Google X-Y-Z Rewriter
                </Link>
              </li>
              <li>
                <Link href="/checker" className="hover:text-emerald-600 transition-colors">
                  Real-Time ATS Scoring
                </Link>
              </li>
              <li>
                <Link href="/builder" className="hover:text-emerald-600 transition-colors">
                  Action Verb Suggester
                </Link>
              </li>
              <li>
                <Link href="/builder" className="hover:text-emerald-600 transition-colors">
                  Vector PDF Exporter
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: ATS Compatibility */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              ATS Compliance
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <span className="text-slate-700 font-semibold block">Taleo Optimization</span>
              </li>
              <li>
                <span className="text-slate-700 font-semibold block">Workday Parsing</span>
              </li>
              <li>
                <span className="text-slate-700 font-semibold block">Greenhouse ATS</span>
              </li>
              <li>
                <span className="text-slate-700 font-semibold block">Lever Parse Testing</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Templates */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Templates
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/builder?template=classic-ats" className="hover:text-emerald-600 transition-colors">
                  Classic ATS Template
                </Link>
              </li>
              <li>
                <Link href="/builder?template=modern-executive" className="hover:text-emerald-600 transition-colors">
                  Modern Executive
                </Link>
              </li>
              <li>
                <Link href="/builder?template=technical-clean" className="hover:text-emerald-600 transition-colors">
                  Technical Stack
                </Link>
              </li>
              <li>
                <Link href="/builder?template=compact-minimal" className="hover:text-emerald-600 transition-colors">
                  Compact 1-Page
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Company */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/pricing" className="hover:text-emerald-600 transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-500">Terms of Service</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <span className="font-black text-sm text-slate-900">
              ResumAI <span className="text-[10px] uppercase font-bold text-emerald-600 px-1 py-0.5 rounded bg-emerald-50 border border-emerald-200">PRO</span>
            </span>
          </div>

          <p className="text-slate-500 text-center sm:text-right flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for job seekers worldwide. © {new Date().getFullYear()} ResumAI PRO.
          </p>
        </div>
      </div>
    </footer>
  );
}

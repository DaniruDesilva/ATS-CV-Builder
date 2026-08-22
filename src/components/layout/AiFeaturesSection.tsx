'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Search, Target } from 'lucide-react';

const features = [
  {
    id: 'generate',
    title: 'AI content generation',
    bullets: [
      'Get content suggestions for your target job, grounded in your real experience',
      'Match the tone and language recruiters expect',
      'You control the input, so the output stays focused and relevant'
    ]
  },
  {
    id: 'parse',
    title: 'AI resume parsing',
    bullets: [
      'Upload your old resume or LinkedIn profile',
      'Get instant section parsing, the way a modern AI-based ATS reads it'
    ]
  },
  {
    id: 'skills',
    title: 'AI skills finder',
    bullets: [
      'Uncover the exact hard and soft skills employers look for',
      'Generate as many relevant skills as you need automatically'
    ]
  },
  {
    id: 'tailor',
    title: 'Translate your resume with AI',
    bullets: [
      'Translate your resume instantly with one click',
      'Preserve the original formatting perfectly',
      'Choose from 30+ available languages'
    ]
  }
];

export default function AiFeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-[#000000] via-[#090514] to-[#221644] relative overflow-hidden">
      
      <div className="max-w-[1400px] mx-auto px-4 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[2.75rem] lg:text-[3.5rem] font-bold text-white leading-[1.15] mb-4 tracking-tight">
            Write a stronger resume with the AI assistant
          </h2>
          <p className="text-[17px] text-white/90 font-medium leading-relaxed max-w-2xl mx-auto">
            Chat in plain language or trigger preset actions to write, edit, and improve your resume, right where you're working. Every suggestion stays grounded in your real experience.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 lg:p-10 flex flex-col lg:flex-row gap-10 lg:gap-16 shadow-2xl items-stretch">
          
          {/* LEFT: Feature Accordion */}
          <div className="w-full lg:w-[40%] flex flex-col justify-start">
            <div className="flex flex-col">
              {features.map((feature, index) => {
                const isActive = activeFeature === feature.id;
                return (
                  <div key={feature.id} className="flex flex-col">
                    <button
                      onClick={() => setActiveFeature(feature.id)}
                      className={`text-left py-5 transition-all duration-300 border-b-2 relative ${
                        isActive 
                          ? 'border-[#10b981]' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <h3 className={`text-[19px] font-bold transition-colors ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                        {feature.title}
                      </h3>
                    </button>
                    {isActive && (
                      <div className="pt-6 pb-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <ul className="space-y-4">
                          {feature.bullets.map((bullet, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              </div>
                              <span className="text-[15px] text-slate-600 leading-snug">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="pt-10 mt-auto">
              <button className="group flex items-center gap-1 text-[#5B4BE0] font-bold text-[17px] hover:text-[#4335bd] transition-colors underline underline-offset-4 decoration-2 decoration-[#5B4BE0]/30 hover:decoration-[#5B4BE0]">
                Explore ResumAI
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform ml-1" />
              </button>
            </div>
          </div>

          {/* RIGHT: Dynamic UI Mockups in Gradient Container */}
          <div className="w-full lg:w-[60%] bg-gradient-to-br from-[#4b7de9] to-[#3cc494] rounded-2xl overflow-hidden relative min-h-[500px] flex items-center justify-center p-8 shadow-inner">
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>

            
            {/* Content Mockup 1: Generate */}
            {activeFeature === 'generate' && (
              <div className="w-full max-w-lg relative flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                {/* Background Dark Window */}
                <div className="w-full max-w-[420px] bg-[#232733] rounded-xl shadow-2xl p-6 pb-12 translate-x-[-15px] translate-y-[-20px]">
                  {/* Window Controls */}
                  <div className="flex gap-2 mb-8">
                    <div className="w-3 h-3 rounded-full bg-[#464c59]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#464c59]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#464c59]"></div>
                  </div>
                  {/* Fake Text Lines */}
                  <div className="space-y-4">
                    <div className="h-4 w-11/12 bg-[#2d3242] rounded"></div>
                    <div className="h-4 w-9/12 bg-[#2d3242] rounded"></div>
                    {/* Active highlighted line */}
                    <div className="h-5 w-full bg-[#3b3469] rounded border border-[#5B4BE0]/40 relative">
                       <div className="absolute inset-0 bg-[#5B4BE0]/20 rounded animate-pulse"></div>
                    </div>
                    <div className="h-4 w-10/12 bg-[#2d3242] rounded"></div>
                  </div>
                </div>
                
                {/* Foreground White Popover */}
                <div className="absolute top-[35%] right-[-10px] bg-white rounded-xl p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] w-[340px] animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-[#7562e0]" />
                    <span className="text-[11px] font-bold tracking-widest text-[#7562e0] uppercase">AI Suggestion</span>
                  </div>
                  <p className="text-slate-800 text-[15px] font-medium leading-relaxed mb-6">
                    "Spearheaded a cross-functional team of 15 engineers to rebuild the core architecture, reducing load times by 40%."
                  </p>
                  <div className="flex justify-end items-center gap-4">
                    <button className="text-[#8c94a3] text-[15px] font-semibold hover:text-slate-600 transition-colors">Discard</button>
                    <button className="bg-[#10b981] hover:bg-[#0ea5e9] transition-colors text-white text-[15px] font-bold px-5 py-2 rounded-lg shadow-sm">Approve</button>
                  </div>
                </div>
              </div>
            )}

            {/* Content Mockup 2: Parse */}
            {activeFeature === 'parse' && (
              <div className="w-full max-w-lg relative flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                {/* Background Dark Window (LinkedIn style) */}
                <div className="w-full max-w-[420px] bg-[#232733] rounded-xl shadow-2xl p-6 translate-x-[-15px] translate-y-[-20px] overflow-hidden relative">
                   <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-[#464c59]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#464c59]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#464c59]"></div>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-[#2d3242] border-2 border-[#0077b5]/50 flex items-center justify-center">
                       <span className="text-[#0077b5] font-bold">in</span>
                    </div>
                    <div>
                      <div className="h-3 w-24 bg-[#0077b5]/50 rounded mb-2"></div>
                      <div className="h-2 w-32 bg-[#464c59] rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-3 opacity-50">
                    <div className="h-2 w-full bg-[#2d3242] rounded"></div>
                    <div className="h-2 w-5/6 bg-[#2d3242] rounded"></div>
                    <div className="h-2 w-4/6 bg-[#2d3242] rounded"></div>
                  </div>
                  {/* Scanning overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#5B4BE0]/20 to-transparent animate-[shimmer_2s_infinite] border-b-2 border-[#5B4BE0]/50"></div>
                </div>
                
                {/* Foreground White Popover (Resume Parsed) */}
                <div className="absolute top-[35%] right-[-10px] bg-white rounded-xl p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] w-[320px] animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                    <span className="text-[11px] font-bold tracking-widest text-[#10b981] uppercase">Parsed Successfully</span>
                  </div>
                  <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
                     <div className="h-3 w-32 bg-slate-800 rounded mb-3"></div>
                     <div className="h-2 w-24 bg-slate-400 rounded mb-1"></div>
                     <div className="h-2 w-40 bg-slate-400 rounded mb-4"></div>
                     <div className="space-y-2">
                       <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div><div className="h-2 w-full bg-slate-300 rounded"></div></div>
                       <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div><div className="h-2 w-5/6 bg-slate-300 rounded"></div></div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Mockup 3: Skills */}
            {activeFeature === 'skills' && (
              <div className="w-full max-w-lg relative flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                {/* Background Dark Window */}
                <div className="w-full max-w-[420px] bg-[#232733] rounded-xl shadow-2xl p-6 pb-20 translate-x-[-15px] translate-y-[-20px]">
                  <div className="flex gap-2 mb-8">
                    <div className="w-3 h-3 rounded-full bg-[#464c59]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#464c59]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#464c59]"></div>
                  </div>
                  <div className="h-10 w-full bg-[#2d3242] border border-[#464c59] rounded-lg flex items-center px-4 gap-3 mb-6">
                    <Search className="w-4 h-4 text-[#8c94a3]" />
                    <div className="h-3 w-32 bg-[#464c59] rounded"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-[#2d3242] rounded"></div>
                    <div className="h-2 w-4/6 bg-[#2d3242] rounded"></div>
                  </div>
                </div>
                
                {/* Foreground White Popover */}
                <div className="absolute top-[40%] right-[-10px] bg-white rounded-xl p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] w-[340px] animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-[#5B4BE0]" />
                    <span className="text-[11px] font-bold tracking-widest text-[#5B4BE0] uppercase">Missing Skills Found</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Product Strategy', 'Agile', 'SQL', 'A/B Testing'].map((skill, i) => (
                      <div key={skill} className="px-3 py-1.5 bg-[#eaf0fc] text-[#5B4BE0] text-sm font-bold rounded-lg border border-[#5B4BE0]/20 flex items-center gap-1 cursor-pointer hover:bg-[#5B4BE0] hover:text-white transition-colors">
                        {skill} <span className="text-[12px] ml-1">+</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 bg-[#10b981] hover:bg-[#0ea5e9] transition-colors text-white text-[14px] font-bold py-2.5 rounded-lg shadow-sm">
                    Add All to Resume
                  </button>
                </div>
              </div>
            )}

            {/* Content Mockup 4: Tailor (Translate) */}
            {activeFeature === 'tailor' && (
              <div className="w-full max-w-lg relative flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                 {/* Background Dark Window */}
                 <div className="w-full max-w-[420px] bg-[#232733] rounded-xl shadow-2xl p-6 pb-12 translate-x-[-15px] translate-y-[-20px]">
                  <div className="flex gap-2 mb-8">
                    <div className="w-3 h-3 rounded-full bg-[#464c59]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#464c59]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#464c59]"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-3">
                       <div className="h-3 w-20 bg-[#464c59] rounded mb-4"></div>
                       <div className="h-2 w-full bg-[#2d3242] rounded"></div>
                       <div className="h-2 w-5/6 bg-[#2d3242] rounded"></div>
                     </div>
                     <div className="space-y-3 border-l border-[#2d3242] pl-4">
                       <div className="h-3 w-20 bg-[#5B4BE0]/50 rounded mb-4"></div>
                       <div className="h-2 w-full bg-[#3b3469] rounded"></div>
                       <div className="h-2 w-5/6 bg-[#3b3469] rounded"></div>
                     </div>
                  </div>
                </div>

                 {/* Foreground White Popover */}
                 <div className="absolute top-[40%] right-[-10px] bg-white rounded-xl p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] w-[320px] animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
                   <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                     <span className="text-slate-500 font-bold text-[11px] tracking-widest uppercase">Translation</span>
                     <div className="w-8 h-4 bg-[#10b981]/20 rounded-full flex items-center p-0.5">
                       <div className="w-3 h-3 bg-[#10b981] rounded-full translate-x-4"></div>
                     </div>
                   </div>
                   <div className="flex items-center justify-between mb-6">
                     <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">From</span>
                       <span className="text-slate-800 font-bold text-[15px]">🇺🇸 English</span>
                     </div>
                     <ArrowRight className="w-5 h-5 text-slate-300" />
                     <div className="flex flex-col gap-1 items-end">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">To</span>
                       <span className="text-[#5B4BE0] font-bold text-[15px]">🇸🇪 Swedish</span>
                     </div>
                   </div>
                   <button className="w-full bg-[#10b981] hover:bg-[#0ea5e9] transition-colors text-white font-bold py-2.5 rounded-lg shadow-sm text-[15px]">
                     Apply Translation
                   </button>
                 </div>
              </div>
            )}

          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          0% { stroke-dashoffset: 502; }
          100% { stroke-dashoffset: 40; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </section>
  );
}

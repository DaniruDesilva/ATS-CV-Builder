'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Search,
  Target,
  RotateCcw,
  RotateCw,
  Type,
  LayoutGrid,
  Palette,
  CheckSquare,
  Shield,
  Download,
  Link2,
  Clock,
  MousePointer,
  FileCheck,
  Languages,
  Check
} from 'lucide-react';
import Link from 'next/link';

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
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 leading-[1.15] tracking-tight">
            Write a stronger resume with the AI assistant
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Chat in plain language or trigger preset actions to write, edit, and improve your resume, right where you&apos;re working. Every suggestion stays grounded in your real experience.
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 shadow-sm items-stretch">
          
          {/* LEFT: Accordion Feature Tabs */}
          <div className="w-full lg:w-[38%] flex flex-col justify-between">
            <div className="flex flex-col divide-y divide-slate-200/80">
              {features.map((feature) => {
                const isActive = activeFeature === feature.id;
                return (
                  <div key={feature.id} className="py-4 first:pt-0 last:pb-0">
                    <button
                      onClick={() => setActiveFeature(feature.id)}
                      className="w-full text-left flex items-center justify-between group py-1.5 focus:outline-none"
                    >
                      <span
                        className={`text-lg sm:text-[19px] font-bold tracking-tight transition-colors ${
                          isActive
                            ? 'text-slate-900 pb-1.5 border-b-2 border-[#10b981] inline-block'
                            : 'text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        {feature.title}
                      </span>
                    </button>

                    {isActive && (
                      <div className="pt-5 pb-2 animate-in fade-in slide-in-from-top-1 duration-300">
                        <ul className="space-y-3.5">
                          {feature.bullets.map((bullet, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                              </div>
                              <span className="text-sm sm:text-[15px] text-slate-600 leading-snug font-medium">
                                {bullet}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="pt-8 mt-6">
              <Link
                href="/builder"
                className="group inline-flex items-center gap-1.5 text-[#5B4BE0] font-extrabold text-[15px] hover:text-[#4335bd] transition-colors"
              >
                <span>Explore ResumAI AI</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* RIGHT: High-Fidelity Enhancv-Style Editor Mockup in Gradient Container */}
          <div className="w-full lg:w-[62%] bg-gradient-to-tr from-[#3b52d4] via-[#4d66e8] to-[#10b981] rounded-3xl overflow-hidden relative min-h-[460px] sm:min-h-[500px] flex items-center justify-center p-4 sm:p-8 shadow-inner">
            
            {/* Ambient subtle light circles */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-emerald-300/20 blur-2xl pointer-events-none" />

            {/* TAB 1: AI Content Generation (Exactly matching Enhancv Image 2) */}
            {activeFeature === 'generate' && (
              <div className="w-full max-w-xl relative flex items-center justify-center animate-in fade-in zoom-in-95 duration-400">
                
                {/* Background Editor Window Mockup */}
                <div className="w-full bg-[#F3F6FA] rounded-2xl shadow-2xl border border-white/80 overflow-hidden flex flex-col pb-8">
                  
                  {/* Window Top Navbar */}
                  <div className="bg-white px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-black text-slate-800 tracking-tight">ResumAI Canvas</span>
                    </div>

                    {/* Window Controls / Undo */}
                    <div className="flex items-center gap-3 text-slate-400">
                      <RotateCcw className="w-3.5 h-3.5 hover:text-slate-600 cursor-pointer" />
                      <RotateCw className="w-3.5 h-3.5 hover:text-slate-600 cursor-pointer" />
                    </div>
                  </div>

                  {/* Editor Body: Left Toolbar + Paper Canvas */}
                  <div className="flex items-stretch min-h-[300px]">
                    
                    {/* Left Vertical Tools Icon Bar */}
                    <div className="w-11 bg-white border-r border-slate-200/80 py-4 flex flex-col items-center justify-between text-slate-400 shrink-0">
                      <div className="space-y-3 flex flex-col items-center">
                        <Type className="w-4 h-4 text-slate-600" />
                        <LayoutGrid className="w-4 h-4 hover:text-slate-600" />
                        <Palette className="w-4 h-4 hover:text-slate-600" />
                        <CheckSquare className="w-4 h-4 hover:text-slate-600" />
                        <span className="text-[9px] font-black px-1 rounded bg-emerald-100 text-emerald-700">ATS</span>
                      </div>
                      <div className="space-y-3 flex flex-col items-center">
                        <Download className="w-4 h-4 hover:text-slate-600" />
                        <Link2 className="w-4 h-4 hover:text-slate-600" />
                        <Clock className="w-4 h-4 hover:text-slate-600" />
                      </div>
                    </div>

                    {/* Editor Canvas Area with Background Skeleton Lines */}
                    <div className="flex-1 p-5 relative overflow-hidden bg-white/70">
                      
                      {/* Floating Keyword / Skill Pills */}
                      <div className="absolute top-2 left-6 z-10 animate-bounce duration-1000 shadow-md rounded-full bg-[#dcfce7] border border-[#86efac] text-[#15803d] text-[11px] font-bold px-3 py-1 flex items-center gap-1">
                        <span>+</span> Venture Leads
                      </div>

                      <div className="absolute top-8 right-16 z-10 shadow-md rounded-full bg-[#a7f3d0] border border-[#6ee7b7] text-[#065f46] text-[11px] font-bold px-3 py-1 flex items-center gap-1">
                        <span>+</span> Product
                      </div>

                      <div className="absolute top-18 left-14 z-10 shadow-md rounded-full bg-[#e0e7ff] border border-[#c7d2fe] text-[#4338ca] text-[11px] font-bold px-3 py-1 flex items-center gap-1">
                        <span>+</span> User experience
                      </div>

                      {/* Skeleton Lines under the pills */}
                      <div className="space-y-3 pt-28 opacity-40 max-w-[200px]">
                        <div className="h-2.5 w-full bg-slate-300 rounded"></div>
                        <div className="h-2.5 w-5/6 bg-slate-300 rounded"></div>
                        <div className="h-2.5 w-4/6 bg-slate-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlapping Prominent SUMMARY Paper Card */}
                <div className="absolute top-6 right-[-10px] sm:right-[-16px] w-[300px] sm:w-[360px] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-200/90 p-4 sm:p-5 z-20">
                  
                  {/* Card Title */}
                  <div className="border-b-2 border-slate-900 pb-1 mb-2.5">
                    <span className="text-[13px] font-black text-slate-900 tracking-wider uppercase">
                      SUMMARY
                    </span>
                  </div>

                  {/* Highlighted text block */}
                  <div className="relative">
                    <p className="text-[11px] sm:text-xs text-slate-800 leading-relaxed font-medium">
                      <mark className="bg-[#fed7aa] text-slate-900 rounded px-1 py-0.5">
                        Product-orientated Chief Technology Officer with more than 10 years of deep technical experience developing, implementing and supporting complex infrastructures for fast growing startups in the Talent Acquisition industry. Acted as a strategic advisor for top growing startups and their clients that generated 50% growth in revenue for their business. Scaled one of the most used HR support users in 80+...
                      </mark>
                    </p>

                    {/* Mouse Cursor Hovering */}
                    <div className="absolute -right-2 top-8 text-slate-900 drop-shadow-md">
                      <MousePointer className="w-5 h-5 fill-slate-900 text-white" />
                    </div>
                  </div>
                </div>

                {/* Floating "AI SUGGESTIONS" Popover Card */}
                <div className="absolute bottom-[-16px] left-6 sm:left-12 bg-white rounded-xl p-4 sm:p-4.5 shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-slate-200/90 w-[290px] sm:w-[330px] z-30 animate-in slide-in-from-bottom-2 duration-500">
                  
                  {/* Header */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest text-slate-700 uppercase">
                      AI SUGGESTIONS
                    </span>
                  </div>

                  {/* Body Text */}
                  <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed mb-3">
                    <strong className="text-slate-900 font-extrabold">Replace:</strong> &quot;Product-orientated Chief Technology Officer with more than 10 years of deep technical experience developing....&quot;
                  </p>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs font-bold">
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      Restore
                    </button>
                    <button className="text-emerald-600 hover:text-emerald-700 font-black transition-colors">
                      Approve
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: AI Resume Parsing (Matching Enhancv Image 2) */}
            {activeFeature === 'parse' && (
              <div className="w-full max-w-xl relative flex items-center justify-center animate-in fade-in zoom-in-95 duration-400">
                
                {/* Left Background: LinkedIn Profile Window Mockup */}
                <div className="w-[88%] sm:w-[84%] mr-auto bg-[#EEF5FA] rounded-2xl shadow-2xl border border-white/80 overflow-hidden flex flex-col pb-4">
                  
                  {/* LinkedIn Browser / Top Bar */}
                  <div className="bg-white px-3 sm:px-4 py-2 border-b border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* LinkedIn Logo */}
                      <div className="w-5 h-5 rounded bg-[#0a66c2] text-white flex items-center justify-center font-black text-[11px]">
                        in
                      </div>
                      {/* Search Bar Skeleton */}
                      <div className="hidden sm:flex items-center gap-1.5 bg-[#EEF5FA] rounded-md px-2.5 py-1 text-slate-400 text-[10px] w-28">
                        <Search className="w-3 h-3 text-slate-400" />
                        <span>Search</span>
                      </div>
                    </div>

                    {/* Nav Icons */}
                    <div className="flex items-center gap-2 sm:gap-2.5 text-slate-400 text-[10px]">
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    </div>
                  </div>

                  {/* LinkedIn Profile Card Container */}
                  <div className="p-3 space-y-3">
                    
                    {/* Cover Photo Banner (Scenic Forest Mountain gradient) */}
                    <div className="h-20 sm:h-24 rounded-lg bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-700 relative overflow-hidden shadow-inner flex items-end justify-end p-2">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="w-full h-8 bg-gradient-to-t from-black/40 to-transparent absolute bottom-0 left-0"></div>
                    </div>

                    {/* Profile Header (Avatar + Details) */}
                    <div className="relative pt-1 px-1">
                      
                      {/* Avatar */}
                      <div className="absolute -top-10 left-2 w-14 h-14 rounded-full border-2 border-white bg-slate-100 shadow-md overflow-hidden flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                          alt="Taylor Foster Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Name & Headline skeleton */}
                      <div className="pt-5 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900">Taylor Foster</span>
                          <span className="w-3 h-3 rounded-full bg-[#0a66c2] text-white flex items-center justify-center text-[8px] font-black">in</span>
                        </div>
                        <div className="h-2 w-44 bg-slate-300 rounded"></div>
                        <div className="h-2 w-32 bg-slate-200 rounded"></div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="px-3 py-0.5 rounded-full bg-[#0a66c2] text-white text-[9px] font-bold">
                            Open to work
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full border border-slate-300 text-slate-600 text-[9px] font-semibold">
                            More
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Profile Body Skeleton */}
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <div className="h-2 w-16 bg-[#0a66c2]/80 rounded"></div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                        <div className="h-1.5 w-5/6 bg-slate-200 rounded"></div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Right Overlapping: Complete Formatted Resume Sheet */}
                <div className="absolute top-2 right-[-10px] sm:right-[-16px] w-[290px] sm:w-[340px] bg-white rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-slate-200 p-4 sm:p-4.5 z-20 text-left space-y-2.5">
                  
                  {/* Resume Top Header */}
                  <div className="border-b border-slate-900 pb-1.5 space-y-0.5">
                    <h3 className="text-sm font-black text-slate-900 tracking-tight leading-none uppercase">
                      TAYLOR FOSTER
                    </h3>
                    <p className="text-[10px] font-bold text-slate-600">
                      Certified Project Management Professional
                    </p>
                    <div className="text-[8px] text-slate-400 flex flex-wrap gap-1">
                      <span>Los Angeles, CA</span> • <span>taylor@example.com</span>
                    </div>
                  </div>

                  {/* Resume Grid: Experience & Skills */}
                  <div className="grid grid-cols-12 gap-2 text-[9px]">
                    
                    {/* Left: Summary & Experience */}
                    <div className="col-span-7 space-y-2">
                      <div>
                        <span className="font-black text-slate-800 text-[8px] uppercase tracking-wider block border-b border-slate-200 pb-0.5">
                          Summary
                        </span>
                        <p className="text-[8px] text-slate-600 leading-tight pt-0.5">
                          Results-driven IT Project Leader with 8+ years executing complex digital transformations.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="font-black text-slate-800 text-[8px] uppercase tracking-wider block border-b border-slate-200 pb-0.5">
                          Experience
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 block text-[8.5px]">Senior IT Project Manager</span>
                          <span className="text-[7.5px] text-slate-500 block">Tech Solutions • 2021 — Present</span>
                          <p className="text-[8px] text-slate-600 leading-tight">
                            • Led agile squad of 14 engineers delivering $3.2M enterprise SaaS upgrade.
                          </p>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block text-[8.5px]">Project Manager</span>
                          <span className="text-[7.5px] text-slate-500 block">Innovate Lab • 2018 — 2021</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Technical Skills & Achievements */}
                    <div className="col-span-5 space-y-2 border-l border-slate-100 pl-2">
                      <div>
                        <span className="font-black text-slate-800 text-[8px] uppercase tracking-wider block border-b border-slate-200 pb-0.5">
                          Technical Skills
                        </span>
                        <div className="space-y-0.5 pt-0.5 text-[8px] text-slate-700">
                          <p>• Scrum & Agile</p>
                          <p>• SQL & Tableau</p>
                          <p>• JIRA / Confluence</p>
                          <p>• Python & APIs</p>
                        </div>
                      </div>

                      <div>
                        <span className="font-black text-slate-800 text-[8px] uppercase tracking-wider block border-b border-slate-200 pb-0.5">
                          Achievements
                        </span>
                        <div className="space-y-0.5 pt-0.5 text-[7.5px] text-slate-600">
                          <p className="font-bold text-emerald-700">$450k Cost Savings</p>
                          <p className="font-bold text-blue-700">35% Faster Delivery</p>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Center Action Badge: "Parsing" with Upload / Arrow Icon */}
                <div className="absolute top-[48%] right-[32%] sm:right-[35%] bg-[#0a66c2] text-white text-[11px] font-black px-4 py-2 rounded-full shadow-[0_10px_25px_rgba(10,102,194,0.4)] flex items-center gap-1.5 z-30 animate-pulse border border-white/40">
                  <Download className="w-3.5 h-3.5 rotate-180" />
                  <span>Parsing</span>
                </div>

              </div>
            )}

            {/* TAB 3: AI Skills Finder */}
            {activeFeature === 'skills' && (
              <div className="w-full max-w-xl relative flex items-center justify-center animate-in fade-in zoom-in-95 duration-400">
                <div className="w-full bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
                  
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-800">Target Role Skills Gap</span>
                    </div>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      High Match
                    </span>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Recommended keywords from job description:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['Microservices Architecture', 'System Design', 'Redis Caching', 'CI/CD Pipelines', 'Team Mentorship'].map((skill) => (
                        <div
                          key={skill}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-emerald-100 transition-colors"
                        >
                          <span>+ {skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 4: Translate with AI */}
            {activeFeature === 'tailor' && (
              <div className="w-full max-w-xl relative flex items-center justify-center animate-in fade-in zoom-in-95 duration-400">
                <div className="w-full bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
                  
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Languages className="w-5 h-5 text-teal-600" />
                      <span className="text-xs font-bold text-slate-800">One-Click Resume Translation</span>
                    </div>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                      30+ Languages
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Source</span>
                      <span className="text-sm font-bold text-slate-800">🇺🇸 English (US)</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Target</span>
                      <span className="text-sm font-bold text-emerald-700">🇩🇪 German (Deutsch)</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Maintains exact section formatting, dates, action verbs, and layout geometry seamlessly.
                  </p>

                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}


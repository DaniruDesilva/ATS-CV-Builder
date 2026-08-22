'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown, 
  Star, 
  MessageSquareQuote,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Code,
  Sparkles
} from 'lucide-react';
import { ClassicAtsDom, ModernExecutiveDom, TechnicalCleanDom, TraditionalAtsDom } from '@/components/builder/LivePreview';
import { mockResume1, mockResume2, mockResume3 } from '@/lib/mockResumes';
import AiFeaturesSection from '@/components/layout/AiFeaturesSection';

export default function LandingPage() {
  const templateScrollRef = useRef<HTMLDivElement>(null);
  const [carouselActiveDot, setCarouselActiveDot] = useState(0);
  
  // Hero Section Rotation State
  const [heroIndex, setHeroIndex] = useState(0);
  const [flipState, setFlipState] = useState<'idle' | 'flipping-out' | 'flipping-in'>('idle');

  const templateList = [
    { id: 'traditional-ats-1', templateId: 'traditional-ats', name: 'Traditional ATS', mock: mockResume1, Component: TraditionalAtsDom },
    { id: 'modern-executive-1', templateId: 'modern-executive', name: 'Modern Executive', mock: mockResume2, Component: ModernExecutiveDom },
    { id: 'technical-clean-1', templateId: 'technical-clean', name: 'Technical Clean', mock: mockResume3, Component: TechnicalCleanDom },
    { id: 'classic-ats-1', templateId: 'classic-ats', name: 'Classic ATS', mock: mockResume1, Component: ClassicAtsDom },
    { id: 'traditional-ats-2', templateId: 'traditional-ats', name: 'Traditional ATS (Var)', mock: mockResume3, Component: TraditionalAtsDom },
    { id: 'modern-executive-2', templateId: 'modern-executive', name: 'Modern Executive (Var)', mock: mockResume1, Component: ModernExecutiveDom },
    { id: 'technical-clean-2', templateId: 'technical-clean', name: 'Technical Clean (Var)', mock: mockResume2, Component: TechnicalCleanDom },
    { id: 'classic-ats-2', templateId: 'classic-ats', name: 'Classic ATS (Var)', mock: mockResume3, Component: ClassicAtsDom },
  ];

  const heroTemplates = templateList.slice(0, 4);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Start flipping out
      setFlipState('flipping-out');
      
      setTimeout(() => {
        // 2. Halfway through (500ms), swap the component and instantly snap to the flipping-in starting position
        setHeroIndex((prev) => (prev + 1) % heroTemplates.length);
        setFlipState('flipping-in');
        
        // 3. One frame later, transition back to idle so it animates fully in
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setFlipState('idle');
          });
        });
      }, 500); 

    }, 4500);

    return () => clearInterval(interval);
  }, [heroTemplates.length]);

  const scrollToIndex = (index: number) => {
    if (templateScrollRef.current) {
      const cardWidth = 392; // 360 + 32 gap
      templateScrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setCarouselActiveDot(index);
    }
  };

  const handleScroll = () => {
    if (templateScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = templateScrollRef.current;
      const totalScrollable = scrollWidth - clientWidth;
      if (totalScrollable > 0) {
        const progress = scrollLeft / totalScrollable;
        const dotIndex = Math.min(Math.round(progress * 7), 7);
        setCarouselActiveDot(dotIndex);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans overflow-x-hidden selection:bg-[#5B4BE0]/20 text-slate-800">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 px-4 lg:px-12 overflow-hidden bg-gradient-to-br from-[#dcfcf2] via-[#eaf0fc] to-[#f4f2ff]">
        {/* Subtle decorative elements can go here if needed, but the beautiful gradient acts as the main background */}

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center relative z-10">
          
          {/* Left: Text & CTA */}
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            <h1 className="text-[3.5rem] sm:text-[4rem] lg:text-[4.75rem] leading-[1.02] font-black text-slate-900 tracking-tighter mb-6 text-balance">
              Land more <span className="text-slate-800">interviews with</span><br className="hidden lg:block" />
              ResumAI's <span className="text-[#5B4BE0]">Resume Builder</span>
            </h1>
            
            <p className="text-lg lg:text-[1.35rem] text-slate-500 mb-10 leading-relaxed max-w-[90%] mx-auto lg:mx-0 font-medium">
              Create a beautiful, ATS-friendly resume with the help of features like AI Resume Writer, ATS Check, and One-Click Job Tailoring. It's the best way to make an impression.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-14">
              <Link href="/builder" className="w-full sm:w-auto px-8 py-4 bg-[#10b981] hover:bg-[#0ea5e9] hover:bg-[#0f976a] text-white text-[17px] font-bold rounded-lg shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all text-center">
                Build Your Resume
              </Link>
              <Link href="/builder?mode=ats" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-slate-900 text-slate-900 hover:bg-slate-50 text-[17px] font-bold rounded-lg transition-all text-center hover:-translate-y-0.5">
                Get Your Resume Score
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 lg:gap-8">
              <div className="flex items-center gap-2">
                <div className="flex text-[#10b981] gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-6 h-6 bg-[#10b981] text-white rounded-[3px] flex items-center justify-center shadow-sm">
                       <Star className="w-4 h-4 fill-current" />
                    </div>
                  ))}
                </div>
                <span className="text-slate-800 font-extrabold text-[15px] ml-1">5,321 Reviews</span>
              </div>
              
              <div className="hidden sm:block w-[1.5px] h-10 bg-slate-200"></div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <MessageSquareQuote className="w-5 h-5 text-slate-500" />
                </div>
                <p className="text-slate-500 text-[14px] font-medium leading-snug text-left max-w-[150px]">
                  <strong className="text-slate-900 font-extrabold block">28,452 users</strong> landed interviews last month
                </p>
              </div>
            </div>
          </div>

          {/* Right: Floating Isometric Resume */}
          <div className="relative h-[650px] hidden lg:block perspective-[1200px]">
            <div 
              className={`absolute right-[20px] top-[20px] w-[480px] h-[675px] bg-white rounded-lg shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-200/50 overflow-hidden z-10 transform origin-center 
              ${flipState === 'idle' ? 'transition-all duration-700 ease-out rotate-[-2deg] rotate-x-[4deg] rotate-y-[-12deg] translate-y-0 scale-100 opacity-100 hover:rotate-y-[-8deg] hover:rotate-x-[2deg] hover:-translate-y-2' : ''}
              ${flipState === 'flipping-out' ? 'transition-all duration-500 ease-in rotate-[-1deg] rotate-x-[8deg] rotate-y-[-8deg] translate-y-[-15px] scale-[0.98] opacity-0' : ''}
              ${flipState === 'flipping-in' ? 'transition-none rotate-[-3deg] rotate-x-[0deg] rotate-y-[-16deg] translate-y-[15px] scale-[0.98] opacity-0' : ''}
              `}
              style={{ transformStyle: 'preserve-3d', maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)' }}
            >
              <div className="origin-top-left scale-[0.60] w-[794px] h-[1123px] pointer-events-none bg-white">
                {(() => {
                   const ActiveHeroTemplate = heroTemplates[heroIndex].Component;
                   const activeMock = heroTemplates[heroIndex].mock;
                   return <ActiveHeroTemplate content={activeMock} />;
                })()}
              </div>
            </div>



            {/* Decorative Dot */}
            <div className="absolute right-[-10px] top-[140px] w-4 h-4 rounded-full bg-[#10b981]/30 shadow-sm animate-bounce" style={{ animationDuration: '3s' }}></div>
          </div>
        </div>
      </section>

      {/* CAROUSEL SECTION */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-[2.5rem] font-bold text-slate-900 mb-10">Pick a template and build your resume in minutes!</h2>
          </div>

          <div className="relative -mx-4 lg:mx-0 px-4 lg:px-0">
            <div 
              ref={templateScrollRef}
              onScroll={handleScroll}
              className="flex gap-8 overflow-x-auto pb-16 snap-x snap-mandatory pt-8"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {templateList.map((tpl, i) => (
                <div 
                  key={tpl.id} 
                  className="snap-center shrink-0 w-[320px] sm:w-[360px] h-[450px] sm:h-[510px] relative rounded-xl bg-white border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden group/card cursor-pointer transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2"
                >
                  <div 
                    className="absolute top-0 left-0 origin-top-left pointer-events-none"
                    style={{ 
                      width: '794px', 
                      height: '1123px', 
                      transform: 'scale(0.40)', // Scaled slightly smaller for mobile
                    }}
                  >
                    <div className="sm:hidden">
                       <tpl.Component content={tpl.mock} />
                    </div>
                  </div>
                  <div 
                    className="absolute top-0 left-0 origin-top-left pointer-events-none hidden sm:block"
                    style={{ 
                      width: '794px', 
                      height: '1123px', 
                      transform: 'scale(0.453)',
                    }}
                  >
                    <tpl.Component content={tpl.mock} />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-20 flex flex-col items-center justify-center">
                    <Link href={`/builder?template=${tpl.templateId}`} className="w-16 h-16 rounded-full bg-slate-900/80 flex items-center justify-center transform scale-75 group-hover/card:scale-100 transition-transform duration-300 shadow-xl">
                      <ArrowRight className="w-8 h-8 text-white" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-center gap-3 -mt-6 mb-12">
              {[...Array(8)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  className={`transition-all duration-300 rounded-full ${
                    carouselActiveDot === i
                      ? 'w-3 h-3 bg-[#5B4BE0]'
                      : 'w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 max-w-5xl mx-auto text-slate-600 text-lg font-normal text-center mt-8">
            <p className="leading-relaxed">ATS-friendly professionally<br/>designed resumes</p>
            <p className="leading-relaxed">Customizable sections,<br/>fonts, colors, and backgrounds</p>
            <p className="leading-relaxed">Single-column, double-column,<br/>and multiple-page layouts</p>
          </div>
          
          <div className="mt-10 text-center">
            <Link href="/templates" className="text-[#5B4BE0] font-bold text-[17px] hover:underline underline-offset-4 flex items-center justify-center gap-1.5 transition-all hover:gap-2">
              Browse Resume Templates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="relative h-[600px] sm:h-[600px] w-full max-w-[550px] mx-auto lg:mx-0">
             {/* Beautiful thin curved connecting line */}
             <svg className="absolute top-[100px] left-[100px] w-[300px] h-[350px] text-slate-200 pointer-events-none opacity-60 z-0" viewBox="0 0 300 350" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M50 0 C 250 0, 250 100, 200 100 C 50 100, 50 300, 100 300 C 250 300, 250 350, 200 350" />
             </svg>
             
             {/* Dynamic flex/grid fallback for mobile, absolute for desktop */}
             <div className="grid grid-cols-2 gap-4 sm:hidden h-full content-center relative z-10">
                <div className="bg-[#f4f2fa] rounded-2xl p-6 shadow-sm">
                  <div className="text-[2.5rem] font-bold text-[#664de5] leading-none mb-2">98%</div>
                  <div className="text-slate-800 text-sm font-medium">ATS match rate</div>
                </div>
                <div className="bg-[#f4f2fa] rounded-2xl p-6 shadow-sm">
                  <div className="text-[2.5rem] font-bold text-[#664de5] leading-none mb-2">2M+</div>
                  <div className="text-slate-800 text-sm font-medium">AI resumes built</div>
                </div>
                <div className="bg-[#f4f2fa] rounded-2xl p-6 shadow-sm col-span-2">
                  <div className="text-[3rem] font-bold text-[#664de5] leading-none mb-2">50k+</div>
                  <div className="text-slate-800 text-sm font-medium">interviews landed</div>
                </div>
                <div className="bg-[#f4f2fa] rounded-2xl p-6 shadow-sm col-span-2">
                  <div className="text-[2.5rem] font-bold text-[#664de5] leading-none mb-2">10x</div>
                  <div className="text-slate-800 text-sm font-medium">faster creation</div>
                </div>
             </div>

             <div className="hidden sm:block relative z-10">
               <div className="absolute top-4 left-[20px] bg-[#f4f2fa] rounded-xl p-8 w-[250px] shadow-sm">
                 <div className="text-[3rem] font-black text-[#664de5] tracking-tight leading-none mb-2">98%</div>
                 <div className="text-slate-700 text-base font-semibold">ATS match rate</div>
               </div>
               
               <div className="absolute top-32 left-[280px] bg-[#f4f2fa] rounded-xl p-8 w-[260px] shadow-sm">
                 <div className="text-[3rem] font-black text-[#664de5] tracking-tight leading-none mb-2">2M+</div>
                 <div className="text-slate-700 text-base font-semibold">AI resumes built</div>
               </div>
               
               <div className="absolute top-[230px] left-[0px] bg-[#f4f2fa] rounded-xl p-8 w-[280px] shadow-sm z-10">
                 <div className="text-[3.25rem] font-black text-[#664de5] tracking-tight leading-none mb-2">50k+</div>
                 <div className="text-slate-700 text-base font-semibold">interviews landed</div>
               </div>

               <div className="absolute top-[400px] left-[260px] bg-[#f4f2fa] rounded-xl p-8 w-[220px] shadow-sm">
                 <div className="text-[2.5rem] font-black text-[#664de5] tracking-tight leading-none mb-2">10x</div>
                 <div className="text-slate-700 text-base font-semibold">faster creation</div>
               </div>
             </div>
          </div>

          <div className="lg:pl-20 text-center lg:text-left z-10 max-w-xl mx-auto lg:mx-0">
             <h2 className="text-[3rem] lg:text-[3.75rem] font-black text-[#0f172a] leading-[1.05] mb-8 tracking-tight">
               Trusted by over <span className="text-[#664de5]">50,000</span> job seekers to land their dream roles
             </h2>
             <p className="text-[17px] text-slate-600 leading-[1.7] font-medium mb-8">
               ResumAI leverages advanced AI to write, format, and optimize your resume perfectly for Applicant Tracking Systems (ATS). Stop guessing what recruiters want, and let our intelligent engine tailor your application for maximum impact.
             </p>
          </div>
        </div>
      </section>

      {/* ATS SECTION */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-[#242636]">
        {/* Dark smooth gradient matching the screenshot */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#242636] via-[#2d2942] to-[#3a2f50]"></div>
        
        {/* Abstract arcs */}
        <svg className="absolute right-[-10%] bottom-[-20%] w-[120%] lg:w-[70%] h-[120%] opacity-20 pointer-events-none" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="1000" cy="1000" r="400" stroke="white" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
          <circle cx="1000" cy="1000" r="600" stroke="white" strokeWidth="1"/>
          <circle cx="1000" cy="1000" r="800" stroke="white" strokeWidth="1"/>
          <circle cx="1000" cy="1000" r="1000" stroke="white" strokeWidth="1"/>
        </svg>

        <div className="max-w-[1300px] mx-auto px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          <div className="max-w-xl">
            <h2 className="text-[2.5rem] lg:text-[3.25rem] font-black text-white leading-[1.1] mb-6 tracking-tight">
              Beat the ATS with<br/>
              AI-Optimized<br/>
              Resumes
            </h2>
            <p className="text-[15px] text-slate-300/80 leading-[1.8] font-normal mb-10 max-w-lg">
              Our proprietary AI engine continuously learns from thousands of successful hires to optimize your resume's structure, keywords, and formatting. We ensure your application passes through any Applicant Tracking System flawlessly, so your true potential reaches human eyes every single time.
            </p>
            <Link href="/builder" className="inline-flex px-8 py-3.5 bg-[#10b981] hover:bg-[#0ea5e9] text-white text-[15px] font-bold rounded shadow-[0_4px_14px_rgba(16,185,129,0.2)] transition-colors tracking-wide">
              Create ATS-friendly Resume
            </Link>
          </div>

          <div className="relative h-[400px] flex flex-col gap-6 items-center lg:items-end justify-center pt-8 lg:pt-0">
            
            <div className="bg-[#484065] rounded-lg p-4 pr-10 flex items-center gap-4 transform lg:-translate-x-12 hover:-translate-y-1 transition-all shadow-lg w-full max-w-[360px]">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-[#664de5]">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-white font-bold text-[15px]">AI-Powered Keyword Matching</span>
            </div>

            <div className="bg-[#484065] rounded-lg p-4 pr-10 flex items-center gap-4 transform lg:translate-x-8 hover:-translate-y-1 transition-all shadow-lg w-full max-w-[360px]">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-[#664de5]">
                 <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-white font-bold text-[15px]">Flawless System Parsing</span>
            </div>

            <div className="bg-[#484065] rounded-lg p-4 pr-10 flex items-center gap-4 transform lg:-translate-x-20 hover:-translate-y-1 transition-all shadow-lg w-full max-w-[360px]">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-[#664de5]">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="text-white font-bold text-[15px]">Smart Layout Optimization</span>
            </div>

          </div>
        </div>
      </section>

      <AiFeaturesSection />

      {/* FOOTER CTA */}
      <section className="py-24 bg-white text-center border-t border-slate-100">
        <h2 className="text-4xl lg:text-[3rem] font-bold text-slate-900 mb-10 tracking-tight">Ready to build your resume?</h2>
        <Link href="/builder" className="inline-block px-10 py-5 bg-[#10b981] hover:bg-[#0f976a] text-white text-lg font-bold rounded-md shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-transform hover:-translate-y-1">
          Build Your Resume
        </Link>
      </section>

    </div>
  );
}

'use client';

import { useRef, useEffect } from 'react';
import { useResumeStore } from '@/lib/store/useResumeStore';
import {
  User,
  AlignLeft,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  Trophy,
  Users2,
  Palette,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const STEPS = [
  { id: 0, label: 'Contact', icon: User },
  { id: 1, label: 'Summary', icon: AlignLeft },
  { id: 2, label: 'Education', icon: GraduationCap },
  { id: 3, label: 'Skills', icon: Code2 },
  { id: 4, label: 'Experience', icon: Briefcase },
  { id: 5, label: 'Projects', icon: FolderGit2 },
  { id: 6, label: 'Certifications', icon: Award },
  { id: 7, label: 'Achievements', icon: Trophy },
  { id: 8, label: 'References', icon: Users2 },
  { id: 9, label: 'Templates', icon: Palette },
];

export function FormStepper() {
  const { activeStep, setActiveStep } = useResumeStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll the active step into view when activeStep changes
  useEffect(() => {
    if (activeBtnRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeStep]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full bg-white border border-slate-200/80 rounded-2xl p-1.5 shadow-sm">
      {/* Left Scroll Button */}
      <button
        type="button"
        onClick={() => handleScroll('left')}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-lg bg-white/95 border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-all sm:flex"
        title="Scroll left"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Stepper Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto py-1 px-8 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent scroll-smooth"
      >
        <div className="flex items-center min-w-max gap-1">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = activeStep === step.id;
            const isCompleted = activeStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  ref={isCurrent ? activeBtnRef : null}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isCurrent
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20'
                      : isCompleted
                      ? 'bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100/90'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <span className={`w-4 h-4 flex items-center justify-center text-[10px] rounded-full font-black ${
                    isCurrent ? 'bg-white/20 text-white' : isCompleted ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {idx + 1}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                  <span>{step.label}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-3 h-[2px] mx-1 rounded-full ${
                      isCompleted ? 'bg-emerald-300' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Scroll Button */}
      <button
        type="button"
        onClick={() => handleScroll('right')}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-lg bg-white/95 border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-all sm:flex"
        title="Scroll right"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

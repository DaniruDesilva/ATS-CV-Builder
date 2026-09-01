'use client';

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
  CheckCircle2
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

  return (
    <div className="w-full overflow-x-auto py-2 scrollbar-none">
      <div className="flex items-center min-w-max gap-1 px-1">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = activeStep === step.id;
          const isCompleted = activeStep > step.id;

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isCompleted
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                <span className="font-semibold">{step.label}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div className={`w-4 h-[2px] mx-0.5 rounded-full ${isCompleted ? 'bg-blue-300' : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

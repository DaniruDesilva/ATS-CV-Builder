'use client';

import { useResumeStore } from '@/lib/store/useResumeStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useGuestUsageStore } from '@/lib/store/useGuestUsageStore';
import { GuestAuthModal } from '@/components/auth/GuestAuthModal';
import { ACTION_VERBS, ExperienceItem } from '@/types/resume';
import { Briefcase, Plus, Trash2, Sparkles, Zap, Check } from 'lucide-react';
import { useState } from 'react';

export function ExperienceForm() {
  const {
    content,
    addExperience,
    updateExperience,
    removeExperience,
    addExperienceHighlight,
    updateExperienceHighlight,
    removeExperienceHighlight
  } = useResumeStore();
  const { isAuthenticated } = useAuthStore();
  const { canUseBuilderAi, recordBuilderAi } = useGuestUsageStore();

  const [activeVerbIndex, setActiveVerbIndex] = useState<{ expId: string; bulletIdx: number } | null>(null);
  const [optimizingBullet, setOptimizingBullet] = useState<{ expId: string; bulletIdx: number } | null>(null);
  const [optimizedSuccess, setOptimizedSuccess] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const inputClass = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-colors";

  const handleOptimizeBullet = async (expId: string, bulletIdx: number, text: string) => {
    if (!text || text.length < 5) return;

    if (!canUseBuilderAi(isAuthenticated)) {
      setShowAuthModal(true);
      return;
    }

    setOptimizingBullet({ expId, bulletIdx });
    setOptimizedSuccess(null);
    try {
      const res = await fetch('/api/ai/optimize-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulletText: text }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 403 || errData.requireAuth) {
          setShowAuthModal(true);
          return;
        }
      }

      if (res.ok) {
        const data = await res.json();
        if (data.improved) {
          updateExperienceHighlight(expId, bulletIdx, data.improved);
          const key = `${expId}-${bulletIdx}`;
          setOptimizedSuccess(key);
          setTimeout(() => setOptimizedSuccess(null), 2500);
          if (!isAuthenticated) {
            recordBuilderAi();
          }
        }
      }
    } catch (err) {
      console.error('Failed to optimize bullet:', err);
    } finally {
      setOptimizingBullet(null);
    }
  };

  const handleAddNewExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      highlights: ['']
    };
    addExperience(newExp);
  };

  const handleInsertVerb = (expId: string, bulletIdx: number, verb: string) => {
    const exp = content.experience.find((e) => e.id === expId);
    if (!exp) return;
    const currentBullet = exp.highlights[bulletIdx] || '';
    const updated = currentBullet.trim().length > 0 ? `${verb} ${currentBullet}` : `${verb} `;
    updateExperienceHighlight(expId, bulletIdx, updated);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" /> Work Experience
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Use the X-Y-Z formula: &quot;Accomplished [X], measured by [Y], by doing [Z]&quot;.
          </p>
        </div>

        <button
          onClick={handleAddNewExperience}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Role
        </button>
      </div>

      {content.experience.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <p className="text-sm text-slate-500">No work experience added yet.</p>
          <button
            onClick={handleAddNewExperience}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Your First Role
          </button>
        </div>
      ) : (
        content.experience.map((exp, expIdx) => (
          <div key={exp.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Role #{expIdx + 1}: {exp.position || 'Untitled'} {exp.company ? `@ ${exp.company}` : ''}
              </span>
              <button
                onClick={() => removeExperience(exp.id)}
                className="text-slate-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  placeholder="e.g. Google"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Job Title</label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                <input
                  type="text"
                  value={exp.location || ''}
                  onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                  placeholder="e.g. San Francisco, CA"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start</label>
                  <input
                    type="month"
                    value={exp.startDate || ''}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">End</label>
                  <input
                    type="month"
                    disabled={exp.current}
                    value={exp.current ? '' : exp.endDate || ''}
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                    className={`${inputClass} disabled:opacity-40`}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={exp.current}
                onChange={(e) =>
                  updateExperience(exp.id, {
                    current: e.target.checked,
                    endDate: e.target.checked ? 'Present' : ''
                  })
                }
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor={`current-${exp.id}`} className="text-sm text-slate-600 font-medium cursor-pointer">
                I currently work here
              </label>
            </div>

            {/* Bullet Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Key Achievements (Google X-Y-Z)
                </span>
                <button
                  onClick={() => addExperienceHighlight(exp.id, '')}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Bullet
                </button>
              </div>

              {exp.highlights.map((bullet, bulletIdx) => {
                const isOptimizing = optimizingBullet?.expId === exp.id && optimizingBullet.bulletIdx === bulletIdx;
                const isSuccess = optimizedSuccess === `${exp.id}-${bulletIdx}`;

                return (
                  <div key={bulletIdx} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => updateExperienceHighlight(exp.id, bulletIdx, e.target.value)}
                        placeholder="e.g. Reduced API latency by 45% through microservices optimization..."
                        className={`flex-1 ${inputClass} text-xs`}
                      />
                      <button
                        onClick={() =>
                          setActiveVerbIndex(
                            activeVerbIndex?.expId === exp.id && activeVerbIndex.bulletIdx === bulletIdx
                              ? null
                              : { expId: exp.id, bulletIdx }
                          )
                        }
                        title="Insert Action Verb"
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOptimizeBullet(exp.id, bulletIdx, bullet)}
                        disabled={isOptimizing}
                        title="Rewrite with Google X-Y-Z formula"
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 disabled:opacity-50 ${
                          isSuccess
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {isOptimizing ? (
                          <Zap className="w-3.5 h-3.5 animate-spin" />
                        ) : isSuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Polished!</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Rewrite</span>
                          </>
                        )}
                      </button>
                      {exp.highlights.length > 1 && (
                        <button
                          onClick={() => removeExperienceHighlight(exp.id, bulletIdx)}
                          className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Action Verbs Picker */}
                    {activeVerbIndex?.expId === exp.id && activeVerbIndex.bulletIdx === bulletIdx && (
                      <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-2.5 space-y-1.5">
                        <div className="text-xs font-semibold text-emerald-900 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500" /> Insert Strong Action Verb:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {ACTION_VERBS.map((verb) => (
                            <button
                              key={verb}
                              onClick={() => {
                                handleInsertVerb(exp.id, bulletIdx, verb);
                                setActiveVerbIndex(null);
                              }}
                              className="px-2 py-0.5 rounded bg-white hover:bg-emerald-600 hover:text-white text-emerald-800 text-[11px] font-medium border border-emerald-200 transition-colors shadow-2xs"
                            >
                              + {verb}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Guest AI Authentication Modal */}
      <GuestAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        feature="builder_ai"
        redirectUrl="/builder?step=4"
      />
    </div>
  );
}

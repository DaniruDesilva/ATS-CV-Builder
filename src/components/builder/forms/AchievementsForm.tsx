'use client';

import { useResumeStore } from '@/lib/store/useResumeStore';
import { AchievementItem } from '@/types/resume';
import { Trophy, Plus, Trash2 } from 'lucide-react';

export function AchievementsForm() {
  const { content, addAchievement, updateAchievement, removeAchievement } = useResumeStore();

  const inputClass = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors";

  const handleAddAch = () => {
    const newAch: AchievementItem = {
      id: `ach-${Date.now()}`,
      title: '',
      description: '',
      date: ''
    };
    addAchievement(newAch);
  };

  const achievements = content.achievements || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-600" /> Extra-Curricular & Achievements
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Highlight leadership, sports, university clubs, hackathons, and competitions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddAch}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Activity / Award
        </button>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <p className="text-sm text-slate-500">No extra-curricular activities or achievements added yet.</p>
          <button
            type="button"
            onClick={handleAddAch}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Activity
          </button>
        </div>
      ) : (
        achievements.map((ach, idx) => (
          <div key={ach.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Achievement #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeAchievement(ach.id)}
                className="text-slate-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Activity / Achievement Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={ach.title}
                onChange={(e) => updateAchievement(ach.id, { title: e.target.value })}
                placeholder="e.g. University Karate Team Member: 2nd Runner-Up, University Kata Championship (2025)."
                className={inputClass}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

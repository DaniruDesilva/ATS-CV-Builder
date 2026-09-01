'use client';

import { useResumeStore } from '@/lib/store/useResumeStore';
import { SkillCategory } from '@/types/resume';
import { Code2, Plus, Trash2, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

const COMMON_CATEGORIES = [
  'Programming Languages',
  'Frontend Technologies',
  'Backend & APIs',
  'Databases & ORM',
  'Mobile Development',
  'Cloud & DevOps',
  'Hosting & Deployment',
  'UI/UX',
  'Version Control',
  'Graphic Design'
];

export function SkillsForm() {
  const { content, addSkillCategory, updateSkillCategory, removeSkillCategory } = useResumeStore();
  const [newSkillInput, setNewSkillInput] = useState<{ [catId: string]: string }>({});

  const inputClass = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors";

  const handleAddCategory = (name = 'Technical Skills') => {
    const newCat: SkillCategory = {
      id: `sk-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      categoryName: name,
      skills: []
    };
    addSkillCategory(newCat);
  };

  const handleAddSkillTag = (catId: string) => {
    const text = newSkillInput[catId]?.trim();
    if (!text) return;
    const cat = content.skills.find((s) => s.id === catId);
    if (!cat) return;

    // Support comma-separated batch adding
    const tagsToAdd = text.split(',').map((t) => t.trim()).filter((t) => t.length > 0);
    const updatedSkills = [...cat.skills];
    tagsToAdd.forEach((t) => {
      if (!updatedSkills.includes(t)) {
        updatedSkills.push(t);
      }
    });

    updateSkillCategory(catId, cat.categoryName, updatedSkills);
    setNewSkillInput((prev) => ({ ...prev, [catId]: '' }));
  };

  const handleRemoveSkillTag = (catId: string, skillToRemove: string) => {
    const cat = content.skills.find((s) => s.id === catId);
    if (!cat) return;
    updateSkillCategory(
      catId,
      cat.categoryName,
      cat.skills.filter((s) => s !== skillToRemove)
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-600" /> Technical Skills & Competencies
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Group your skills into focused categories (e.g. Programming Languages, Frontend, Backend, Databases).
          </p>
        </div>

        <button
          onClick={() => handleAddCategory()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Suggested Categories Quick Chips */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3">
        <span className="text-xs font-bold text-blue-800 flex items-center gap-1 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Quick Add Common Categories:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_CATEGORIES.map((catName) => {
            const exists = content.skills.some((s) => s.categoryName.toLowerCase() === catName.toLowerCase());
            return (
              <button
                key={catName}
                type="button"
                disabled={exists}
                onClick={() => handleAddCategory(catName)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-all ${
                  exists
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white shadow-2xs'
                }`}
              >
                + {catName}
              </button>
            );
          })}
        </div>
      </div>

      {content.skills.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <p className="text-sm text-slate-500">No skill categories defined yet.</p>
          <button
            onClick={() => handleAddCategory()}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Add First Category
          </button>
        </div>
      ) : (
        content.skills.map((cat) => (
          <div key={cat.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={cat.categoryName}
                onChange={(e) => updateSkillCategory(cat.id, e.target.value, cat.skills)}
                placeholder="Category Name (e.g. Programming Languages)"
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 w-2/3 transition-colors"
              />
              <button
                onClick={() => removeSkillCategory(cat.id)}
                className="text-slate-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            </div>

            {/* Tag List */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkillTag(cat.id, skill)}
                    className="hover:text-red-500 focus:outline-none transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newSkillInput[cat.id] || ''}
                onChange={(e) => setNewSkillInput({ ...newSkillInput, [cat.id]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkillTag(cat.id);
                  }
                }}
                placeholder="e.g. Java, JavaScript, TypeScript (comma-separated supported) & press Enter"
                className={`flex-1 ${inputClass} text-xs`}
              />
              <button
                type="button"
                onClick={() => handleAddSkillTag(cat.id)}
                className="px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors"
              >
                Add Skill
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

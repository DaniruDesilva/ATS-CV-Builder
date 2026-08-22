'use client';

import { useResumeStore } from '@/lib/store/useResumeStore';
import { EducationItem } from '@/types/resume';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

export function EducationForm() {
  const { content, addEducation, updateEducation, removeEducation } = useResumeStore();

  const inputClass = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors";

  const handleAddEdu = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    addEducation(newEdu);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" /> Education
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            List degrees, institutions, and honors for ATS scanning.
          </p>
        </div>

        <button
          onClick={handleAddEdu}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Degree
        </button>
      </div>

      {content.education.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <p className="text-sm text-slate-500">No education entries added yet.</p>
          <button
            onClick={handleAddEdu}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Education
          </button>
        </div>
      ) : (
        content.education.map((edu, idx) => (
          <div key={edu.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Degree #{idx + 1}: {edu.degree || 'Degree'} {edu.institution ? `@ ${edu.institution}` : ''}
              </span>
              <button
                onClick={() => removeEducation(edu.id)}
                className="text-slate-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                  placeholder="e.g. Stanford University"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                  placeholder="e.g. Bachelor of Science"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Field of Study</label>
                <input
                  type="text"
                  value={edu.fieldOfStudy || ''}
                  onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">GPA / Honors</label>
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                  placeholder="e.g. 3.9 / 4.0"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start</label>
                  <input
                    type="month"
                    value={edu.startDate || ''}
                    onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Graduation</label>
                  <input
                    type="month"
                    value={edu.endDate || ''}
                    onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                <input
                  type="text"
                  value={edu.location || ''}
                  onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                  placeholder="e.g. Stanford, CA"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

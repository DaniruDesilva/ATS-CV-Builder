'use client';

import { useResumeStore } from '@/lib/store/useResumeStore';
import { ProjectItem } from '@/types/resume';
import { FolderGit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function ProjectsForm() {
  const { content, addProject, updateProject, removeProject } = useResumeStore();
  const [techInput, setTechInput] = useState<{ [projId: string]: string }>({});

  const inputClass = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors";

  const handleAddProj = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      technologies: [],
      url: '',
      githubUrl: '',
      highlights: ['']
    };
    addProject(newProj);
  };

  const handleAddTech = (projId: string) => {
    const text = techInput[projId]?.trim();
    if (!text) return;
    const proj = content.projects.find((p) => p.id === projId);
    if (!proj) return;
    if (!proj.technologies.includes(text)) {
      updateProject(projId, { technologies: [...proj.technologies, text] });
    }
    setTechInput((prev) => ({ ...prev, [projId]: '' }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-blue-600" /> Key Projects
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Highlight technical projects, open-source work, or architecture initiatives.
          </p>
        </div>

        <button
          onClick={handleAddProj}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {content.projects.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <p className="text-sm text-slate-500">No project entries added yet.</p>
          <button
            onClick={handleAddProj}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      ) : (
        content.projects.map((proj, idx) => (
          <div key={proj.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Project #{idx + 1}: {proj.name || 'Untitled'}
              </span>
              <button
                onClick={() => removeProject(proj.id)}
                className="text-slate-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Name</label>
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                  placeholder="e.g. Distributed Analytics Engine"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Live URL / Demo</label>
                <input
                  type="url"
                  value={proj.url || ''}
                  onChange={(e) => updateProject(proj.id, { url: e.target.value })}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Short Description</label>
                <input
                  type="text"
                  value={proj.description}
                  onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                  placeholder="e.g. High-throughput telemetry system using Next.js, Redis, and Supabase."
                  className={inputClass}
                />
              </div>
            </div>

            {/* Technologies used */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Technologies Used</label>
              <div className="flex flex-wrap gap-1 mb-2">
                {proj.technologies.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={techInput[proj.id] || ''}
                  onChange={(e) => setTechInput({ ...techInput, [proj.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech(proj.id);
                    }
                  }}
                  placeholder="Add technology (e.g. Docker) & press Enter"
                  className={`flex-1 ${inputClass} text-xs`}
                />
                <button
                  onClick={() => handleAddTech(proj.id)}
                  className="px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

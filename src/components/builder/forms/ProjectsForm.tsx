'use client';

import { useResumeStore } from '@/lib/store/useResumeStore';
import { ACTION_VERBS, ProjectItem } from '@/types/resume';
import { FolderGit2, Plus, Trash2, Sparkles, Zap, Github, Globe } from 'lucide-react';
import { useState } from 'react';

export function ProjectsForm() {
  const {
    content,
    addProject,
    updateProject,
    removeProject,
    addProjectHighlight,
    updateProjectHighlight,
    removeProjectHighlight
  } = useResumeStore();

  const [techInput, setTechInput] = useState<{ [projId: string]: string }>({});
  const [activeVerbIndex, setActiveVerbIndex] = useState<{ projId: string; bulletIdx: number } | null>(null);
  const [optimizingBullet, setOptimizingBullet] = useState<{ projId: string; bulletIdx: number } | null>(null);

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

    // Support comma-separated batch adding
    const tagsToAdd = text.split(',').map((t) => t.trim()).filter((t) => t.length > 0);
    const updatedTechs = [...proj.technologies];
    tagsToAdd.forEach((t) => {
      if (!updatedTechs.includes(t)) {
        updatedTechs.push(t);
      }
    });

    updateProject(projId, { technologies: updatedTechs });
    setTechInput((prev) => ({ ...prev, [projId]: '' }));
  };

  const handleRemoveTech = (projId: string, techToRemove: string) => {
    const proj = content.projects.find((p) => p.id === projId);
    if (!proj) return;
    updateProject(projId, {
      technologies: proj.technologies.filter((t) => t !== techToRemove)
    });
  };

  const handleOptimizeBullet = async (projId: string, bulletIdx: number, text: string) => {
    if (!text || text.length < 5) return;
    setOptimizingBullet({ projId, bulletIdx });
    try {
      const res = await fetch('/api/ai/optimize-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulletText: text }),
      });
      if (res.ok) {
        const data = await res.json();
        updateProjectHighlight(projId, bulletIdx, data.improved);
      }
    } catch (err) {
      console.error('Failed to optimize bullet:', err);
    } finally {
      setOptimizingBullet(null);
    }
  };

  const handleInsertVerb = (projId: string, bulletIdx: number, verb: string) => {
    const proj = content.projects.find((p) => p.id === projId);
    if (!proj) return;
    const currentBullet = proj.highlights?.[bulletIdx] || '';
    const updated = currentBullet.trim().length > 0 ? `${verb} ${currentBullet}` : `${verb} `;
    updateProjectHighlight(projId, bulletIdx, updated);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-blue-600" /> Key Projects
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Showcase software projects, tech stack used, live website links, and GitHub repositories.
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
          <div key={proj.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Project #{idx + 1}: {proj.name || 'Untitled Project'}
              </span>
              <button
                onClick={() => removeProject(proj.id)}
                className="text-slate-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                  placeholder="e.g. Delight Consumer Products E-Commerce"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" /> Website / Live Demo Link
                </label>
                <input
                  type="url"
                  value={proj.url || ''}
                  onChange={(e) => updateProject(proj.id, { url: e.target.value })}
                  placeholder="https://delight.lk"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-700" /> GitHub Repository Link
                </label>
                <input
                  type="url"
                  value={proj.githubUrl || ''}
                  onChange={(e) => updateProject(proj.id, { githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className={inputClass}
                />
              </div>
            </div>

            {/* Technologies used */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Technologies / Tech Stack</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {proj.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(proj.id, tech)}
                      className="text-blue-400 hover:text-red-500 focus:outline-none"
                    >
                      ×
                    </button>
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
                  placeholder="e.g. Next.js, SQLite, PayHere (comma-separated supported) & press Enter"
                  className={`flex-1 ${inputClass} text-xs`}
                />
                <button
                  type="button"
                  onClick={() => handleAddTech(proj.id)}
                  className="px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors"
                >
                  Add Tech
                </button>
              </div>
            </div>

            {/* Project Highlights / Bullets */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Key Features & Architecture Bullets
                </span>
                <button
                  type="button"
                  onClick={() => addProjectHighlight(proj.id, '')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Bullet
                </button>
              </div>

              {(proj.highlights || []).map((bullet, bulletIdx) => (
                <div key={bulletIdx} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => updateProjectHighlight(proj.id, bulletIdx, e.target.value)}
                      placeholder="e.g. Architected the application using Next.js and SQLite, implementing Google OAuth 2.0..."
                      className={`flex-1 ${inputClass} text-xs`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setActiveVerbIndex(
                          activeVerbIndex?.projId === proj.id && activeVerbIndex.bulletIdx === bulletIdx
                            ? null
                            : { projId: proj.id, bulletIdx }
                        )
                      }
                      title="Action Verbs"
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold border border-blue-200 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOptimizeBullet(proj.id, bulletIdx, bullet)}
                      disabled={optimizingBullet?.projId === proj.id && optimizingBullet.bulletIdx === bulletIdx}
                      title="Rewrite with AI"
                      className="px-2 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold border border-indigo-200 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      {optimizingBullet?.projId === proj.id && optimizingBullet.bulletIdx === bulletIdx ? (
                        <Zap className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Rewrite</span>
                        </>
                      )}
                    </button>
                    {(proj.highlights?.length || 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProjectHighlight(proj.id, bulletIdx)}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Action Verbs Dropdown */}
                  {activeVerbIndex?.projId === proj.id && activeVerbIndex.bulletIdx === bulletIdx && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 space-y-1.5">
                      <div className="text-xs font-semibold text-blue-700 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" /> Insert Action Verb:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {ACTION_VERBS.map((verb) => (
                          <button
                            type="button"
                            key={verb}
                            onClick={() => {
                              handleInsertVerb(proj.id, bulletIdx, verb);
                              setActiveVerbIndex(null);
                            }}
                            className="px-2 py-0.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 text-[11px] font-medium transition-colors"
                          >
                            + {verb}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

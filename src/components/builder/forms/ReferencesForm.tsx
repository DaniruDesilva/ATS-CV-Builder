'use client';

import { useResumeStore } from '@/lib/store/useResumeStore';
import { ReferenceItem } from '@/types/resume';
import { Users2, Plus, Trash2, Mail, Phone, Building } from 'lucide-react';

export function ReferencesForm() {
  const { content, addReference, updateReference, removeReference } = useResumeStore();

  const inputClass = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors";

  const handleAddRef = () => {
    const newRef: ReferenceItem = {
      id: `ref-${Date.now()}`,
      name: '',
      designation: '',
      institution: '',
      email: '',
      phone: ''
    };
    addReference(newRef);
  };

  const refs = content.references || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users2 className="w-5 h-5 text-blue-600" /> Academic & Professional References
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Include lecturers, mentors, or former managers who can vouch for your work.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddRef}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Referee
        </button>
      </div>

      {refs.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <p className="text-sm text-slate-500">No references added yet.</p>
          <button
            type="button"
            onClick={handleAddRef}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Referee
          </button>
        </div>
      ) : (
        refs.map((ref, idx) => (
          <div key={ref.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Referee #{idx + 1}: {ref.name || 'Untitled Referee'}
              </span>
              <button
                type="button"
                onClick={() => removeReference(ref.id)}
                className="text-slate-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Referee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={ref.name}
                  onChange={(e) => updateReference(ref.id, { name: e.target.value })}
                  placeholder="e.g. MS M.N. Chandimali"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={ref.designation || ''}
                  onChange={(e) => updateReference(ref.id, { designation: e.target.value })}
                  placeholder="e.g. Senior Lecturer / Engineering Lead"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" /> Department / University / Organization
                </label>
                <input
                  type="text"
                  value={ref.institution || ''}
                  onChange={(e) => updateReference(ref.id, { institution: e.target.value })}
                  placeholder="e.g. Department of Information Technology, University of Moratuwa"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                </label>
                <input
                  type="email"
                  value={ref.email || ''}
                  onChange={(e) => updateReference(ref.id, { email: e.target.value })}
                  placeholder="e.g. nipunic@uom.lk"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number (Optional)
                </label>
                <input
                  type="text"
                  value={ref.phone || ''}
                  onChange={(e) => updateReference(ref.id, { phone: e.target.value })}
                  placeholder="e.g. +94 77 123 4567"
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

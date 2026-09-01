'use client';

import { useResumeStore } from '@/lib/store/useResumeStore';
import { CertificationItem } from '@/types/resume';
import { Award, Plus, Trash2, Globe, FileBadge2 } from 'lucide-react';

export function CertificationsForm() {
  const { content, addCertification, updateCertification, removeCertification } = useResumeStore();

  const inputClass = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors";

  const handleAddCert = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      issueDate: '',
      credentialId: '',
      url: ''
    };
    addCertification(newCert);
  };

  const certs = content.certifications || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" /> Certifications & Licenses
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Add online certifications, course credentials, certificate IDs, and issuing platforms.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddCert}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      </div>

      {certs.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <p className="text-sm text-slate-500">No certifications added yet.</p>
          <button
            type="button"
            onClick={handleAddCert}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Certification
          </button>
        </div>
      ) : (
        certs.map((cert, idx) => (
          <div key={cert.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                <FileBadge2 className="w-3.5 h-3.5" />
                Certification #{idx + 1}: {cert.issuer ? `${cert.issuer}: ` : ''}{cert.name || 'Untitled Certification'}
              </span>
              <button
                type="button"
                onClick={() => removeCertification(cert.id)}
                className="text-slate-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Issuing Organization / Platform <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cert.issuer || ''}
                  onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                  placeholder="e.g. Sololearn, Simplilearn, AWS, Coursera"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Certification / Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                  placeholder="e.g. Introduction to JAVA, JavaScript, SQL, HTML, CSS"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Credential ID / Certificate Code
                </label>
                <input
                  type="text"
                  value={cert.credentialId || ''}
                  onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                  placeholder="e.g. CC-NPIIYEYX or Certificate Code: 6733892"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Issue Year / Date
                </label>
                <input
                  type="text"
                  value={cert.issueDate || ''}
                  onChange={(e) => updateCertification(cert.id, { issueDate: e.target.value })}
                  placeholder="e.g. 2024 or Nov 2024"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" /> Credential URL / Verification Link
                </label>
                <input
                  type="url"
                  value={cert.url || ''}
                  onChange={(e) => updateCertification(cert.id, { url: e.target.value })}
                  placeholder="https://..."
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

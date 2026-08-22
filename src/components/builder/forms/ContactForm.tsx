'use client';

import { useResumeStore } from '@/lib/store/useResumeStore';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase } from 'lucide-react';

export function ContactForm() {
  const { content, updatePersonalInfo } = useResumeStore();
  const info = content.personalInfo;

  const inputClass = "w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors";

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" /> Personal Contact Details
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          ATS algorithms parse email, phone, location, and LinkedIn profiles first.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={info.fullName || ''}
              onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
              placeholder="e.g. Jane Doe"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Target Job Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={info.jobTitle || ''}
              onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
              placeholder="e.g. Senior Software Engineer"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              value={info.email || ''}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
              placeholder="e.g. jane.doe@example.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={info.phone || ''}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
              placeholder="e.g. +1 (555) 000-0000"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Location
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={info.location || ''}
              onChange={(e) => updatePersonalInfo({ location: e.target.value })}
              placeholder="e.g. San Francisco, CA"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            LinkedIn Profile
          </label>
          <div className="relative">
            <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="url"
              value={info.linkedin || ''}
              onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
              placeholder="e.g. https://linkedin.com/in/janedoe"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            GitHub Profile
          </label>
          <div className="relative">
            <Github className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="url"
              value={info.github || ''}
              onChange={(e) => updatePersonalInfo({ github: e.target.value })}
              placeholder="e.g. https://github.com/janedoe"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Portfolio / Website
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="url"
              value={info.website || ''}
              onChange={(e) => updatePersonalInfo({ website: e.target.value })}
              placeholder="e.g. https://janedoe.dev"
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

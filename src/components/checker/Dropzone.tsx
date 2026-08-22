'use client';

import { useState, useRef } from 'react';
import { UploadCloud, FileText, X, Sparkles, AlertCircle, FileCheck } from 'lucide-react';

interface DropzoneProps {
  onAnalyze: (file: File, jobDescription: string) => void;
  isLoading: boolean;
}

export function Dropzone({ onAnalyze, isLoading }: DropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setErrorMsg('');
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const validateAndSetFile = (f?: File) => {
    if (!f) return;
    const name = f.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.docx') && !name.endsWith('.doc')) {
      setErrorMsg('Unsupported file type. Please upload a .pdf or .docx document.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds 10MB limit.');
      return;
    }
    setFile(f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select or drop a resume file to analyze.');
      return;
    }
    onAnalyze(file, jobDescription);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* File Dropzone Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50 scale-[1.01]'
            : file
            ? 'border-emerald-400 bg-emerald-50'
            : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc"
          onChange={(e) => validateAndSetFile(e.target.files?.[0])}
          className="hidden"
        />

        {file ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <FileCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for scanning
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="mt-2 text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Remove File
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-800">
                Drag & drop your resume or <span className="text-blue-600 underline underline-offset-2">browse</span>
              </p>
              <p className="text-sm text-slate-500 mt-1">
                PDF or DOCX files up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMsg}
        </div>
      )}

      {/* Target Job Description */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Target Job Description
          <span className="text-xs font-normal text-slate-400 ml-1">(optional)</span>
        </label>
        <textarea
          rows={4}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job posting text here for keyword gap analysis..."
          className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !file}
        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm disabled:opacity-50 disabled:hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
      >
        <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? 'Analyzing with AI...' : 'Scan & Check ATS Compatibility'}
      </button>
    </form>
  );
}

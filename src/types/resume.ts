export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string; // YYYY-MM
  endDate: string; // YYYY-MM or "Present"
  current: boolean;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights?: string[];
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer?: string;
  issueDate?: string;
  credentialId?: string;
  url?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  designation?: string;
  institution?: string;
  email?: string;
  phone?: string;
}

export interface ResumeContent {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  achievements?: AchievementItem[];
  certifications?: CertificationItem[];
  references?: ReferenceItem[];
}

export type TemplateId = 'classic-ats' | 'modern-executive' | 'technical-clean' | 'traditional-ats';

export interface ResumeData {
  id: string;
  title: string;
  templateId: TemplateId;
  content: ResumeContent;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const ACTION_VERBS = [
  'Accelerated', 'Architected', 'Championed', 'Designed', 'Directed',
  'Engineered', 'Expanded', 'Implemented', 'Innovated', 'Led',
  'Maximized', 'Optimized', 'Orchestrated', 'Overhauled', 'Pioneered',
  'Reduced', 'Restructured', 'Scale', 'Spearheaded', 'Transformed'
];

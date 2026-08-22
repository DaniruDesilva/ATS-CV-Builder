import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeContent, TemplateId, ExperienceItem, EducationItem, SkillCategory, ProjectItem } from '@/types/resume';

export const INITIAL_RESUME_CONTENT: ResumeContent = {
  personalInfo: {
    fullName: "Alex Rivera",
    jobTitle: "Senior Full Stack Engineer",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    website: "https://alexrivera.dev",
    linkedin: "https://linkedin.in/alex-rivera-tech",
    github: "https://github.com/alexrivera-dev"
  },
  summary: "Results-driven Senior Full Stack Engineer with 6+ years of experience building high-scale cloud platforms, microservices, and modern web applications. Specialized in React, Next.js, Node.js, and PostgreSQL with a proven record of optimizing API performance by 40% and leading high-performing engineering teams.",
  experience: [
    {
      id: "exp-1",
      company: "Apex Tech Solutions",
      position: "Senior Full Stack Engineer",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "Present",
      current: true,
      highlights: [
        "Architected high-throughput microservices handling 2M+ daily active requests using Next.js, Node.js, and Redis caching.",
        "Reduced database query latency by 45% through query optimization, index tuning, and PostgreSQL connection pooling.",
        "Spearheaded the migration from legacy monolithic architecture to event-driven microservices, improving platform uptime to 99.99%."
      ]
    },
    {
      id: "exp-2",
      company: "Innovate Digital Hub",
      position: "Software Engineer",
      location: "San Jose, CA",
      startDate: "2019-06",
      endDate: "2022-02",
      current: false,
      highlights: [
        "Engineered responsive UI components using React, TypeScript, and Tailwind CSS, driving a 25% increase in user conversion.",
        "Designed and implemented secure OAuth2 / JWT authentication pipelines serving over 500k registered users.",
        "Automated CI/CD deployment pipelines with GitHub Actions and Docker, cutting deployment cycle times from 2 hours to 10 minutes."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2015-08",
      endDate: "2019-05",
      gpa: "3.85 / 4.0",
      highlights: ["Dean's Honor List (6 Semesters)", "President of Software Engineering Club"]
    }
  ],
  skills: [
    {
      id: "sk-1",
      categoryName: "Languages & Frameworks",
      skills: ["TypeScript", "JavaScript", "React.js", "Next.js", "Node.js", "Python", "HTML5/CSS3", "GraphQL"]
    },
    {
      id: "sk-2",
      categoryName: "Database & Cloud Infrastructure",
      skills: ["PostgreSQL", "MongoDB", "Redis", "Prisma ORM", "AWS (S3, Lambda, ECS)", "Docker", "Kubernetes", "Supabase"]
    },
    {
      id: "sk-3",
      categoryName: "Tools & Testing",
      skills: ["Git", "GitHub Actions", "Jest", "Playwright", "Webpack", "Tailwind CSS", "RESTful APIs", "CI/CD"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "CloudMetrics Analytics Engine",
      description: "Real-time infrastructure performance telemetry collector with customizable dashboard widgets.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Chart.js", "Supabase"],
      url: "https://cloudmetrics-demo.vercel.app",
      githubUrl: "https://github.com/alexrivera-dev/cloudmetrics",
      highlights: [
        "Built responsive real-time WebSocket dashboard visualization handling 5,000+ data points per second.",
        "Engineered custom state management pattern with Zustand reducing client render passes by 30%."
      ]
    }
  ]
};

interface ResumeState {
  title: string;
  templateId: TemplateId;
  content: ResumeContent;
  activeStep: number;
  
  // Actions
  setTitle: (title: string) => void;
  setTemplateId: (templateId: TemplateId) => void;
  setActiveStep: (step: number) => void;
  updatePersonalInfo: (info: Partial<ResumeContent['personalInfo']>) => void;
  updateSummary: (summary: string) => void;
  
  // Experience
  addExperience: (exp: ExperienceItem) => void;
  updateExperience: (id: string, exp: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;
  addExperienceHighlight: (expId: string, highlight: string) => void;
  updateExperienceHighlight: (expId: string, index: number, highlight: string) => void;
  removeExperienceHighlight: (expId: string, index: number) => void;
  
  // Education
  addEducation: (edu: EducationItem) => void;
  updateEducation: (id: string, edu: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;
  
  // Skills
  addSkillCategory: (cat: SkillCategory) => void;
  updateSkillCategory: (id: string, name: string, skills: string[]) => void;
  removeSkillCategory: (id: string) => void;
  
  // Projects
  addProject: (proj: ProjectItem) => void;
  updateProject: (id: string, proj: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;
  
  // Reset / Load Sample
  loadSampleData: () => void;
  resetToEmpty: () => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      title: "Senior Software Engineer Resume",
      templateId: "classic-ats",
      content: INITIAL_RESUME_CONTENT,
      activeStep: 0,

      setTitle: (title) => set({ title }),
      setTemplateId: (templateId) => set({ templateId }),
      setActiveStep: (activeStep) => set({ activeStep }),

      updatePersonalInfo: (info) =>
        set((state) => ({
          content: {
            ...state.content,
            personalInfo: { ...state.content.personalInfo, ...info }
          }
        })),

      updateSummary: (summary) =>
        set((state) => ({
          content: { ...state.content, summary }
        })),

      addExperience: (exp) =>
        set((state) => ({
          content: {
            ...state.content,
            experience: [...state.content.experience, exp]
          }
        })),

      updateExperience: (id, exp) =>
        set((state) => ({
          content: {
            ...state.content,
            experience: state.content.experience.map((e) =>
              e.id === id ? { ...e, ...exp } : e
            )
          }
        })),

      removeExperience: (id) =>
        set((state) => ({
          content: {
            ...state.content,
            experience: state.content.experience.filter((e) => e.id !== id)
          }
        })),

      addExperienceHighlight: (expId, highlight) =>
        set((state) => ({
          content: {
            ...state.content,
            experience: state.content.experience.map((e) =>
              e.id === expId ? { ...e, highlights: [...e.highlights, highlight] } : e
            )
          }
        })),

      updateExperienceHighlight: (expId, index, highlight) =>
        set((state) => ({
          content: {
            ...state.content,
            experience: state.content.experience.map((e) => {
              if (e.id !== expId) return e;
              const newHighlights = [...e.highlights];
              newHighlights[index] = highlight;
              return { ...e, highlights: newHighlights };
            })
          }
        })),

      removeExperienceHighlight: (expId, index) =>
        set((state) => ({
          content: {
            ...state.content,
            experience: state.content.experience.map((e) => {
              if (e.id !== expId) return e;
              return {
                ...e,
                highlights: e.highlights.filter((_, i) => i !== index)
              };
            })
          }
        })),

      addEducation: (edu) =>
        set((state) => ({
          content: {
            ...state.content,
            education: [...state.content.education, edu]
          }
        })),

      updateEducation: (id, edu) =>
        set((state) => ({
          content: {
            ...state.content,
            education: state.content.education.map((e) =>
              e.id === id ? { ...e, ...edu } : e
            )
          }
        })),

      removeEducation: (id) =>
        set((state) => ({
          content: {
            ...state.content,
            education: state.content.education.filter((e) => e.id !== id)
          }
        })),

      addSkillCategory: (cat) =>
        set((state) => ({
          content: {
            ...state.content,
            skills: [...state.content.skills, cat]
          }
        })),

      updateSkillCategory: (id, categoryName, skills) =>
        set((state) => ({
          content: {
            ...state.content,
            skills: state.content.skills.map((s) =>
              s.id === id ? { ...s, categoryName, skills } : s
            )
          }
        })),

      removeSkillCategory: (id) =>
        set((state) => ({
          content: {
            ...state.content,
            skills: state.content.skills.filter((s) => s.id !== id)
          }
        })),

      addProject: (proj) =>
        set((state) => ({
          content: {
            ...state.content,
            projects: [...state.content.projects, proj]
          }
        })),

      updateProject: (id, proj) =>
        set((state) => ({
          content: {
            ...state.content,
            projects: state.content.projects.map((p) =>
              p.id === id ? { ...p, ...proj } : p
            )
          }
        })),

      removeProject: (id) =>
        set((state) => ({
          content: {
            ...state.content,
            projects: state.content.projects.filter((p) => p.id !== id)
          }
        })),

      loadSampleData: () => set({ content: INITIAL_RESUME_CONTENT }),

      resetToEmpty: () =>
        set({
          content: {
            personalInfo: { fullName: "", jobTitle: "", email: "", phone: "", location: "" },
            summary: "",
            experience: [],
            education: [],
            skills: [],
            projects: []
          }
        })
    }),
    {
      name: 'ats-resume-builder-store'
    }
  )
);

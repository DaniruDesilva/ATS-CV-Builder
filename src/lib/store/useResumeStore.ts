import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ResumeContent,
  TemplateId,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  ProjectItem,
  CertificationItem,
  AchievementItem,
  ReferenceItem
} from '@/types/resume';

export const DANIRU_SAMPLE_RESUME: ResumeContent = {
  personalInfo: {
    fullName: "DANIRU DE SILVA",
    jobTitle: "Software Engineering Intern",
    email: "daniru.desilva2023@gmail.com",
    phone: "0778231019",
    location: "Galle, Sri Lanka",
    website: "https://danirudesilva.com",
    linkedin: "https://linkedin.com/in/danirudesilva",
    github: "https://github.com/DaniruDesilva"
  },
  summary: "Dedicated IT undergraduate at the University of Moratuwa pursuing a BSc (Hons) in Information Technology (3.55 GPA), with a strong passion for software engineering and full-stack development. Possess proven analytical and problem-solving skills, backed by hands-on experience architecting production web applications, SaaS platforms, and REST APIs using Next.js, Node.js, and Supabase. Seeking a Software Engineering Internship to contribute technical leadership, expand expertise, and build scalable, high-impact software solutions.",
  education: [
    {
      id: "edu-1",
      institution: "University of Moratuwa, Sri Lanka",
      degree: "Bachelor of Science (Honours) in Information Technology",
      fieldOfStudy: "Information Technology",
      location: "Moratuwa, Sri Lanka",
      startDate: "2024",
      endDate: "2028",
      gpa: "Cumulative GPA: 3.55 / 4.0",
      highlights: []
    },
    {
      id: "edu-2",
      institution: "G.C.E. Advanced Level (Biology Stream)",
      degree: "2022 A/L",
      fieldOfStudy: "Biology, Physics, Chemistry",
      location: "Galle, Sri Lanka",
      startDate: "2020",
      endDate: "2022",
      gpa: "Z-Score: 1.8990",
      highlights: ["Galle District Rank: 126 : AAB (Physics, Chemistry, Biology)"]
    }
  ],
  skills: [
    {
      id: "sk-1",
      categoryName: "Programming Languages",
      skills: ["Java", "JavaScript (ES6+)", "TypeScript", "Python", "C", "Dart"]
    },
    {
      id: "sk-2",
      categoryName: "Frontend Technologies",
      skills: ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS"]
    },
    {
      id: "sk-3",
      categoryName: "Backend & APIs",
      skills: ["Node.js", "Express.js", "RESTful APIs", "Next.js Server Actions", "Laravel"]
    },
    {
      id: "sk-4",
      categoryName: "Databases & ORM",
      skills: ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Supabase", "Firestore", "Prisma"]
    },
    {
      id: "sk-5",
      categoryName: "Mobile Development",
      skills: ["Flutter"]
    },
    {
      id: "sk-6",
      categoryName: "Cloud & DevOps",
      skills: ["Docker", "GitHub Actions", "Firebase", "Cloudinary"]
    },
    {
      id: "sk-7",
      categoryName: "Hosting & Deployment",
      skills: ["Vercel", "Render", "cPanel / Shared Hosting", "FTP/SFTP"]
    },
    {
      id: "sk-8",
      categoryName: "UI/UX",
      skills: ["Figma"]
    },
    {
      id: "sk-9",
      categoryName: "Version Control",
      skills: ["Git/GitHub"]
    },
    {
      id: "sk-10",
      categoryName: "Graphic Design",
      skills: ["Canva"]
    }
  ],
  experience: [
    {
      id: "exp-1",
      company: "Delight Consumer Products (Pvt) Ltd.",
      position: "Director & Co-Founder",
      location: "Sri Lanka",
      startDate: "Aug 2025",
      endDate: "Present",
      current: true,
      highlights: [
        "Led business operations, marketing strategy, and full-stack software development by architecting the company’s e-commerce platform with Next.js and PayHere, while managing inventory workflows, team collaboration, and digital brand growth."
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "Delight Consumer Products E-Commerce",
      description: "",
      technologies: ["Next.js", "SQLite", "JWT", "Google OAuth 2.0", "PayHere", "Tailwind CSS"],
      url: "https://delight.lk",
      githubUrl: "https://github.com/DaniruDesilva/delight-ecommerce",
      highlights: [
        "Developed a full-stack e-commerce and business platform featuring product catalogs, secure PayHere payment processing, and inventory management.",
        "Architected the application using Next.js and SQLite, implementing Google OAuth 2.0, JWT authentication, and an administrative dashboard to manage online sales operations."
      ]
    },
    {
      id: "proj-2",
      name: "Guruvaru.LK",
      description: "",
      technologies: ["WordPress", "PHP", "MySQL"],
      url: "https://guruvaru.lk",
      githubUrl: "",
      highlights: [
        "Deployed a nationwide classified directory connecting Sri Lankan students and parents with qualified teachers, tuition institutes, and learning resources.",
        "Implemented localized category filtering, custom search indexing, and automated submission workflows to handle directory listings efficiently."
      ]
    },
    {
      id: "proj-3",
      name: "Zynveo ERP",
      description: "",
      technologies: ["Next.js", "Supabase", "Tailwind CSS"],
      url: "https://zynveo.app",
      githubUrl: "https://github.com/DaniruDesilva/zynveo-erp",
      highlights: [
        "Engineered a cloud-native SaaS ERP solution for retail and FMCG brands, delivering real-time margin calculations, MRP tools, and automated invoice generation.",
        "Implemented dynamic SKU and barcode generation utilities backed by PostgreSQL database schemas and Supabase Row-Level Security for multi-tenant data isolation."
      ]
    },
    {
      id: "proj-4",
      name: "EduPath – Career Planning Platform",
      description: "",
      technologies: ["React", "Node.js", "Express.js", "MongoDB"],
      url: "",
      githubUrl: "https://github.com/DaniruDesilva/edupath",
      highlights: [
        "Designed an AI-based career guidance platform to evaluate academic milestones and generate personalized learning trajectories for students.",
        "Served as Group Leader to architect the full-stack system, implementing role-based access control (RBAC) across Student, Reviewer, and Admin portals."
      ]
    },
    {
      id: "proj-5",
      name: "ATS CV Builder",
      description: "",
      technologies: ["Next.js", "Supabase", "AI APIs"],
      url: "",
      githubUrl: "https://github.com/DaniruDesilva/ats-cv-builder",
      highlights: [
        "Engineered an interactive platform enabling users to build structured, ATS friendly resumes with AI-driven content generation, keyword tailoring, and job description matching.",
        "Implemented a real-time ATS compatibility scoring engine and standardized, machine-readable PDF export functionality to ensure seamless parsing across tracking systems."
      ]
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "University Karate Team Member: 2nd Runner-Up, University Kata Championship (2025)."
    },
    {
      id: "ach-2",
      title: "Member of Mora HIKING Club : University of Moratuwa ( 2025 - Present )"
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Introduction to JAVA, JavaScript, SQL, HTML, CSS, C",
      issuer: "Sololearn",
      credentialId: "CC-NPIIYEYX, CC-2CAT5UNH, CC-KLOD99V5, CC-XQCTO1DK, CC-OAVWGD2N, CC-YUF9O7DI, CC-WUFMRLEL"
    },
    {
      id: "cert-2",
      name: "ReactJS for Beginners, Introduction to IoT",
      issuer: "Simplilearn",
      credentialId: "Certificate code : 6733892, 6721637"
    }
  ],
  references: [
    {
      id: "ref-1",
      name: "MS M.N. Chandimali",
      designation: "Senior Lecturer",
      institution: "Department of Information Technology, University of Moratuwa",
      email: "nipunic@uom.lk"
    }
  ]
};

export const INITIAL_RESUME_CONTENT: ResumeContent = DANIRU_SAMPLE_RESUME;

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
  addEducationHighlight: (eduId: string, highlight: string) => void;
  updateEducationHighlight: (eduId: string, index: number, highlight: string) => void;
  removeEducationHighlight: (eduId: string, index: number) => void;
  
  // Skills
  addSkillCategory: (cat: SkillCategory) => void;
  updateSkillCategory: (id: string, name: string, skills: string[]) => void;
  removeSkillCategory: (id: string) => void;
  
  // Projects
  addProject: (proj: ProjectItem) => void;
  updateProject: (id: string, proj: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;
  addProjectHighlight: (projId: string, highlight: string) => void;
  updateProjectHighlight: (projId: string, index: number, highlight: string) => void;
  removeProjectHighlight: (projId: string, index: number) => void;

  // Certifications
  addCertification: (cert: CertificationItem) => void;
  updateCertification: (id: string, cert: Partial<CertificationItem>) => void;
  removeCertification: (id: string) => void;

  // Achievements
  addAchievement: (ach: AchievementItem) => void;
  updateAchievement: (id: string, ach: Partial<AchievementItem>) => void;
  removeAchievement: (id: string) => void;

  // References
  addReference: (ref: ReferenceItem) => void;
  updateReference: (id: string, ref: Partial<ReferenceItem>) => void;
  removeReference: (id: string) => void;
  
  // Reset / Load Sample
  loadSampleData: () => void;
  resetToEmpty: () => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      title: "Software Engineering Resume",
      templateId: "traditional-ats",
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

      addEducationHighlight: (eduId, highlight) =>
        set((state) => ({
          content: {
            ...state.content,
            education: state.content.education.map((e) =>
              e.id === eduId ? { ...e, highlights: [...(e.highlights || []), highlight] } : e
            )
          }
        })),

      updateEducationHighlight: (eduId, index, highlight) =>
        set((state) => ({
          content: {
            ...state.content,
            education: state.content.education.map((e) => {
              if (e.id !== eduId) return e;
              const newHighlights = [...(e.highlights || [])];
              newHighlights[index] = highlight;
              return { ...e, highlights: newHighlights };
            })
          }
        })),

      removeEducationHighlight: (eduId, index) =>
        set((state) => ({
          content: {
            ...state.content,
            education: state.content.education.map((e) => {
              if (e.id !== eduId) return e;
              return {
                ...e,
                highlights: (e.highlights || []).filter((_, i) => i !== index)
              };
            })
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

      addProjectHighlight: (projId, highlight) =>
        set((state) => ({
          content: {
            ...state.content,
            projects: state.content.projects.map((p) =>
              p.id === projId ? { ...p, highlights: [...(p.highlights || []), highlight] } : p
            )
          }
        })),

      updateProjectHighlight: (projId, index, highlight) =>
        set((state) => ({
          content: {
            ...state.content,
            projects: state.content.projects.map((p) => {
              if (p.id !== projId) return p;
              const newHighlights = [...(p.highlights || [])];
              newHighlights[index] = highlight;
              return { ...p, highlights: newHighlights };
            })
          }
        })),

      removeProjectHighlight: (projId, index) =>
        set((state) => ({
          content: {
            ...state.content,
            projects: state.content.projects.map((p) => {
              if (p.id !== projId) return p;
              return {
                ...p,
                highlights: (p.highlights || []).filter((_, i) => i !== index)
              };
            })
          }
        })),

      // Certifications
      addCertification: (cert) =>
        set((state) => ({
          content: {
            ...state.content,
            certifications: [...(state.content.certifications || []), cert]
          }
        })),

      updateCertification: (id, cert) =>
        set((state) => ({
          content: {
            ...state.content,
            certifications: (state.content.certifications || []).map((c) =>
              c.id === id ? { ...c, ...cert } : c
            )
          }
        })),

      removeCertification: (id) =>
        set((state) => ({
          content: {
            ...state.content,
            certifications: (state.content.certifications || []).filter((c) => c.id !== id)
          }
        })),

      // Achievements
      addAchievement: (ach) =>
        set((state) => ({
          content: {
            ...state.content,
            achievements: [...(state.content.achievements || []), ach]
          }
        })),

      updateAchievement: (id, ach) =>
        set((state) => ({
          content: {
            ...state.content,
            achievements: (state.content.achievements || []).map((a) =>
              a.id === id ? { ...a, ...ach } : a
            )
          }
        })),

      removeAchievement: (id) =>
        set((state) => ({
          content: {
            ...state.content,
            achievements: (state.content.achievements || []).filter((a) => a.id !== id)
          }
        })),

      // References
      addReference: (ref) =>
        set((state) => ({
          content: {
            ...state.content,
            references: [...(state.content.references || []), ref]
          }
        })),

      updateReference: (id, ref) =>
        set((state) => ({
          content: {
            ...state.content,
            references: (state.content.references || []).map((r) =>
              r.id === id ? { ...r, ...ref } : r
            )
          }
        })),

      removeReference: (id) =>
        set((state) => ({
          content: {
            ...state.content,
            references: (state.content.references || []).filter((r) => r.id !== id)
          }
        })),

      loadSampleData: () => set({ content: DANIRU_SAMPLE_RESUME }),

      resetToEmpty: () =>
        set({
          content: {
            personalInfo: { fullName: "", jobTitle: "", email: "", phone: "", location: "", website: "", linkedin: "", github: "" },
            summary: "",
            experience: [],
            education: [],
            skills: [],
            projects: [],
            achievements: [],
            certifications: [],
            references: []
          }
        })
    }),
    {
      name: 'ats-resume-builder-store'
    }
  )
);

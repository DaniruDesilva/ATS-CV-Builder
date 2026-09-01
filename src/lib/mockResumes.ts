import { ResumeContent } from '@/types/resume';
import { DANIRU_SAMPLE_RESUME } from './store/useResumeStore';

export const mockResume1: ResumeContent = DANIRU_SAMPLE_RESUME;


export const mockResume2: ResumeContent = {
  personalInfo: {
    fullName: 'Aiden Williams',
    jobTitle: 'Senior Project Manager | Treasury & Expense Management',
    email: 'help@enhancv.com',
    phone: '+1-(234)-555-1234',
    location: 'Columbus, OH',
    linkedin: 'linkedin.com/in/',
    github: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' // Using github field as a hack for avatar URL
  },
  summary: 'Accomplished Senior Project Manager with over 8 years of experience in leading high-priority treasury and expense management initiatives. Proficient in PeopleSoft Cash Management, project budgeting, and implementing technology solutions. Noted for the achievement in driving a key project that reduced operational expenses by 15%.',
  experience: [
    {
      id: '1',
      position: 'Senior Project Manager - Treasury Systems',
      company: 'JPMorgan Chase',
      location: 'Columbus, OH',
      startDate: '11/2018',
      endDate: 'Present',
      current: true,
      highlights: [
        'Oversaw the strategic implementation of an enterprise-wide Expense Management system, affecting 10,000+ employees.',
        'Managed cross-functional teams to deliver four critical treasury projects within a 12-month period ahead of schedule.',
        'Drove process optimization using Lean Six-Sigma methodologies yielding a 20% increase in efficiency.'
      ]
    },
    {
      id: '2',
      position: 'Treasury Systems Analyst',
      company: 'Nationwide Insurance',
      location: 'Columbus, OH',
      startDate: '06/2014',
      endDate: '10/2017',
      current: false,
      highlights: [
        'Led a successful upgrade of the PeopleSoft Cash Management module which improved transaction handling capacity by 25%.',
        'Conducted in-depth business process analyses that culminated in a standardized procedure adopted by 3 departments.'
      ]
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Master of Science in Finance',
      fieldOfStudy: '',
      institution: 'Ohio State University',
      startDate: '01/2007',
      endDate: '01/2009'
    }
  ],
  skills: [
    { id: '1', categoryName: 'Key Achievements', skills: ['Enterprise-Wide System Implementation', 'Process Efficiency Optimization', 'Risk Management Framework Development', 'Financial Analytics Dashboard Creation'] },
    { id: '2', categoryName: 'Skills', skills: ['Project Management', 'Business Process Improvement', 'PeopleSoft Cash Management', 'Expense Management', 'Data Analytics', 'Risk Management'] },
    { id: '3', categoryName: 'Passions', skills: ['Financial Market Analysis'] }
  ],
  projects: []
};

export const mockResume3: ResumeContent = {
  personalInfo: {
    fullName: 'Maeve Delaney',
    jobTitle: 'Strategic Sourcing Leader | Procurement Specialist | Team Management',
    email: 'help@enhancv.com',
    phone: '+1-234-555-1234',
    location: 'Charlotte, North Carolina',
    linkedin: 'linkedin.com',
    github: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  summary: 'Dynamic procurement specialist with over 5 years of experience in strategic sourcing and team management. Highly skilled in supply chain optimization and developing category strategies. Proven leader with an MBA and a solid track record in transformative sourcing initiatives, delivering significant cost savings and operational efficiencies.',
  experience: [
    {
      id: '1',
      position: 'Senior Sourcing Manager',
      company: 'Premier Inc.',
      location: 'Charlotte, NC',
      startDate: '06/2018',
      endDate: 'Present',
      current: true,
      highlights: [
        'Developed and executed category strategy for medical supplies, reducing annual costs by 15% through strategic supplier consolidation.',
        'Led cross-functional teams in the successful negotiation of complex service contracts, yielding a 20% improvement in service level agreements.',
        'Implemented a supplier performance management system, enhancing supplier quality and compliance, and resulting in a 10% increase in supplier scorecard performance.'
      ]
    },
    {
      id: '2',
      position: 'Category Manager',
      company: 'Honeywell',
      location: 'Fort Mill, SC',
      startDate: '01/2015',
      endDate: '05/2018',
      current: false,
      highlights: [
        'Executed multi-year growth plans for the electronics category, delivering a sustained 10% year-over-year cost reduction.',
        'Conducted extensive market trends analysis leading to the early identification of cost-saving opportunities.'
      ]
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Master of Business Administration',
      fieldOfStudy: '',
      institution: 'Duke University',
      startDate: '01/2007',
      endDate: '01/2009'
    }
  ],
  skills: [
    { id: '1', categoryName: 'Key Achievements', skills: ['Implemented Supplier Performance Management System', 'Managed $500M Indirect Spend Portfolio', 'Achieved 15% Annual Cost Savings'] },
    { id: '2', categoryName: 'Courses', skills: ['Certified Professional in Supply Management'] }
  ],
  projects: []
};

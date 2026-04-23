export interface UserProfile {
  id?: string;
  clerk_user_id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  portfolio_url: string;
  summary: string;
  interested_roles: string[];
  preferred_locations: string[];
  experience_levels: string[];
  company_sizes: string[];
  interested_industries: string[];
  excluded_industries: string[];
  skills: string[];
  excluded_skills: string[];
  min_salary: number;
  leadership_preference: string;
  work_history: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
  location: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  gpa?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Application {
  id?: string;
  clerk_user_id: string;
  company_name: string;
  job_title: string;
  job_url?: string;
  job_description?: string;
  status: ApplicationStatus;
  match_score?: number;
  notes?: string;
  applied_date?: string;
  created_at?: string;
  updated_at?: string;
}

export type ApplicationStatus =
  | 'not_submitted'
  | 'submitted'
  | 'received_initial_response'
  | 'interview_requested'
  | 'onsite_interview_requested'
  | 'offer_received'
  | 'rejected'
  | 'rejected_after_interview'
  | 'withdrawn';

export interface ResumeAnalysis {
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  insights: Insight[];
  overall_assessment: string;
}

export interface Insight {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
}

export interface GeneratedAnswer {
  question: string;
  answer: string;
  tips: string[];
}

export const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bgColor: string; icon: string }> = {
  not_submitted: { label: 'Not Submitted', color: 'text-gray-400', bgColor: 'bg-gray-800', icon: '📝' },
  submitted: { label: 'Submitted', color: 'text-blue-400', bgColor: 'bg-blue-900/30', icon: '📤' },
  received_initial_response: { label: 'Response Received', color: 'text-cyan-400', bgColor: 'bg-cyan-900/30', icon: '📧' },
  interview_requested: { label: 'Interview Requested', color: 'text-violet-400', bgColor: 'bg-violet-900/30', icon: '🎤' },
  onsite_interview_requested: { label: 'Onsite Interview', color: 'text-purple-400', bgColor: 'bg-purple-900/30', icon: '🏢' },
  offer_received: { label: 'Offer Received', color: 'text-emerald-400', bgColor: 'bg-emerald-900/30', icon: '🎉' },
  rejected: { label: 'Rejected', color: 'text-red-400', bgColor: 'bg-red-900/30', icon: '❌' },
  rejected_after_interview: { label: 'Rejected After Interview', color: 'text-orange-400', bgColor: 'bg-orange-900/30', icon: '😔' },
  withdrawn: { label: 'Withdrawn', color: 'text-yellow-400', bgColor: 'bg-yellow-900/30', icon: '🚪' },
};
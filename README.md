# 🚀 CareerCopilot — AI-Powered Job Application Assistant

**Your AI co-pilot to land your dream job.**

CareerCopilot uses AI to analyze resumes, generate tailored answers, scout real jobs, build ATS-friendly resumes, and track every application — so you can focus on what matters: the interview.

🔗 **Live Demo:** [career-copilot-ashen.vercel.app](https://career-copilot-ashen.vercel.app)

---

## ✨ Features

### 🔍 Resume Analyzer
- Paste your resume and a job description
- AI calculates a **match score (0-100)** with detailed breakdown
- Shows **matched skills**, **missing skills**, and **actionable insights**
- **Autofill from profile** — one click loads your profile data as a formatted resume
- Thumbs up/down feedback saved to database

### 📝 Resume Builder
- Visual editor with **live preview** side-by-side
- **3 professional templates**: Classic, Modern, Minimal
- Edit/Preview toggle — preview expands to full width
- **Real ATS scoring** powered by AI (0-100 with breakdown)
- **Export as .txt** or **Print/Save as PDF** via browser
- Auto-loads data from your profile

### ✉️ Cover Letter Generator
- Paste a job description + company name
- AI generates a **personalized cover letter** using your profile data
- Copy to clipboard or download
- Editing supported before copying

### 🔗 Import Jobs from Anywhere
- Paste any job URL — AI extracts title, company, skills, description
- **Fallback manual paste** if URL can't be scraped
- One click to **add to Application Tracker**
- One click to **load into Resume Analyzer**

### 🔍 Job Scout
- AI scouts **real jobs** from multiple free job APIs:
  - [Remotive](https://remotive.com)
  - [Arbeitnow](https://arbeitnow.com)
  - [Himalayas](https://himalayas.app)
- Each job gets an AI **match score** based on your profile
- **"Why this matches you"** explanation for each job
- Apply directly on the original job board
- Save to tracker or analyze resume match in one click
- **Dashboard widget** shows top 4 suggested jobs

### ✍️ Answer Generator
- Select from **common interview questions** or add custom ones
- **AI extracts relevant questions** from the job description automatically
- Generates **personalized answers** using your profile + job context
- Edit, copy, and rate each answer
- Delivery tips included with each answer

### 📋 Application Tracker
- Full **visual pipeline**: Not Submitted → Submitted → Response → Interview → Offer
- Pipeline counts with click-to-filter
- Update status with dropdown selector
- Track match scores, notes, and application dates
- Add, edit, and delete applications

### 👤 Profile & Autofill
- **5-tab profile page**: Autofill, Basic Info, Experience, Education, Preferences
- **Autofill tab**: Quick-copy any field for pasting into application forms
- **Preferences tab**: Edit roles, locations, experience level, company size, skills, salary
- Work history and education with add/remove modals
- All data syncs to Resume Builder and AI features

### 🧭 Onboarding Wizard
- **8-step guided setup** matching the assignment screenshots:
  1. Basic Information
  2. Interested Roles (select up to 5)
  3. Preferred Locations (multi-select by country)
  4. Experience Level (select up to 2)
  5. Company Size preferences
  6. Industries (interested + excluded)
  7. Skills (with custom skill input)
  8. Salary Expectations (slider + presets)
- Progress bar with step titles
- Skip option for non-critical steps
- Profile saved to database on completion

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | Full-stack React framework |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS v4 | Utility-first CSS |
| **Animation** | Framer Motion | Page transitions & micro-interactions |
| **Auth** | Clerk | Authentication & user management |
| **Database** | Supabase (PostgreSQL) | User profiles, applications, feedback |
| **AI/LLM** | Groq (llama-3.3-70b-versatile) | Resume analysis, answer generation, job scoring |
| **Job APIs** | Remotive, Arbeitnow, Himalayas | Real job listings |
| **Hosting** | Vercel | Serverless deployment |

---

## 🗄️ Database Schema

### `user_profiles`
Stores user profile data, work history, education, and preferences.

### `applications`
Tracks job applications with status pipeline:
`not_submitted` → `submitted` → `received_initial_response` → `interview_requested` → `onsite_interview_requested` → `offer_received` / `rejected` / `withdrawn`

### `resume_analyses`
Stores resume analysis results (match score, skills, insights).

### `feedback`
Stores thumbs up/down feedback for AI features.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Free accounts on: [Clerk](https://clerk.com), [Supabase](https://supabase.com), [Groq](https://console.groq.com)

### 1. Clone the repository
```bash
git clone https://github.com/CHR1X7/CareerCopilot.git
cd CareerCopilot

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Free accounts on: [Clerk](https://clerk.com), [Supabase](https://supabase.com), [Groq](https://console.groq.com)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/CareerCopilot.git
cd CareerCopilot
2. Install dependencies
Bash

npm install
3. Set up environment variables
Create .env.local:

env

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyxxxxx

# Groq AI
GROQ_API_KEY=gsk_xxxxx
4. Set up Supabase database
Run this SQL in Supabase SQL Editor:

SQL

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  summary TEXT,
  interested_roles TEXT[] DEFAULT '{}',
  preferred_locations TEXT[] DEFAULT '{}',
  experience_levels TEXT[] DEFAULT '{}',
  company_sizes TEXT[] DEFAULT '{}',
  interested_industries TEXT[] DEFAULT '{}',
  excluded_industries TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  excluded_skills TEXT[] DEFAULT '{}',
  min_salary INTEGER DEFAULT 0,
  leadership_preference TEXT DEFAULT 'no_preference',
  work_history JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_url TEXT,
  job_description TEXT,
  status TEXT DEFAULT 'not_submitted',
  match_score INTEGER,
  notes TEXT,
  applied_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resume_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  job_description TEXT NOT NULL,
  resume_text TEXT NOT NULL,
  match_score INTEGER NOT NULL,
  matched_skills TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  insights JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  feature TEXT NOT NULL,
  rating TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE resume_analyses DISABLE ROW LEVEL SECURITY;
ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;
5. Run locally
Bash

npm run dev
Open http://localhost:3000

🌐 Deployment (Vercel)
1. Push to GitHub
Bash

git add .
git commit -m "initial commit"
git push origin main
2. Deploy on Vercel
Go to vercel.com → Import your GitHub repo
Add all environment variables from .env.local
Deploy — Vercel auto-detects Next.js
3. Configure Clerk
Go to dashboard.clerk.com
Add your Vercel URL to Domains
Set redirect paths under Paths
📊 API Routes
Method	Endpoint	Description
GET	/api/users	Get current user's profile
POST	/api/users	Create/update profile
GET	/api/users/[userId]	Get specific user profile
PATCH	/api/users/[userId]	Update specific user profile
POST	/api/resume/analyze	Analyze resume vs job description
POST	/api/resume/ats-score	Calculate ATS-friendliness score
POST	/api/generate/answer	Generate tailored interview answers
POST	/api/generate/cover-letter	Generate personalized cover letter
POST	/api/generate/questions	Extract questions from job description
GET/POST/PATCH/DELETE	/api/applications	CRUD for job applications
POST	/api/import-job	Extract job details from URL or text
POST	/api/jobs/scout	Scout real jobs matching user profile
POST	/api/feedback	Save user feedback on AI features
GET	/api/health	Health check for all services

🔑 Key Concepts
Concept	Implementation
AI Agent	Resume Analyzer, Answer Generator — perceive context, reason, act
LLM	Groq llama-3.3-70b — fast inference for all AI features
Prompt Engineering	Structured JSON outputs, role-based system prompts
Tool Use	Web fetching (job import), database queries (profile lookup)
Structured Output	All AI responses forced into JSON schema
Agentic UX	Loading states, edit/reject suggestions, feedback collection
👥 Team Roles Covered
Role	Deliverables
Frontend	Full UI/UX, onboarding wizard, all dashboard pages, responsive design
Backend	REST API, database schemas, authentication, logging, error handling
Data Science	AI agents (resume scorer, answer generator, job matcher, ATS scorer), prompt engineering
📝 License
This project was built as part of the PM Accelerator AI Project Assignment.

🙏 Acknowledgments
Clerk for authentication
Supabase for database
Groq for blazing-fast AI inference
Remotive, Arbeitnow, Himalayas for job listings
Vercel for hosting
Tailwind CSS for styling
Framer Motion for animations


---

Replace `YOUR_USERNAME` in the clone URL with your actual GitHub username. Also replace the placeholder screenshot images with real screenshots of your deployed app — you can take them and upload to your GitHub repo's `public/` folder or use a service like imgur.
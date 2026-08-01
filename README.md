# AI Recruitment Agent

## Overview

AI Recruitment Agent is an AI-powered hiring automation platform that
streamlines the recruitment lifecycle. HR only creates a job opening,
while multiple AI agents automate resume screening, personalized
assessments, candidate evaluation, and communication. HR always has
final approval before any hiring decision or email is sent.

------------------------------------------------------------------------

# Core Features

-   AI-powered resume screening
-   AI-generated personalized assessments
-   Resume-to-job matching
-   Automated candidate ranking
-   Online assessment portal
-   AI evaluation of MCQs, coding, and subjective answers
-   HR dashboard
-   AI-generated interview and rejection emails
-   Role-based access control (RBAC)
-   Multi-user HR management

------------------------------------------------------------------------

# Complete Workflow

``` text
                                  HR Admin
                                     │
                                     ▼

                                     
                           Create Job Opening (JD)
                                     │
                                     ▼
                         AI Recruitment Platform
                                     │
      ┌──────────────────────────────┴──────────────────────────────┐
      ▼                                                             ▼
 Store Job Description                                  Start AI Agents
                                                                    │
                                                       Monitor Company Inbox
                                                                    │
                                                       Detect Resume Emails
                                                                    │
                                                          Parse Resume
                                                                    │
                                                   Extract Skills & Experience
                                                                    │
                                                Compare with Job Description
                                                                    │
                                                  Resume Match & Ranking
                                                                    │
                                                Shortlist Candidates
                                                                    │
                                      Generate Personalized Assessment
                                                                    │
                                                Send Assessment Email
                                                                    │
                                            Candidate Completes Test
                                                                    │
                                                   AI Evaluation
                                                                    │
                                             Generate Candidate Report
                                                                    │
                                                     HR Dashboard
                                                                    │
                                  Review AI Recommendation & Approve
                                                                    │
                                            Interview / Reject Email
```

------------------------------------------------------------------------

# Personalized Assessment Workflow

``` text
Resume
   │
   ▼
Resume Parser
   │
   ├── Skills
   ├── Experience
   ├── Projects
   ├── Certifications
   └── Education
            │
            ▼
Read Job Description
            │
            ▼
AI Assessment Generator
            │
            ├── 40% Common Questions
            │       (Based on Job Description)
            │
            └── 60% Personalized Questions
                    • Resume Skills
                    • Experience
                    • Projects
                    • Technologies Used
                    • Difficulty Level
            │
            ▼
Unique Assessment Link
            │
            ▼
Candidate Takes Test
```

------------------------------------------------------------------------

# Frontend Architecture

``` text
React + TypeScript + Tailwind CSS

Authentication
├── Login
├── Forgot Password
└── Role-based Dashboard

HR Dashboard
├── Jobs
├── Candidates
├── Resume Viewer
├── Candidate Rankings
├── Assessments
├── Analytics
└── Email Approval

Candidate Portal
├── Assessment
├── Coding Editor
├── Timer
└── Submission

Admin Panel
├── User Management
├── Roles & Permissions
├── Audit Logs
└── System Settings
```

------------------------------------------------------------------------

# Backend Architecture

``` text
Django + Django REST Framework

Apps
├── authentication
├── users
├── jobs
├── resumes
├── assessments
├── ai_agents
├── candidates
├── emails
├── analytics
└── permissions

AI Services
├── Inbox Agent
├── Resume Parser Agent
├── Resume Matching Agent
├── Assessment Generator Agent
├── Evaluation Agent
└── HR Assistant Agent

Database
├── Users
├── Roles
├── Permissions
├── Jobs
├── Candidates
├── Resumes
├── Questions
├── Assessments
├── Responses
├── Scores
└── Email Logs
```

------------------------------------------------------------------------

# Role Management (RBAC)

## Super Admin

-   Create companies
-   Create HR Admin accounts
-   Manage all users
-   Configure AI settings
-   View all recruitment data

## HR Admin

-   Create and manage job openings
-   Invite HR users
-   Assign permissions
-   Review candidates
-   Approve interview emails

## HR User (Custom Permissions)

HR Admin can create multiple HR accounts by providing:

-   Name
-   Email
-   Password
-   Department
-   Role
-   Permissions

Example permissions:

-   View Candidates
-   Edit Candidate Status
-   View Assessments
-   Manage Jobs
-   Send Emails
-   Download Resumes
-   Create Reports
-   Manage Interviews
-   View Analytics

Example:

``` text
Sarah
Role: Recruiter

✓ View Candidates
✓ View Reports
✓ Download Resume

✗ Delete Jobs
✗ Edit AI Settings
✗ Manage Users
```

Every user logs into the platform using their own credentials and only
sees the modules they have permission to access.

------------------------------------------------------------------------

# Technology Stack

Frontend - React - TypeScript - Tailwind CSS

Backend - Django - Django REST Framework - Celery (background jobs) -
Redis

Database - PostgreSQL

AI - OpenAI / Gemini

Authentication - JWT Authentication

Email - Gmail API / Microsoft Graph API

Deployment - Vercel (Frontend) - Railway / Render (Backend)

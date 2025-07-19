# 🛠️ IronLink CRM

## Overview
IronLink CRM is a modular claims recovery system built for subrogation professionals. Designed for speed, transparency, and operational clarity, it includes features for client onboarding, claims management, workflow analytics, and secure user roles.

## 🚀 Features
- Role-based access for Admins and Employees
- Claims dashboard with filtering, tagging, and audit history
- Secure notes logging and activity tracking
- KPI and analytics module for operational insights
- Priority flagging and stage-based claim workflows
- Scalable React frontend with Express backend

## 🔐 Tech Stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Auth: JWT-based with role middleware
- Database: PostgreSQL (via Render)
- Deployment: Render.com with GitHub integration

## 📦 Installation
```bash
git clone https://github.com/your-org/ironlink-crm.git
cd ironlink-crm
npm install
cp .env.example .env # Fill in your secrets
npm run dev

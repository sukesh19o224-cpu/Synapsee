# Synapse Project Memory

> This file maintains persistent context across AI sessions. Read at start, update at end.

---

## Project Overview

**Name:** Synapse  
**Created:** 2026-01-16  
**Status:** 🟢 MVP Development - Auth Working!

**Description:**  
A unified research reproducibility platform for electrochemistry. Combines electronic lab notebooks, data analysis, document management, and AI-powered search in one webapp.

**Goals:**
1. Solve the research reproducibility crisis in electrochemistry
2. Provide integrated ELN + analysis tools
3. Enable FAIR data management
4. AI-powered experiment search and discovery

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **Backend** | Appwrite Cloud (cloud.appwrite.io) |
| **ELN** | eLabFTW (Docker) |
| **Documents** | ONLYOFFICE DocumentServer |
| **Analysis** | Python (MADAP, impedance.py, NumPy, SciPy) |
| **Search/RAG** | WeKnora |
| **Diagrams** | next-ai-draw-io |

---

## Current Focus

**Active Work:** Frontend + Auth working with Appwrite Cloud  
**Appwrite Project ID:** `696ae54700106da1b1c3`  
**Next Steps:** Set up Appwrite database collections, then features will work

---

## What's Built ✅

### Frontend Pages (12 pages)
- `/` - Landing page ✅
- `/login` - User login ✅ WORKING
- `/register` - User registration ✅ WORKING
- `/dashboard` - Dashboard with stats
- `/dashboard/experiments` - Experiment list
- `/dashboard/experiments/new` - Create experiment form
- `/dashboard/analysis` - Analysis hub
- `/dashboard/analysis/cv` - CV analysis
- `/dashboard/analysis/eis` - EIS analysis
- `/dashboard/documents` - Document management
- `/dashboard/search` - AI search
- `/dashboard/diagrams` - AI diagrams
- `/dashboard/settings` - User settings

### Python Analysis Functions
- `functions/analyze-cv/` - CV peak detection
- `functions/analyze-eis/` - EIS circuit fitting

---

## Session Log

### 2026-01-17 (Session 2) - Auth Working!

- Configured Appwrite Cloud connection
- Created `.env.local` with project ID
- Login/register working ✅
- Created `docs/APPWRITE_SETUP.md`

**BLOCKING:** Need to create database in Appwrite Cloud. See `docs/APPWRITE_SETUP.md`

### 2026-01-17 (Session 1) - MVP Built

- Built 12 frontend pages
- Dashboard, experiments, analysis, documents, search, diagrams, settings
- Python CV and EIS analysis functions
- Docker infrastructure

### 2026-01-16 - Initial Setup

- Created project structure
- Set up AI memory system

---

## To Do Tomorrow

1. Open Appwrite Cloud console (cloud.appwrite.io)
2. Create database: `synapse-db`
3. Create collection: `experiments`
4. Set permissions
5. Create storage bucket: `data-files`
6. Then all features will work!

See: `docs/APPWRITE_SETUP.md` for full instructions

---

## Links

- **Project:** `/run/media/dcode/Storage/Expolre/Synapse`
- **Frontend:** `http://localhost:3000`
- **Appwrite:** `cloud.appwrite.io` (Project: 696ae54700106da1b1c3)

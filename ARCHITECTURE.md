# Synapse Architecture

> Complete system design for the research reproducibility platform.

---

## 🎯 Vision

**Synapse** is a unified webapp that solves research reproducibility by combining:

- Electronic Lab Notebook (ELN)
- Electrochemistry data analysis
- Document understanding & search
- AI-powered assistants
- FAIR data management

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USERS (Researchers)                            │
│                                     │                                       │
│                              Browser (HTTPS)                                │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
┌─────────────────────────────────────▼───────────────────────────────────────┐
│                           REVERSE PROXY (Nginx/Traefik)                     │
│                      SSL Termination, Load Balancing                        │
└───┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬───┘
    │             │             │             │             │             │
    ▼             ▼             ▼             ▼             ▼             ▼
┌───────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│Synapse│   │eLabFTW  │   │ONLYOFFICE│  │WeKnora  │   │MADAP    │   │AI-Drawio│
│Frontend   │(ELN)    │   │DocServer│   │(RAG)    │   │(Analysis)   │(Diagrams)
└───┬───┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
    │            │             │             │             │             │
    └────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
                                      │
                    ┌─────────────────▼─────────────────┐
                    │           APPWRITE               │
                    │   ┌─────────────────────────┐    │
                    │   │ Auth │ DB │ Storage │ Fn │   │
                    │   └─────────────────────────┘    │
                    └─────────────────┬─────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
        ┌─────▼─────┐          ┌──────▼──────┐         ┌──────▼──────┐
        │ PostgreSQL│          │   MariaDB   │         │ File Storage│
        │ (Appwrite)│          │  (eLabFTW)  │         │ (S3/MinIO)  │
        └───────────┘          └─────────────┘         └─────────────┘
```

---

## 📦 Component Details

### 1. Synapse Frontend (Next.js)

| Aspect         | Choice               | Rationale                                  |
| -------------- | -------------------- | ------------------------------------------ |
| **Framework**  | Next.js 14+          | SSR, App Router, integrates with AI-drawio |
| **UI Library** | shadcn/ui + Tailwind | Modern, accessible, customizable           |
| **State**      | Zustand              | Simple, lightweight                        |
| **API Client** | Appwrite SDK         | Native integration                         |

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login, Register
│   ├── (dashboard)/        # Main app
│   │   ├── experiments/    # ELN integration
│   │   ├── analysis/       # MADAP integration
│   │   ├── documents/      # ONLYOFFICE integration
│   │   ├── search/         # WeKnora integration
│   │   └── diagrams/       # AI-drawio integration
│   └── api/                # API routes
├── components/             # Reusable components
├── lib/                    # Utilities, Appwrite client
└── hooks/                  # Custom hooks
```

---

### 2. Appwrite (Backend)

**Docker container providing:**

| Service       | Purpose                        |
| ------------- | ------------------------------ |
| **Auth**      | User accounts, sessions, OAuth |
| **Database**  | Experiments metadata, settings |
| **Storage**   | Data files, PDFs, images       |
| **Functions** | Python scripts for analysis    |
| **Realtime**  | Live collaboration updates     |

**Collections (Database Schema):**

```
┌─────────────────────────────────────────────────────────────────┐
│                        APPWRITE DATABASE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  users                    projects                              │
│  ├── $id                  ├── $id                               │
│  ├── email                ├── name                              │
│  ├── name                 ├── description                       │
│  ├── role                 ├── owner_id → users.$id              │
│  └── created_at           └── created_at                        │
│                                                                 │
│  experiments              data_files                            │
│  ├── $id                  ├── $id                               │
│  ├── title                ├── experiment_id → experiments.$id   │
│  ├── project_id           ├── filename                          │
│  ├── template_type        ├── file_path (Storage)               │
│  ├── elabftw_id (link)    ├── file_type (CV, EIS, etc.)         │
│  ├── metadata (JSON)      ├── metadata (JSON)                   │
│  ├── status               └── uploaded_at                       │
│  └── created_at                                                 │
│                                                                 │
│  analyses                 documents                             │
│  ├── $id                  ├── $id                               │
│  ├── experiment_id        ├── project_id                        │
│  ├── type (CV, EIS, etc.) ├── title                             │
│  ├── input_files[]        ├── file_path                         │
│  ├── output (JSON)        ├── onlyoffice_key                    │
│  ├── plots[] (Storage)    └── created_at                        │
│  └── created_at                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3. eLabFTW (Electronic Lab Notebook)

**Integration Strategy:** Embed via iframe + REST API

| Integration Point      | How                                     |
| ---------------------- | --------------------------------------- |
| **View experiments**   | iframe embed in Synapse                 |
| **Create experiments** | API call from Synapse                   |
| **Link data files**    | Store eLabFTW experiment ID in Appwrite |
| **Single Sign-On**     | SAML/LDAP or API token sync             |

**Docker:** `elabftw/elabimg`

---

### 4. ONLYOFFICE DocumentServer

**Integration:** JavaScript API embed

```javascript
// Embed ONLYOFFICE editor
new DocsAPI.DocEditor("editor", {
  document: {
    fileType: "xlsx",
    url: "https://synapse.local/files/data.xlsx",
  },
  editorConfig: {
    callbackUrl: "https://synapse.local/api/onlyoffice/callback",
  },
});
```

**Docker:** `onlyoffice/documentserver`

---

### 5. MADAP + impedance.py (Analysis Engine)

**Integration:** Appwrite Functions (Python)

```python
# Appwrite Function: analyze_cv
from madap.voltammetry import Voltammetry

def main(context):
    # Get file from Appwrite Storage
    file_data = storage.get_file_download(bucket_id, file_id)

    # Run MADAP analysis
    cv = Voltammetry(file_data)
    results = cv.analyze()

    # Return results
    return context.res.json(results)
```

| Analysis Type      | Tool                 | Output                            |
| ------------------ | -------------------- | --------------------------------- |
| Cyclic Voltammetry | MADAP                | Peak currents, potentials, plots  |
| EIS                | MADAP + impedance.py | Nyquist, Bode, equivalent circuit |
| Arrhenius          | MADAP                | Activation energy                 |

---

### 6. WeKnora (RAG Document Understanding)

**Integration:** REST API

| Endpoint               | Purpose                  |
| ---------------------- | ------------------------ |
| `POST /upload`         | Index documents/papers   |
| `POST /query`          | Ask questions about data |
| `GET /knowledge-graph` | Visualize connections    |

**Docker:** `docker-compose` from WeKnora repo

---

### 7. next-ai-draw-io (AI Diagrams)

**Integration:** Embed or link

| Option               | Pros         | Cons               |
| -------------------- | ------------ | ------------------ |
| **Embed iframe**     | Seamless UX  | Complex state sync |
| **Link out**         | Simple       | Context switch     |
| **Fork & integrate** | Full control | Maintenance burden |

**Recommendation:** Start with link, later iframe embed

---

## 🔄 Data Flow

### Experiment Workflow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         USER WORKFLOW                                    │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 1. CREATE EXPERIMENT                                                     │
│    User selects template (CV, EIS, Battery Test)                         │
│    → Creates in eLabFTW via API                                          │
│    → Stores reference in Appwrite                                        │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 2. UPLOAD DATA                                                           │
│    User uploads .mpt, .dta, .csv files                                   │
│    → Stored in Appwrite Storage                                          │
│    → Linked to experiment                                                │
│    → Auto-detected file type                                             │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 3. ANALYZE                                                               │
│    User clicks "Analyze" → selects analysis type                         │
│    → Appwrite Function triggers MADAP/impedance.py                       │
│    → Results stored in Appwrite                                          │
│    → Plots generated and displayed                                       │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 4. DOCUMENT                                                              │
│    User writes report in ONLYOFFICE                                      │
│    → AI diagrams generated from methods                                  │
│    → Linked to experiment                                                │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 5. SEARCH & DISCOVER                                                     │
│    User asks "What were my best CV results?"                             │
│    → WeKnora searches all experiments                                    │
│    → Returns relevant data with citations                                │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 6. EXPORT (FAIR)                                                         │
│    User exports experiment package                                       │
│    → echemdb format for FAIR compliance                                  │
│    → DOI minted (optional, via Zenodo)                                   │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🐳 Docker Architecture

```yaml
# docker-compose.yml structure
version: "3.8"

services:
  # === CORE INFRASTRUCTURE ===
  traefik: # Reverse proxy
  appwrite: # Backend
  mariadb: # Appwrite DB
  redis: # Appwrite cache

  # === SYNAPSE FRONTEND ===
  synapse-web: # Next.js app

  # === INTEGRATED SERVICES ===
  elabftw: # ELN
  elabftw-mysql: # eLabFTW database

  onlyoffice: # Document editor

  weknora: # RAG engine
  weknora-vectordb: # Vector database

  madap-api: # Analysis API (custom)

  # === STORAGE ===
  minio: # S3-compatible storage

networks:
  synapse-network:
    driver: bridge

volumes:
  appwrite-data:
  elabftw-data:
  minio-data:
  weknora-data:
```

---

## 🌐 URL Structure

| Path             | Service                  | Description           |
| ---------------- | ------------------------ | --------------------- |
| `/`              | synapse-web              | Dashboard             |
| `/experiments/*` | synapse-web + eLabFTW    | Experiment management |
| `/analysis/*`    | synapse-web + MADAP      | Data analysis         |
| `/documents/*`   | synapse-web + ONLYOFFICE | Document editing      |
| `/search/*`      | synapse-web + WeKnora    | AI search             |
| `/diagrams/*`    | synapse-web + ai-drawio  | Diagram creation      |
| `/api/*`         | Appwrite                 | Backend API           |
| `/elabftw/*`     | eLabFTW                  | ELN (proxied)         |
| `/onlyoffice/*`  | ONLYOFFICE               | Editor (proxied)      |

---

## 🔐 Security

| Layer               | Implementation                       |
| ------------------- | ------------------------------------ |
| **HTTPS**           | Let's Encrypt via Traefik            |
| **Auth**            | Appwrite (JWT, sessions)             |
| **CORS**            | Configured per service               |
| **Rate Limiting**   | Traefik middleware                   |
| **Data Encryption** | At rest (storage) + in transit (TLS) |

---

## 📱 UI/UX Design

### Main Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🧠 SYNAPSE                           🔍 Search...          👤 Profile  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │          │  │          │  │          │  │          │  │          │  │
│  │  📋 ELN  │  │ 📊 Analyze│  │ 📄 Docs │  │ 🔍 Search│  │ 📐 Draw  │  │
│  │          │  │          │  │          │  │          │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  RECENT EXPERIMENTS                                          [+ New]   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📁 CV Study - Li-ion Battery    │ Today      │ ✅ Analyzed      │   │
│  │ 📁 EIS - Solid Electrolyte      │ Yesterday  │ 🔄 In Progress   │   │
│  │ 📁 GITT - Diffusion Coeff       │ 3 days ago │ 📝 Draft         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  QUICK STATS                                                           │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │    127     │ │     45     │ │     23     │ │      8     │          │
│  │ Experiments│ │ Data Files │ │  Analyses  │ │  Reports   │          │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Analysis View

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back    CV Analysis: Li-ion Battery Study                  [Export] │
├────────────────────────────────────┬────────────────────────────────────┤
│                                    │                                    │
│           CV PLOT                  │         PARAMETERS                 │
│    ┌───────────────────────┐       │  ┌─────────────────────────────┐  │
│    │                       │       │  │ Scan Rate: 50 mV/s          │  │
│    │      ╱╲               │       │  │ Potential: -0.5 to 1.0 V    │  │
│    │     ╱  ╲              │       │  │ Cycles: 10                  │  │
│    │    ╱    ╲             │       │  └─────────────────────────────┘  │
│    │   ╱      ╲            │       │                                    │
│    │  ╱        ╲           │       │         RESULTS                    │
│    │ ╱──────────╲          │       │  ┌─────────────────────────────┐  │
│    │╱            ╲_____    │       │  │ Peak Anodic: 0.45 V         │  │
│    └───────────────────────┘       │  │ Peak Cathodic: 0.32 V       │  │
│       Potential (V) →              │  │ ΔEp: 130 mV                 │  │
│                                    │  │ Ip,a: 2.34 mA               │  │
│  [Download Plot] [Interactive]     │  │ Ip,c: -2.21 mA              │  │
│                                    │  └─────────────────────────────┘  │
│                                    │                                    │
│                                    │  [Run Analysis] [Save to ELN]     │
├────────────────────────────────────┴────────────────────────────────────┤
│  📁 Files: cv_data.mpt │ cv_data_analyzed.json │ cv_plot.png           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack Summary

| Layer          | Technology                                         |
| -------------- | -------------------------------------------------- |
| **Frontend**   | Next.js 14, React, TypeScript, Tailwind, shadcn/ui |
| **Backend**    | Appwrite (Auth, DB, Storage, Functions)            |
| **ELN**        | eLabFTW (PHP, MariaDB)                             |
| **Documents**  | ONLYOFFICE DocumentServer                          |
| **Analysis**   | Python (MADAP, impedance.py, NumPy, Matplotlib)    |
| **RAG/Search** | WeKnora (Vector DB, LLM)                           |
| **Diagrams**   | next-ai-draw-io                                    |
| **Storage**    | MinIO (S3-compatible)                              |
| **Proxy**      | Traefik                                            |
| **Containers** | Docker, Docker Compose                             |

---

## 📅 Build Phases

### Phase 1: Foundation (Weeks 1-2)

- [ ] Set up Docker infrastructure
- [ ] Deploy Appwrite
- [ ] Create Next.js frontend skeleton
- [ ] Basic auth flow

### Phase 2: Core Features (Weeks 3-4)

- [ ] Integrate eLabFTW
- [ ] Build experiment management UI
- [ ] File upload to storage
- [ ] Basic experiment linking

### Phase 3: Analysis (Weeks 5-6)

- [ ] Deploy MADAP as Appwrite Function
- [ ] CV analysis pipeline
- [ ] EIS analysis pipeline
- [ ] Plot generation

### Phase 4: Documents (Weeks 7-8)

- [ ] Integrate ONLYOFFICE
- [ ] Document-experiment linking
- [ ] next-ai-draw-io integration

### Phase 5: Intelligence (Weeks 9-10)

- [ ] Deploy WeKnora
- [ ] Index experiments
- [ ] AI search interface

### Phase 6: Polish (Weeks 11-12)

- [ ] FAIR export (echemdb format)
- [ ] Performance optimization
- [ ] Testing & bug fixes
- [ ] Documentation

---

## 📁 Repository Structure

```
Synapse/
├── .agent/                    # AI workflow files
├── docker/                    # Docker configurations
│   ├── docker-compose.yml     # Main compose file
│   ├── traefik/               # Proxy config
│   ├── appwrite/              # Appwrite config
│   └── services/              # Service-specific configs
├── frontend/                  # Next.js application
│   ├── src/
│   ├── public/
│   └── package.json
├── functions/                 # Appwrite Functions
│   ├── analyze-cv/
│   ├── analyze-eis/
│   └── export-fair/
├── docs/                      # Documentation
├── ARCHITECTURE.md            # This file
├── PROBLEM_ANALYSIS.md
├── TOOL_EVALUATION.md
└── README.md
```

# Synapse: Complete Tool Repository

> All discovered GitHub tools for building Synapse, organized by category.

---

## 🏆 CORE Tools (Already Selected)

| Tool                | GitHub                        | Purpose                               |
| ------------------- | ----------------------------- | ------------------------------------- |
| **Appwrite**        | `appwrite/appwrite`           | Backend: Auth, DB, Storage, Functions |
| **WeKnora**         | `Tencent/WeKnora`             | RAG document understanding & search   |
| **ONLYOFFICE**      | `ONLYOFFICE/DocumentServer`   | Document editing in browser           |
| **next-ai-draw-io** | `DayuanJiang/next-ai-draw-io` | AI diagram generation                 |

---

## 🔬 Electronic Lab Notebooks (ELN)

| Tool           | GitHub                    | Description                                                                   | Stars |
| -------------- | ------------------------- | ----------------------------------------------------------------------------- | ----- |
| **eLabFTW** ⭐ | `elabftw/elabftw`         | Most popular open-source ELN. Blockchain timestamping, molecule editor, LaTeX | 1k+   |
| **SciNote**    | `scinote-eln/scinote-web` | ELN for life sciences, Ruby on Rails                                          | 500+  |
| **Indigo ELN** | `epam/Indigo-ELN-v.-2.0`  | Chemistry-focused ELN                                                         | 200+  |

**Recommendation:** ⭐ **eLabFTW** - Most mature, specifically designed for research labs

---

## ⚗️ Electrochemistry Analysis Tools

| Tool                | GitHub                     | Features                                                   |
| ------------------- | -------------------------- | ---------------------------------------------------------- |
| **MADAP** ⭐        | `fuzhanrahmanian/MADAP`    | CV, EIS, Arrhenius analysis. GUI + CLI. Nyquist/Bode plots |
| **impedance.py** ⭐ | `ECSHackWeek/impedance.py` | EIS analysis, equivalent circuit fitting, reproducible     |
| **PyEIS**           | `kbknudsen/PyEIS`          | EIS simulator & analyzer. Gamry, BioLogic support          |
| **PySimpleCV**      | `jschneidewind/PySimpleCV` | CV analysis GUI, peak picking, ECSA calculation            |
| **fuelcell**        | `samaygarg10/fuelcell`     | General electrochemical data processing                    |
| **echemdb**         | `echemdb/echemdb`          | FAIR electrochemical data standards                        |

**Recommendation:** ⭐ **MADAP + impedance.py** - Comprehensive analysis coverage

---

## 📊 Visualization & Dashboards

| Tool                | GitHub                | Description                           |
| ------------------- | --------------------- | ------------------------------------- |
| **Apache Superset** | `apache/superset`     | No-code dashboard builder, SQL editor |
| **Plotly Dash**     | `plotly/dash`         | Python analytical web apps            |
| **Streamlit**       | `streamlit/streamlit` | Quick ML/AI dashboards                |
| **Metabase**        | `metabase/metabase`   | BI dashboards                         |

**Recommendation:** For Synapse, use **Plotly** embedded in frontend (not full dashboard platform)

---

## 📁 FAIR Data Management

| Tool          | GitHub                   | Description                                          |
| ------------- | ------------------------ | ---------------------------------------------------- |
| **FAIRshare** | `fairdataihub/FAIRshare` | Desktop app for FAIR data curation                   |
| **data-fair** | `data-fair/data-fair`    | Open/private data management platform                |
| **echemdb**   | `echemdb/echemdb`        | FAIR electrochemical data (integrates with analysis) |

**Recommendation:** ⭐ **echemdb** - Already electrochemistry-focused!

---

## 📝 AI/Writing Tools (Already Selected)

| Tool             | GitHub                   | Purpose             |
| ---------------- | ------------------------ | ------------------- |
| **Deta Surf**    | `deta/surf`              | AI notes from files |
| **WritingTools** | `theJayTea/WritingTools` | Grammar assistant   |
| **Chatterbox**   | `resemble-ai/chatterbox` | TTS (optional)      |

---

## 🆕 NEW Core Tools Discovered

### 1. eLabFTW ⭐⭐⭐⭐⭐ STRONGLY RECOMMENDED

**Repo:** `elabftw/elabftw`  
**What:** Complete electronic lab notebook for research

| Feature                 | Benefit for Synapse                       |
| ----------------------- | ----------------------------------------- |
| Experiment templates    | Standardized electrochemistry experiments |
| Blockchain timestamping | Prove when experiments were done          |
| Molecule editor         | Chemistry-specific                        |
| Scheduler               | Book equipment                            |
| Database for resources  | Store samples, electrodes, solutions      |
| REST API                | Integrate with our app                    |
| Docker deployment       | Easy self-hosting                         |

**Why CORE:** This IS the experiment tracking we need. Don't reinvent!

---

### 2. MADAP ⭐⭐⭐⭐⭐ STRONGLY RECOMMENDED

**Repo:** `fuzhanrahmanian/MADAP`  
**What:** Modular electrochemical analysis platform

| Feature              | Benefit for Synapse                |
| -------------------- | ---------------------------------- |
| Voltammetry analysis | CV peak picking, analysis          |
| EIS analysis         | Nyquist, Bode, equivalent circuits |
| Arrhenius analysis   | Temperature studies                |
| GUI included         | Can run standalone                 |
| Python API           | Integrate into webapp              |

**Why CORE:** Exactly what electrochemists need!

---

### 3. impedance.py ⭐⭐⭐⭐ HIGH

**Repo:** `ECSHackWeek/impedance.py`  
**What:** EIS-focused analysis library

| Feature                    | Benefit               |
| -------------------------- | --------------------- |
| Scikit-learn like API      | Easy to use           |
| Equivalent circuit fitting | Standard EIS analysis |
| Validation tools           | Data quality checks   |

**Why HIGH:** Complements MADAP for deeper EIS work

---

### 4. echemdb ⭐⭐⭐⭐ HIGH

**Repo:** `echemdb/echemdb`  
**What:** FAIR data standards for electrochemistry

| Feature                      | Benefit         |
| ---------------------------- | --------------- |
| Machine-readable data format | Reproducibility |
| Standardized schemas         | Data sharing    |
| DOI support                  | Citable data    |

**Why HIGH:** Makes data FAIR-compliant automatically

---

## 📐 UPDATED Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          SYNAPSE WEBAPP                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐            │
│  │  ONLYOFFICE    │  │  next-ai-drawio│  │  Deta Surf     │            │
│  │  (Docs/Excel)  │  │  (Diagrams)    │  │  (AI Notes)    │            │
│  └───────┬────────┘  └───────┬────────┘  └───────┬────────┘            │
│          │                   │                   │                      │
│  ┌───────▼───────────────────▼───────────────────▼───────────┐         │
│  │                      eLabFTW (ELN)                         │ ← NEW! │
│  │        Experiment tracking, templates, scheduling          │         │
│  └────────────────────────────┬──────────────────────────────┘         │
│                               │                                         │
│  ┌────────────────────────────▼──────────────────────────────┐         │
│  │                  ANALYSIS ENGINE                           │         │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │ ← NEW! │
│  │  │   MADAP     │  │ impedance.py│  │   echemdb   │       │         │
│  │  │   (CV/EIS)  │  │   (EIS)     │  │   (FAIR)    │       │         │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │         │
│  └────────────────────────────┬──────────────────────────────┘         │
│                               │                                         │
│  ┌────────────────────────────▼──────────────────────────────┐         │
│  │                      WeKnora                               │         │
│  │              (RAG Document Understanding)                  │         │
│  └────────────────────────────┬──────────────────────────────┘         │
│                               │                                         │
├───────────────────────────────▼─────────────────────────────────────────┤
│                          APPWRITE                                       │
│              (Backend: Auth, DB, Storage, Functions)                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## ✅ Final Tool List for Synapse

### CORE (Must Have)

| #   | Tool         | Purpose                   |
| --- | ------------ | ------------------------- |
| 1   | **Appwrite** | Backend infrastructure    |
| 2   | **eLabFTW**  | Electronic Lab Notebook   |
| 3   | **MADAP**    | Electrochemistry analysis |
| 4   | **WeKnora**  | Document search & RAG     |

### HIGH Priority

| #   | Tool                | Purpose               |
| --- | ------------------- | --------------------- |
| 5   | **ONLYOFFICE**      | Document editing      |
| 6   | **impedance.py**    | Advanced EIS analysis |
| 7   | **next-ai-draw-io** | AI diagrams           |
| 8   | **echemdb**         | FAIR data standards   |

### MEDIUM Priority

| #   | Tool             | Purpose  |
| --- | ---------------- | -------- |
| 9   | **Deta Surf**    | AI notes |
| 10  | **WritingTools** | Grammar  |

### LOW Priority (Optional)

| #   | Tool           | Purpose |
| --- | -------------- | ------- |
| 11  | **Chatterbox** | TTS     |

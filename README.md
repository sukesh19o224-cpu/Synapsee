# Synapse

> **Research Reproducibility Platform for Electrochemistry**

A unified webapp that solves the reproducibility crisis by combining electronic lab notebooks, data analysis, document management, and AI-powered search.

---

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for development)
- Git

### Run with Docker

```bash
# Clone the repository
git clone https://github.com/yourusername/synapse.git
cd synapse

# Start all services
docker-compose up -d

# Access the app
open http://localhost:3000
```

---

## 📁 Project Structure

```
Synapse/
├── .agent/                    # AI workflow files
├── docker/                    # Docker configurations
│   ├── appwrite/              # Appwrite config
│   ├── elabftw/               # eLabFTW config
│   ├── onlyoffice/            # ONLYOFFICE config
│   ├── traefik/               # Reverse proxy
│   └── weknora/               # WeKnora config
├── frontend/                  # Next.js application
├── functions/                 # Appwrite Functions (Python)
├── docs/                      # Documentation
├── docker-compose.yml         # Main compose file
└── README.md                  # This file
```

---

## 🧩 Features

| Feature                        | Description                                |
| ------------------------------ | ------------------------------------------ |
| **📋 Electronic Lab Notebook** | Track experiments with templates (eLabFTW) |
| **📊 Data Analysis**           | CV, EIS analysis with MADAP                |
| **📄 Document Editing**        | Excel, Word, PDF (ONLYOFFICE)              |
| **🔍 AI Search**               | Ask questions about your data (WeKnora)    |
| **📐 AI Diagrams**             | Generate diagrams from text                |
| **📦 FAIR Export**             | Reproducible data packages                 |

---

## 📚 Documentation

- [Architecture](./ARCHITECTURE.md)
- [Problem Analysis](./PROBLEM_ANALYSIS.md)
- [Tool Evaluation](./TOOL_EVALUATION.md)

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Frontend   | Next.js 14, React, TypeScript, Tailwind |
| Backend    | Appwrite                                |
| ELN        | eLabFTW                                 |
| Analysis   | Python, MADAP, impedance.py             |
| Documents  | ONLYOFFICE DocumentServer               |
| Search     | WeKnora (RAG)                           |
| Containers | Docker, Docker Compose                  |

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

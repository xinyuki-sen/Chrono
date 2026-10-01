<div align="center">

  <img src="assets/robot_icon.png" alt="Chrono Logo" width="96" height="96" style="border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.25);" />

  # Chrono
  ### Autonomous Real-Time AI Intelligence Hub, Research Radar & Tool Directory

  <p align="center">
    <b>Continuous algorithmic surveillance over frontier AI research, open-source weights, and emerging developer tooling.</b>
  </p>

  <p align="center">
    <a href="https://chrono-lime-three.vercel.app/"><img src="https://img.shields.io/badge/Live%20Dashboard-Vercel-black?style=flat-square&logo=vercel&logoColor=white" alt="Live App on Vercel" /></a>
    <a href="https://chrono-1j4d.onrender.com/docs"><img src="https://img.shields.io/badge/API%20Docs-Render-46E3B7?style=flat-square&logo=render&logoColor=black" alt="API on Render" /></a>
    <img src="https://img.shields.io/badge/Next.js-14%20(App%20Router)-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 14" />
    <img src="https://img.shields.io/badge/FastAPI-Python%203.11-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Active%20AI-Gemini%20Flash-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini Flash" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License: MIT" />
  </p>

  <p align="center">
    <a href="#-the-problem--solution">The Problem</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-core-capabilities">Capabilities</a> •
    <a href="#-quickstart">Quickstart</a> •
    <a href="#-configuration--environment">Configuration</a> •
    <a href="#-repository-structure">Structure</a>
  </p>

  <br />

  <a href="https://xinyuki-sen.github.io/chrono/">
    <img src="assets/sidebar_logo.png" alt="Chrono Dashboard Preview" width="85%" style="border-radius: 12px; border: 1px solid #1e2430;" />
  </a>

</div>

---

## ⚡ The Problem & Solution

| The AI Information Crisis | The Chrono Antidote |
| :--- | :--- |
| **Overwhelming Noise**: 500+ research papers, marketing fluff articles, and wrapper tools drop across fragmented platforms daily. | **Algorithmic Signal-to-Noise**: Weighted keyword filtering and high-impact vocabulary scoring surface only breakthrough releases. |
| **Duplicate Articles**: The same announcement is regurgitated by 20 tech blogs, spamming your feeds. | **Deterministic SQLite Deduplication**: Cryptographic post-hashing ensures you never see the same announcement twice. |
| **Fragmented Knowledge**: News lives on Twitter/X, papers on ArXiv, tools on Product Hunt, and concepts in wikis. | **Unified Intelligence Suite**: Aggregates breaking news, verified research, tool directories, model benchmarks, and prompt playbooks under one roof. |
| **Server Costs & Fragile Infra**: Traditional scrapers require persistent VMs, Postgres instances, and monthly cloud bills. | **100% Serverless & Zero-Cost**: Runs hourly on GitHub Actions cron with stateful storage persisted on `gh-pages`. |

---

## 🏗️ System Architecture

Chrono functions as an autonomous, self-healing pipeline that ingests, scores, stores, and broadcasts AI developments every hour without human intervention.

```mermaid
flowchart TD
    subgraph INGESTION ["1. Ingestion Layer (17+ Frontier Feeds)"]
        F1["ArXiv (cs.AI, cs.CL, cs.LG)"]
        F2["Frontier Labs (Google DeepMind, Hugging Face)"]
        F3["Engineering Weblogs (Simon Willison, Latent Space)"]
        F4["Tech Journalism (Ars Technica, MIT Tech Review, TechCrunch)"]
        F5["Community Discussions (Hacker News, r/MachineLearning)"]
        F6["Product Hunt (AI Category)"]
    end

    subgraph ENGINE ["2. Core Processing Engine (ai_news_bot.py)"]
        T["ThreadPoolExecutor (Concurrent Fetching)"]
        D{"Cryptographic Hash in seen_posts.db?"}
        PRUNE["Auto-Prune Posts > 60 Days"]
        K{"Contains Frontier AI Keywords?"}
        S["Source Weighting & Impact Scoring"]
        C["Taxonomy Tagging (Research, LLMs, Vision, Coding, Audio)"]
    end

    subgraph OUTPUTS ["3. Distribution & Storage Layer"]
        DISCORD["Discord Webhook Alerts (Rich Embeds)"]
        JSON_STORE[("Generated JSON Stores (news, tools, models, concepts)")]
        GHA["GitHub Actions CI/CD Deployer"]
        SITE["Static Hub: xinyuki-sen.github.io/chrono/"]
    end

    F1 & F2 & F3 & F4 & F5 & F6 --> T
    T --> D
    D -- "Already Seen" --> PRUNE
    D -- "New Hash" --> K
    K -- "No Match" --> PRUNE
    K -- "Match" --> S
    S --> C
    C --> DISCORD
    C --> JSON_STORE
    JSON_STORE --> GHA
    GHA --> SITE
```

---

## 🚀 Core Capabilities

### 1. 📡 Multi-Source Frontier Radar
- **Academic Research**: Scans ArXiv cs.AI (Artificial Intelligence), cs.CL (Computation and Language / LLMs), and cs.LG (Machine Learning).
- **Frontier Labs**: Direct syndication from Google DeepMind and Hugging Face.
- **Deep Tech Analysis**: Curated blogs from industry leaders including Simon Willison and Latent Space.
- **Video Briefs**: Transcribed and indexed briefings from Two Minute Papers and 3Blue1Brown.

### 2. 🧠 Intelligent Scoring & Taxonomy
- **Relevance Scoring**: Dynamically calculates weight based on authoritative domain reputation (`Google DeepMind` = 3x, `cs.AI` = 3x, `Hacker News` = 2x).
- **Breakthrough Tagging**: High-impact flags trigger when models outperform benchmarks, launch new weights, or advance state-of-the-art inference.
- **Categorization**: News is automatically routed into clean buckets: `Research`, `Frontiers`, `Open Source`, `LLMs`, `Enterprise AI`, `Coding`, and `Engineering`.

### 3. 🛠️ Curated AI Tools Directory
- Hourly extraction from Product Hunt’s AI directory.
- Automated tag classification across 8 distinct professional workflows:
  `Coding` • `Writing` • `Image` • `Video` • `Audio` • `Productivity` • `Research` • `Chatbot/Assistant`

### 4. 🌐 Five-in-One Responsive Web Dashboard
Zero-dependency, high-performance static web suite styled with CSS custom properties (dark/light mode aware, 100/100 Lighthouse performance):
- **`index.html`**: Breaking news feed with instant live text search, category filters, and read-time estimates.
- **`tools.html`**: Filterable tool directory with direct launch links.
- **`models.html`**: Frontier LLM benchmark comparisons and arena rankings.
- **`concepts.html`**: Educational knowledge base explaining core architectures (Transformers, Diffusion, RAG, MoE).
- **`prompts.html`**: Battle-tested prompt engineering patterns.

### 5. 📢 Real-Time Discord Webhook Alerts
High-priority news items are instantly formatted into rich Discord embeds featuring category color-coding, direct citations, and publication timestamps.

---

## 🛠️ Quickstart

### Prerequisites
- Python 3.10+
- Git

### Local Execution in 60 Seconds

```bash
# 1. Clone the repository
git clone https://github.com/xinyuki-sen/ai-news-bot.git chrono
cd chrono

# 2. Install dependencies (ultra-lightweight: only feedparser & requests)
pip install -r requirements.txt

# 3. (Optional) Configure environment variables for Discord alerts
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/your/webhook/url"

# 4. Execute the aggregator
python ai_news_bot.py
```

Open `index.html` in your browser to inspect the freshly generated feed:
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

---

## ⚙️ Configuration & Environment

Chrono is designed to run with **zero required configuration** for local scraping. If Discord alerts or automated deployments are desired, provide the following variables:

| Variable | Type | Description | Required |
| :--- | :--- | :--- | :---: |
| `DISCORD_WEBHOOK_URL` | Secret / String | Webhook endpoint for dispatching breaking news embeds to Discord channels. | Optional |
| `GITHUB_TOKEN` | Secret / String | Default GitHub Actions token used to deploy built static assets to the `gh-pages` branch. | Actions Only |

---

## 🔄 Autonomous CI/CD Pipeline

Chrono uses a stateful, dual-branch Git architecture to remain **100% serverless**:

1. **Hourly Cron Schedule**: GitHub Actions wakes up every 60 minutes (`0 * * * *`).
2. **State Restoration**: The runner fetches `seen_posts.db` from the `gh-pages` branch, ensuring historical deduplication memory persists without cluttering the `main` git commit log.
3. **Scrape & Enrich**: `ai_news_bot.py` runs, updates JSON stores, and posts breaking items to Discord.
4. **Isolated Deploy**: The static HTML pages and updated JSON stores are pushed exclusively to `gh-pages`, serving the live site via GitHub Pages at zero hosting cost.

---

## 📂 Repository Structure

```text
Chrono/
├── assets/                 # Brand logos and iconography
├── backend/                # FastAPI (Python 3.11) autonomous scraper & REST API on Render
│   ├── main.py             # FastAPI endpoints, CORS & APScheduler hourly engine
│   ├── scraper.py          # 7+ RSS pipelines with SHA256 cryptographic dedupe
│   ├── database.py         # Supabase PostgreSQL persistence integration
│   ├── requirements.txt    # Production Python dependencies
│   └── .python-version     # Pinned Python 3.11.9
├── frontend/               # Next.js 14 + Tailwind CSS + TypeScript on Vercel
│   ├── app/                # App Router (Feed, Saved, Prompts, Tools, Models, Concepts)
│   ├── app/api/summarize/  # Active AI Executive TL;DR route (Gemini Flash)
│   ├── components/         # Modern UI components (Sidebar, ArticleCard, RightPanel)
│   ├── lib/api.ts          # Resilient API client with automatic offline fallback
│   └── public/             # Curated models, prompts, tools & concepts datasets
├── legacy_v1/              # Archived Level 1 static single-file HTML implementation
├── .github/                # GitHub Actions & CI/CD workflows
├── start.sh                # 1-click local development startup script
└── README.md               # Master technical documentation
```

---

## 🤝 Contributing

Contributions, feed suggestions, and UI enhancements are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeed`)
3. Commit your Changes (`git commit -m 'feat: add cs.RO robotics feed'`)
4. Push to the Branch (`git push origin feature/NewFeed`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

<div align="center">
  <sub>Engineered by <a href="https://github.com/xinyuki-sen">xinyuki-sen</a> • Powered by open data & serverless automation.</sub>
</div>

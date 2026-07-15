<div align="center">

<a id="top"></a>

```
  ██████╗ ██╗  ██╗    ███╗   ███╗ ██████╗ ██████╗  ██████╗ ██████╗  ██████╗ ███████╗████████╗
 ██╔════╝ ██║  ██║    ████╗ ████║██╔═══██╗██╔══██╗██╔═══██╗██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
 ██║  ███╗███████║    ██╔████╔██║██║   ██║██║  ██║██║   ██║██████╔╝██║   ██║█████╗     ██║   
 ██║   ██║██╔══██║    ██║╚██╔╝██║██║   ██║██║  ██║██║   ██║██╔══██╗██║   ██║██╔══╝     ██║   
 ╚██████╔╝██║  ██║    ██║ ╚═╝ ██║╚██████╔╝██████╔╝╚██████╔╝██║  ██║╚██████╔╝███████╗   ██║   
  ╚═════╝ ╚═╝  ╚═╝    ╚═╝     ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   
```

### 🧠 Intelligent Multi-Model Agent System · Claude Code Architecture

<br>

![Platform](https://img.shields.io/badge/🌐_Platform-Web%20%2B%20Desktop-ff6b9f?style=for-the-badge&logo=node.js&logoColor=white)
![Node](https://img.shields.io/badge/⚡_Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/🔷_TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/⚛️_React-18-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Electron](https://img.shields.io/badge/🖥️_Electron-28-47848f?style=for-the-badge&logo=electron&logoColor=white)
![License](https://img.shields.io/badge/📜_License-MIT-00ff00?style=for-the-badge)

<br>

> *Where multiple AI models collaborate to build complete software — autonomously.*

<br>

[🌐 **Web Version**](#top) · [🖥️ **Desktop Version (EXE)**](../../Mixture-of-Agents-Desktop) · [📦 **中文文档**](#chinese-doc)

---

<a id="toc"></a>

## 📑 Navigate

<div align="center">

| | | | |
|:---:|:---:|:---:|:---:|
| [✨ **Features**](#features) | [🏗 **Architecture**](#architecture) | [🚀 **Quick Start**](#quickstart) | [⚙️ **Config**](#config) |
| [🔌 **API**](#apireference) | [🧪 **Testing**](#modeltesting) | [🧩 **Extensions**](#extension) | [💻 **Languages**](#languages) |
| [🛠 **Dev**](#development) | [📋 **Changelog**](#changelog) | [📄 **License**](#license) | |

</div>

---

<a id="features"></a>

## ✨ Features

<br>

<details open>
<summary><h3>🤖 Multi-Model Collaborative Chat</h3></summary>

<br>

> *The orchestrator doesn't just relay messages — it **thinks**, **plans**, **executes**, and **verifies** your project autonomously.*

| Capability | Description |
|:-----------|:------------|
| 🧠 **Orchestrator Brain** | Analyzes your task, creates step-by-step plans |
| 🔄 **Plan → Act → Observe → Replan** | Loop up to 12 rounds — same core as Claude Code / Codex |
| 🎚️ **Thinking Intensity** | `Low` / `Medium` / `High` / `Auto` — controls rigor per round |
| 🔍 **Verification Agents** | Stateless sub-agents check project completeness each round |
| 📦 **Context Compression** | DeepSeek-style cache-friendly formatting for long conversations |
| ⚡ **SSE Streaming** | Real-time token-by-token progress updates |

</details>

---

<details open>
<summary><h3>🧪 Model Capability Testing</h3></summary>

<br>

> *Automated benchmarking across 8 dimensions — with authority-sourced test banks and time-based scoring.*

| Dimension | What It Tests | Icon |
|:----------|:--------------|:----:|
| **Coding** | Algorithm implementation, data structures | 💻 |
| **Reasoning** | Logical deduction, multi-step chains | 🧠 |
| **Math** | Computation, proofs, formal logic | 🔢 |
| **Creative Writing** | Format compliance, creative constraints | ✍️ |
| **Instruction Following** | Complex command adherence | 📋 |
| **Tool Use** | API calls, structured output parsing | 🛠️ |
| **Multilingual** | Cross-language understanding | 🌐 |
| **Context** | Long context retention, multi-turn memory | 📚 |

<br>

| Metric | Quick Test | Standard Test |
|:-------|:-----------|:--------------|
| ⏱️ Time per question | ~3 min | ~12 min |
| 📊 Score scale | 10 pts / dimension | 10 pts / dimension |
| 🏆 Total possible | 80 / 80 | 80 / 80 |
| 🎯 Scoring | Time linear fit + correctness coeff | Time linear fit + correctness coeff |
| 🖼️ Multimodal | Auto-detect Vision / Audio | Auto-detect Vision / Audio |

</details>

---

<details open>
<summary><h3>🔌 Provider & Model Management</h3></summary>

<br>

> *17 preset providers. 50 keys per provider. 80 concurrent requests per key. Intelligent failover.*

<div align="center">

| Provider | Provider | Provider | Provider |
|:---------|:---------|:---------|:---------|
| 🟢 OpenAI | 🟣 DeepSeek | 🔵 Zhipu AI | 🌙 Moonshot |
| ⚪ SiliconFlow | 🟡 StepFun | 🔥 Volcengine | 💎 MiniMax |
| 🟠 Qwen | 🔴 Baidu | 🔷 iFlytek | 🟤 Baichuan |
| ⚫ LingYiwanWu | 🟢 Tencent | 📱 MiMo | 🟤 Anthropic |
| ⚪ Local / Ollama | | | |

</div>

| Feature | Behavior |
|:--------|:---------|
| 🔄 **Key Rotation** | Automatic round-robin across 50 keys |
| 🚦 **Concurrency Control** | Max 80 per key, auto-switch on limit |
| 🛡️ **Rate Limit Handling** | 429 / 401 / 403 auto-recovery |
| 🔍 **Capability Detection** | Vision / Audio / Multimodal auto-tagging |
| ➕ **Custom Providers** | Any OpenAI-compatible API |

</details>

---

<details open>
<summary><h3>🧩 Extension System</h3></summary>

<br>

> *Pre-configured ecosystems of tools, skills, and expert knowledge — ready to use.*

<div align="center">

| 🔌 MCP Servers | 🎯 Skill Servers | 🧠 Expert Library |
|:--------------:|:-----------------:|:------------------:|
| **28** presets | **27** presets | **15** presets |
| Filesystem | Web Automation | Dev Workflows |
| GitHub | Data Analysis | Code Patterns |
| Database | System Mgmt | Architecture |
| Search | Code Review | Best Practices |
| AI Tools | — | — |

</div>

All extensions: **one-click add → test → enable/disable → delete**

</details>

---

<details open>
<summary><h3>📝 Code Editor</h3></summary>

<br>

> *Monaco Editor — the same engine powering VS Code — with integrated file management and execution.*

| Feature | Description |
|:--------|:------------|
| 📂 **File Tree** | Browse, create, rename, delete files & folders |
| 🎯 **Smart Templates** | Auto-fill for 14 languages |
| 📌 **Change Highlighting** | Real-time visual markers on modified lines |
| ⌨️ **Command Bar** | Shell execution with history |
| ▶️ **One-Click Run** | Execute any supported file instantly |
| 📁 **Project Selector** | Choose any directory as workspace root |

</details>

---

<a id="architecture"></a>

## 🏗 Architecture

<br>

### 📁 Project Structure

```
Mixture-of-Agents/
│
├── frontend/                          🎨  React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx                    ─  Main application (single-file SPA)
│   │   ├── components/
│   │   │   ├── Chat.tsx               ─  Multi-model collaborative chat
│   │   │   ├── Editor.tsx             ─  Monaco code editor
│   │   │   ├── FileTree.tsx           ─  File browser & manager
│   │   │   ├── Testing.tsx            ─  8-dimension model testing
│   │   │   ├── Extensions.tsx         ─  MCP / Skill / Expert UI
│   │   │   └── Settings.tsx           ─  Provider & key management
│   │   ├── services/api.ts            ─  API client with SSE support
│   │   └── types.ts                   ─  TypeScript interfaces
│   └── dist/                          📦  Built output → backend/public
│
├── backend/                           ⚙️  Express.js + TypeScript
│   ├── src/
│   │   ├── index.ts                   ─  Server entry point
│   │   ├── providers/
│   │   │   ├── api-pool.ts            ─  Key rotation, concurrency, failover
│   │   │   └── presets.ts             ─  17 provider configurations
│   │   ├── routes/
│   │   │   ├── chat.ts                ─  🔥 Orchestrator core (1000+ lines)
│   │   │   ├── providers.ts           ─  Provider CRUD + model fetch
│   │   │   ├── testing.ts             ─  8-dimension model benchmarking
│   │   │   ├── extensions.ts          ─  MCP / Skill / Expert mgmt
│   │   │   └── projects.ts            ─  File ops + code execution
│   │   ├── services/
│   │   │   ├── llm-client.ts          ─  Unified LLM client (stream + sync)
│   │   │   └── project-service.ts     ─  Project file operations
│   │   └── types.ts                   ─  Shared type definitions
│   ├── public/                        🌐  Static frontend (Express-served)
│   ├── data/                          💾  Runtime state (pool, extensions)
│   └── dist/                          🔧  Compiled TypeScript
│
└── README.md
```

### 🔄 Orchestration Flow

```
╔══════════════════════════════════════════════════════════════════╗
║                      👤 USER SENDS MESSAGE                      ║
╚════════════════════════════╦═════════════════════════════════════╝
                             ▼
┌────────────────────────────────────────────────────────────────┐
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐           │
│  │THINK │→ │ ACT  │→ │OBSERVE│→│ FIX  │→ │REPEAT│  ×12 max  │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘           │
│                                                                │
│  🧠 Plan   📝 Write   🔍 Check   🔧 Fix   🔄 Loop            │
│           files      errors    errors                        │
└────────────────────────────────┬───────────────────────────────┘
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│  🔍 VERIFY — Stateless sub-agent checks ALL files             │
│  🔧 FIX    — One fix round if issues found                    │
└────────────────────────────────┬───────────────────────────────┘
                                 ▼
╔══════════════════════════════════════════════════════════════════╗
║  ✅ DONE → 📦 Auto-install deps → 🌐 Auto-serve → 🖥️ Open     ║
╚══════════════════════════════════════════════════════════════════╝
```

---

<a id="quickstart"></a>

## 🚀 Quick Start

<br>

<details open>
<summary><h3>📥 Option 1: Clone & Run</h3></summary>

<br>

```bash
# 1️⃣  Clone
git clone https://github.com/bauerelizabeth07139/Mixture-of-Agents.git
cd Mixture-of-Agents

# 2️⃣  Build frontend
cd frontend && npm install && npm run build && cd ..

# 3️⃣  Build backend
cd backend && npm install && npm run build && cd ..

# 4️⃣  Copy frontend → backend
# Windows:
Copy-Item -Path "frontend/dist/*" -Destination "backend/public/" -Recurse -Force
# macOS / Linux:
# cp -r frontend/dist/* backend/public/

# 5️⃣  Launch 🚀
cd backend && npm start

# 🌐 Open → http://localhost:3001
```

</details>

---

<details open>
<summary><h3>🔧 Option 2: Development Mode</h3></summary>

<br>

```bash
# Terminal 1 — Backend (auto-reload on save)
cd backend && npm run dev

# Terminal 2 — Frontend (hot module replacement)
cd frontend && npm run dev
```

</details>

---

<details open>
<summary><h3>🖥️ Option 3: Desktop Version (EXE)</h3></summary>

<br>

> 👉 See **[Mixture-of-Agents-Desktop](../../Mixture-of-Agents-Desktop)** for download or build instructions.

</details>

---

<a id="config"></a>

## ⚙️ Configuration

<br>

### 🌐 Environment Variables

| Variable | Default | Description |
|:---------|:--------|:------------|
| `PORT` | `3001` | Backend server port |

### 🔑 API Key Pool

| Feature | Behavior |
|:--------|:---------|
| 🔄 **Deduplication** | Duplicate keys automatically removed |
| 🚦 **Concurrency** | Max 80 concurrent requests per key |
| ⏭️ **Auto-rotation** | Switches to next key when limit reached |
| 🛡️ **Failover** | 401 / 403 keys automatically removed |
| 💰 **Balance Sorting** | Keys with remaining quota used first |

### 🎚️ Thinking Intensity

| Mode | Verify | Fix | Best For | Speed |
|:-----|:-------|:----|:---------|:------|
| **🔴 High** | Every step | Deep | Complex projects | 🐢 |
| **🟡 Medium** | Every step | Standard | Balanced | 🚶 |
| **🟢 Low** | End only | Minimal | Simple tasks | 🏃 |
| **🔵 Auto** | — | — | Orchestrator decides | ⚡ |

---

<a id="apireference"></a>

## 🔌 API Reference

<br>

### 💬 Chat

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/chat` | `POST` | Send message — **SSE streaming** response |
| `/api/chat/projects` | `GET` | List workspace projects |
| `/api/chat/project-dir` | `GET` | Get project directory path |

### 🔌 Providers

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/providers` | `GET` | List all providers |
| `/api/providers` | `POST` | Create new provider |
| `/api/providers/:id` | `PUT` | Update provider |
| `/api/providers/:id` | `DELETE` | Delete provider |
| `/api/providers/:id/fetch-models` | `POST` | Fetch model list from API |

### 🧪 Models & Testing

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/models` | `GET` | List all discovered models |
| `/api/testing/run` | `POST` | Run model capability test |
| `/api/testing/price` | `POST` | Query model pricing |

### 📁 Projects

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/projects/files` | `GET` | List project files |
| `/api/projects/run` | `POST` | Execute code file |

### 🧩 Extensions

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/extensions/mcp` | `GET` / `POST` | MCP server management |
| `/api/extensions/skill` | `GET` / `POST` | Skill server management |
| `/api/extensions/expert` | `GET` / `POST` | Expert library management |

---

<a id="modeltesting"></a>

## 🧪 Model Testing

<br>

### 📊 Scoring Formula

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Score = Base × TimeFactor × CorrectnessCoefficient        │
│                                                             │
│   Base:        5 points per question                        │
│   TimeFactor:  ≤50% time → 1.0 | >50% → linear decay → 0.4│
│   Correctness: multi-regex partial matching (0.0 – 1.0)    │
│                                                             │
│   Dimension = max(2 questions) = 10 points                  │
│   Total     = max(8 dimensions) = 80 points                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 🏷️ Multimodal Detection

| Tag | How Detected | Color |
|:----|:-------------|:------|
| 🔊 **Audio** | API call with test audio | Green badge |
| 👁️ **Vision** | API call with test image | Blue badge |
| 🎤 **Speech** | Name-based (tts/stt/whisper) | Purple badge |

---

<a id="extension"></a>

## 🧩 Extension System

<br>

<div align="center">

| 🔌 MCP Servers | 🎯 Skill Servers | 🧠 Expert Library |
|:--------------:|:-----------------:|:------------------:|
| **28** presets | **27** presets | **15** presets |

</div>

<br>

<details open>
<summary><h3>🔌 MCP Servers</h3></summary>

<br>

| Category | Servers | Capabilities |
|:---------|:--------|:-------------|
| 📂 **Filesystem** | File I/O, Dir traversal | Read, write, search files |
| 💻 **Code** | GitHub, code search | Git ops, code indexing |
| 🗄️ **Database** | SQLite, PostgreSQL, Redis | Query, schema, migrate |
| 🔍 **Search** | Web, docs, knowledge base | Retrieve, index, rank |
| 🤖 **AI Tools** | Image gen, TTS, STT | Generate, transcribe |

</details>

---

<details open>
<summary><h3>🎯 Skill Servers</h3></summary>

<br>

| Category | Description |
|:---------|:------------|
| 🌐 Web Automation | Browser control, scraping, testing |
| 📊 Data Analysis | CSV, JSON, database analytics |
| ⚙️ System Management | Process, file, network ops |
| 🔍 Code Review | Static analysis, linting, suggestions |

</details>

---

<details open>
<summary><h3>🧠 Expert Library</h3></summary>

<br>

| Template | Use Case |
|:---------|:---------|
| 🏗 Architecture | System design patterns |
| 🔒 Security | Auth, encryption, best practices |
| 📱 Mobile | React Native, Flutter patterns |
| ☁️ DevOps | CI/CD, Docker, K8s |

</details>

---

<a id="languages"></a>

## 💻 Supported Languages

<br>

| Language | Extension | Runner | Category |
|:---------|:----------|:-------|:---------|
| 🐍 Python | `.py` | `python` | Interpreted |
| 🟨 JavaScript | `.js` | `node` | Interpreted |
| 🔷 TypeScript | `.ts` | `npx tsx` | Compiled → JS |
| 🔴 C | `.c` | `gcc` → `./a.out` | Compiled |
| 🔵 C++ | `.cpp` | `g++` → `./a.out` | Compiled |
| 🐹 Go | `.go` | `go run` | Compiled |
| 🦀 Rust | `.rs` | `rustc` → `./main` | Compiled |
| ☕ Java | `.java` | `javac` + `java` | Compiled |
| 💎 Ruby | `.rb` | `ruby` | Interpreted |
| 🐚 Shell | `.sh` | `bash` | Script |
| 🌐 HTML | `.html` | Browser | Markup |
| 🎨 CSS | `.css` | — | Stylesheet |
| 📄 JSON | `.json` | — | Data |
| 📝 Markdown | `.md` | — | Docs |

---

<a id="development"></a>

## 🛠 Development

<br>

### 📋 Prerequisites

| Requirement | Version |
|:------------|:--------|
| 🟢 Node.js | 20+ |
| 📦 npm | 9+ |
| 🖥️ OS | Windows x64 / macOS / Linux |

### 🏗 Tech Stack

| Layer | Technology |
|:------|:-----------|
| 🎨 Frontend | React 18 · TypeScript 5 · Vite · Monaco Editor · xterm.js |
| ⚙️ Backend | Express.js · TypeScript · WebSocket (ws) · Node.js |
| 🖥️ Desktop | Electron 28 |
| 🎨 Styling | CSS Variables · Dark/Light themes |
| 💾 State | React Hooks · localStorage persistence |

### 🔧 Build Commands

```bash
# 🎨 Frontend
cd frontend && npm install && npm run build

# ⚙️ Backend
cd backend && npm install && npm run build

# 📦 Copy frontend → backend
Copy-Item -Path "frontend/dist/*" -Destination "backend/public/" -Recurse -Force

# 🖥️ Desktop EXE
cd Mixture-of-Agents-Desktop && npm run build:all && npx electron-builder --win dir
```

---

<a id="changelog"></a>

## 📋 Changelog

<br>

### 🏷️ v1.0.0 — Latest Release

| Feature | Status | Description |
|:--------|:------:|:------------|
| 🤖 Multi-model chat | ✅ | Orchestrator + sub-agents |
| 🔄 Plan→Act→Observe→Replan | ✅ | Up to 12 rounds |
| 🔍 Verification agents | ✅ | Stateless quality checks |
| 🔌 17 providers | ✅ | API pool with failover |
| 🧪 8-dimension testing | ✅ | 10-point scale |
| 🧩 MCP (28) + Skill (27) + Expert (15) | ✅ | Full extension system |
| 📝 Monaco editor | ✅ | VS Code engine |
| 🖼️ Multimodal detection | ✅ | Vision / Audio auto-tag |
| 📦 Context compression | ✅ | DeepSeek-style caching |
| 🌗 Dark/Light theme | ✅ | Toggle switch |
| 💻 EXE packaging | ✅ | Portable + Installer |

---

<a id="license"></a>

## 📄 License

<br>

```
MIT License © 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software").
```

---

<div align="center">

**🖥️ Desktop (EXE) → [Mixture-of-Agents-Desktop](../../Mixture-of-Agents-Desktop)**

[⬆ Back to Top](#top)

</div>

---
---
---

<a id="chinese-doc"></a>

<div align="center">

# ⚛️ Mixture of Agents — Web

### 🧠 基于 Claude Code 架构的多模型智能代理系统

<br>

![Platform](https://img.shields.io/badge/🌐_平台-Web%20%2B%20桌面-ff6b9f?style=for-the-badge&logo=node.js&logoColor=white)
![Node](https://img.shields.io/badge/⚡_Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/🔷_TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/⚛️_React-18-61dafb?style=for-the-badge&logo=react&logoColor=black)
![License](https://img.shields.io/badge/📜_许可证-MIT-00ff00?style=for-the-badge)

<br>

> *多个 AI 模型协作构建完整软件 —— 全自动。*

<br>

[🌐 **英文版**](#top) · [🖥️ **桌面版 (EXE)**](../../Mixture-of-Agents-Desktop) · [📦 **中文文档**](#chinese-doc)

---

### 📑 导航

| | | | |
|:---:|:---:|:---:|:---:|
| [✨ **核心特性**](#zh-features) | [🏗 **架构说明**](#zh-architecture) | [🚀 **快速开始**](#zh-quickstart) | [⚙️ **配置**](#zh-config) |
| [🔌 **API**](#zh-api) | [🧪 **测试**](#zh-testing) | [🧩 **扩展**](#zh-extensions) | [💻 **语言**](#zh-languages) |
| [🛠 **开发**](#zh-dev) | [📋 **更新日志**](#zh-changelog) | | |

---

<a id="zh-features"></a>

## ✨ 核心特性

<br>

<details open>
<summary><h3>🤖 多模型协作对话</h3></summary>

<br>

> *调控模型不只是转发消息 —— 它自主地 **思考**、**规划**、**执行** 和 **验证*你的项目。*

| 能力 | 说明 |
|:-----|:-----|
| 🧠 **调控大脑** | 分析任务，制定分步计划 |
| 🔄 **计划→执行→观察→重规划** | 循环最多 12 轮 —— 与 Claude Code / Codex 核心一致 |
| 🎚️ **思考强度** | `低` / `中` / `高` / `自动` —— 控制每轮严谨度 |
| 🔍 **验证代理** | 无记忆子代理每轮检查项目完整性 |
| 📦 **上下文压缩** | DeepSeek 风格缓存友好格式 |
| ⚡ **SSE 流式** | 逐 token 实时进度更新 |

</details>

---

<details open>
<summary><h3>🧪 模型能力测试</h3></summary>

<br>

> *跨 8 个维度的自动基准测试 —— 权威题库 + 时间评分。*

| 维度 | 测试内容 | 图标 |
|:-----|:---------|:----:|
| **编码** | 算法实现、数据结构 | 💻 |
| **推理** | 逻辑推导、多步链条 | 🧠 |
| **数学** | 计算、证明、形式逻辑 | 🔢 |
| **创意写作** | 格式遵循、创意约束 | ✍️ |
| **指令遵循** | 复杂命令遵从 | 📋 |
| **工具使用** | API 调用、结构化输出 | 🛠️ |
| **多语言** | 跨语言理解 | 🌐 |
| **上下文** | 长上下文保持、多轮记忆 | 📚 |

<br>

| 指标 | 快速测试 | 标准测试 |
|:-----|:---------|:---------|
| ⏱️ 每题时限 | ~3 分钟 | ~12 分钟 |
| 📊 评分制 | 10 分/维度 | 10 分/维度 |
| 🏆 总分 | 80 / 80 | 80 / 80 |
| 🎯 评分方式 | 时间线性拟合 + 正确系数 | 时间线性拟合 + 正确系数 |
| 🖼️ 多模态 | 自动检测视觉/音频 | 自动检测视觉/音频 |

</details>

---

<details open>
<summary><h3>🔌 提供商与模型管理</h3></summary>

<br>

> *17 个预设提供商。每提供商 50 密钥。单密钥 80 并发。智能故障转移。*

| 提供商 | 提供商 | 提供商 | 提供商 |
|:-------|:-------|:-------|:-------|
| 🟢 OpenAI | 🟣 DeepSeek | 🔵 智谱AI | 🌙 Moonshot |
| ⚪ SiliconFlow | 🟡 StepFun | 🔥 火山引擎 | 💎 MiniMax |
| 🟠 通义千问 | 🔴 百度 | 🔷 讯飞 | 🟤 百川 |
| ⚫ 零一万物 | 🟢 腾讯 | 📱 MiMo | 🟤 Anthropic |
| ⚪ 本地/Ollama | | | |

| 功能 | 行为 |
|:-----|:-----|
| 🔄 **密钥轮换** | 50 个密钥自动轮询 |
| 🚦 **并发控制** | 单密钥 80 上限，自动切换 |
| 🛡️ **限流处理** | 429/401/403 自动恢复 |
| 🔍 **能力探测** | 视觉/音频/多模态自动标签 |
| ➕ **自定义** | 任何 OpenAI 兼容 API |

</details>

---

<details open>
<summary><h3>🧩 扩展系统</h3></summary>

<br>

> *预配置的工具生态、技能环境和专家知识库 —— 开箱即用。*

| 🔌 MCP 服务器 | 🎯 技能服务器 | 🧠 专家库 |
|:--------------:|:--------------:|:---------:|
| **28** 个预设 | **27** 个预设 | **15** 个预设 |
| 文件系统 | Web 自动化 | 开发工作流 |
| GitHub | 数据分析 | 代码模式 |
| 数据库 | 系统管理 | 架构设计 |
| 搜索 | 代码审查 | 最佳实践 |
| AI 工具 | — | — |

所有扩展：**一键添加 → 测试 → 启用/禁用 → 删除**

</details>

---

<details open>
<summary><h3>📝 代码编辑器</h3></summary>

<br>

> *Monaco 编辑器（与 VS Code 相同引擎）—— 集成文件管理与代码执行。*

| 功能 | 说明 |
|:-----|:-----|
| 📂 **文件树** | 浏览、创建、重命名、删除 |
| 🎯 **智能模板** | 14 种语言自动填充 |
| 📌 **改动高亮** | 修改行实时可视化标记 |
| ⌨️ **命令栏** | Shell 执行 + 历史记录 |
| ▶️ **一键运行** | 即时运行任何支持的文件 |
| 📁 **项目选择器** | 选择任意目录作为工作区 |

</details>

---

<a id="zh-architecture"></a>

## 🏗 架构说明

<br>

### 📁 项目结构

```
Mixture-of-Agents/
│
├── frontend/                          🎨  React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx                    ─  主应用（单文件 SPA）
│   │   ├── components/
│   │   │   ├── Chat.tsx               ─  多模型协作对话
│   │   │   ├── Editor.tsx             ─  Monaco 代码编辑器
│   │   │   ├── FileTree.tsx           ─  文件浏览器
│   │   │   ├── Testing.tsx            ─  8 维度模型测试
│   │   │   ├── Extensions.tsx         ─  MCP / 技能 / 专家 UI
│   │   │   └── Settings.tsx           ─  提供商与密钥管理
│   │   ├── services/api.ts            ─  API 客户端（支持 SSE）
│   │   └── types.ts                   ─  TypeScript 接口
│   └── dist/                          📦  构建产物 → backend/public
│
├── backend/                           ⚙️  Express.js + TypeScript
│   ├── src/
│   │   ├── index.ts                   ─  服务入口
│   │   ├── providers/
│   │   │   ├── api-pool.ts            ─  密钥轮换、并发、故障转移
│   │   │   └── presets.ts             ─  17 个提供商配置
│   │   ├── routes/
│   │   │   ├── chat.ts                ─  🔥 编排器核心（1000+ 行）
│   │   │   ├── providers.ts           ─  提供商 CRUD + 模型获取
│   │   │   ├── testing.ts             ─  8 维度模型基准测试
│   │   │   ├── extensions.ts          ─  MCP / 技能 / 专家管理
│   │   │   └── projects.ts            ─  文件操作 + 代码执行
│   │   ├── services/
│   │   │   ├── llm-client.ts          ─  统一 LLM 客户端
│   │   │   └── project-service.ts     ─  项目文件操作
│   │   └── types.ts                   ─  共享类型定义
│   ├── public/                        🌐  静态前端（Express 托管）
│   ├── data/                          💾  运行时状态
│   └── dist/                          🔧  编译后 TypeScript
│
└── README.md
```

### 🔄 编排流程

```
╔══════════════════════════════════════════════════════════════════╗
║                      👤 用户发送消息                              ║
╚════════════════════════════╦═════════════════════════════════════╝
                             ▼
┌────────────────────────────────────────────────────────────────┐
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐           │
│  │ 思考  │→ │ 执行  │→ │ 观察  │→ │ 修复  │→ │ 重复  │  ×12 最大│
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘           │
│                                                                │
│  🧠 计划   📝 写入   🔍 检查   🔧 修复   🔄 循环              │
│           文件      错误      错误                            │
└────────────────────────────────┬───────────────────────────────┘
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│  🔍 验证 — 无记忆子代理检查所有文件                              │
│  🔧 修复 — 如有问题进行一轮修复                                 │
└────────────────────────────────┬───────────────────────────────┘
                                 ▼
╔══════════════════════════════════════════════════════════════════╗
║  ✅ 完成 → 📦 自动安装依赖 → 🌐 自动启动服务器 → 🖥️ 打开浏览器   ║
╚══════════════════════════════════════════════════════════════════╝
```

---

<a id="zh-quickstart"></a>

## 🚀 快速开始

<br>

<details open>
<summary><h3>📥 方式一：克隆运行</h3></summary>

<br>

```bash
# 1️⃣  克隆
git clone https://github.com/bauerelizabeth07139/Mixture-of-Agents.git
cd Mixture-of-Agents

# 2️⃣  构建前端
cd frontend && npm install && npm run build && cd ..

# 3️⃣  构建后端
cd backend && npm install && npm run build && cd ..

# 4️⃣  复制前端 → 后端
# Windows:
Copy-Item -Path "frontend/dist/*" -Destination "backend/public/" -Recurse -Force
# macOS / Linux:
# cp -r frontend/dist/* backend/public/

# 5️⃣  启动 🚀
cd backend && npm start

# 🌐 打开 → http://localhost:3001
```

</details>

---

<details open>
<summary><h3>🔧 方式二：开发模式</h3></summary>

<br>

```bash
# 终端 1 — 后端（保存自动重载）
cd backend && npm run dev

# 终端 2 — 前端（热模块替换）
cd frontend && npm run dev
```

</details>

---

<details open>
<summary><h3>🖥️ 方式三：桌面版（EXE）</h3></summary>

<br>

> 👉 参见 **[Mixture-of-Agents-Desktop](../../Mixture-of-Agents-Desktop)** 下载或构建说明。

</details>

---

<a id="zh-config"></a>

## ⚙️ 配置说明

<br>

### 🌐 环境变量

| 变量 | 默认值 | 说明 |
|:-----|:-------|:-----|
| `PORT` | `3001` | 后端服务端口 |

### 🔑 API 密钥池

| 功能 | 行为 |
|:-----|:-----|
| 🔄 **去重** | 重复密钥自动移除 |
| 🚦 **并发** | 单密钥最大 80 并发 |
| ⏭️ **自动轮换** | 达到上限自动切换 |
| 🛡️ **故障转移** | 401/403 自动移除 |
| 💰 **余额排序** | 剩余额度优先使用 |

### 🎚️ 思考强度

| 模式 | 验证 | 修复 | 适用场景 | 速度 |
|:-----|:-----|:-----|:---------|:-----|
| **🔴 高** | 每步 | 深度 | 复杂项目 | 🐢 |
| **🟡 中** | 每步 | 标准 | 平衡 | 🚶 |
| **🟢 低** | 仅最终 | 最小 | 简单任务 | 🏃 |
| **🔵 自动** | — | — | 调控模型决定 | ⚡ |

---

<a id="zh-api"></a>

## 🔌 API 参考

<br>

### 💬 对话

| 端点 | 方法 | 说明 |
|:-----|:-----|:-----|
| `/api/chat` | `POST` | 发送消息 —— **SSE 流式**响应 |
| `/api/chat/projects` | `GET` | 列出工作区项目 |
| `/api/chat/project-dir` | `GET` | 获取项目目录路径 |

### 🔌 提供商

| 端点 | 方法 | 说明 |
|:-----|:-----|:-----|
| `/api/providers` | `GET` | 列出所有提供商 |
| `/api/providers` | `POST` | 创建提供商 |
| `/api/providers/:id` | `PUT` | 更新提供商 |
| `/api/providers/:id` | `DELETE` | 删除提供商 |
| `/api/providers/:id/fetch-models` | `POST` | 从 API 获取模型列表 |

### 🧪 模型与测试

| 端点 | 方法 | 说明 |
|:-----|:-----|:-----|
| `/api/models` | `GET` | 列出所有已发现模型 |
| `/api/testing/run` | `POST` | 运行模型能力测试 |
| `/api/testing/price` | `POST` | 查询模型定价 |

### 📁 项目

| 端点 | 方法 | 说明 |
|:-----|:-----|:-----|
| `/api/projects/files` | `GET` | 列出项目文件 |
| `/api/projects/run` | `POST` | 执行代码文件 |

### 🧩 扩展

| 端点 | 方法 | 说明 |
|:-----|:-----|:-----|
| `/api/extensions/mcp` | `GET` / `POST` | MCP 服务器管理 |
| `/api/extensions/skill` | `GET` / `POST` | 技能服务器管理 |
| `/api/extensions/expert` | `GET` / `POST` | 专家库管理 |

---

<a id="zh-testing"></a>

## 🧪 模型能力测试

<br>

### 📊 评分公式

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   得分 = 基础分 × 时间系数 × 正确系数                        │
│                                                             │
│   基础分:    每题 5 分                                       │
│   时间系数:  ≤50% 时间 → 1.0 | >50% → 线性衰减 → 0.4       │
│   正确系数:  多正则部分匹配（0.0 – 1.0）                     │
│                                                             │
│   每维度 = max(2 题) = 10 分                                 │
│   总分   = max(8 维度) = 80 分                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 🏷️ 多模态检测

| 标签 | 检测方式 | 颜色 |
|:-----|:---------|:-----|
| 🔊 **音频** | API 传入测试音频 | 绿色标签 |
| 👁️ **视觉** | API 传入测试图片 | 蓝色标签 |
| 🎤 **语音** | 名称识别（tts/stt/whisper） | 紫色标签 |

---

<a id="zh-extensions"></a>

## 🧩 扩展系统

<br>

| 🔌 MCP 服务器 | 🎯 技能服务器 | 🧠 专家库 |
|:--------------:|:--------------:|:---------:|
| **28** 个预设 | **27** 个预设 | **15** 个预设 |

<br>

<details open>
<summary><h3>🔌 MCP 服务器</h3></summary>

<br>

| 类别 | 服务器 | 能力 |
|:-----|:-------|:-----|
| 📂 **文件系统** | 文件 I/O、目录遍历 | 读取、写入、搜索 |
| 💻 **代码** | GitHub、代码搜索 | Git 操作、代码索引 |
| 🗄️ **数据库** | SQLite、PostgreSQL、Redis | 查询、Schema、迁移 |
| 🔍 **搜索** | 网络、文档、知识库 | 检索、索引、排序 |
| 🤖 **AI 工具** | 图像生成、TTS、STT | 生成、转录 |

</details>

---

<details open>
<summary><h3>🎯 技能服务器</h3></summary>

<br>

| 类别 | 说明 |
|:-----|:-----|
| 🌐 Web 自动化 | 浏览器控制、爬取、测试 |
| 📊 数据分析 | CSV、JSON、数据库分析 |
| ⚙️ 系统管理 | 进程、文件、网络操作 |
| 🔍 代码审查 | 静态分析、Lint、建议 |

</details>

---

<details open>
<summary><h3>🧠 专家库</h3></summary>

<br>

| 模板 | 用途 |
|:-----|:-----|
| 🏗 架构 | 系统设计模式 |
| 🔒 安全 | 认证、加密、最佳实践 |
| 📱 移动 | React Native、Flutter 模式 |
| ☁️ DevOps | CI/CD、Docker、K8s |

</details>

---

<a id="zh-languages"></a>

## 💻 支持语言

<br>

| 语言 | 扩展名 | 运行方式 | 类型 |
|:-----|:-------|:---------|:-----|
| 🐍 Python | `.py` | `python` | 解释型 |
| 🟨 JavaScript | `.js` | `node` | 解释型 |
| 🔷 TypeScript | `.ts` | `npx tsx` | 编译→JS |
| 🔴 C | `.c` | `gcc` → `./a.out` | 编译型 |
| 🔵 C++ | `.cpp` | `g++` → `./a.out` | 编译型 |
| 🐹 Go | `.go` | `go run` | 编译型 |
| 🦀 Rust | `.rs` | `rustc` → `./main` | 编译型 |
| ☕ Java | `.java` | `javac` + `java` | 编译型 |
| 💎 Ruby | `.rb` | `ruby` | 解释型 |
| 🐚 Shell | `.sh` | `bash` | 脚本 |
| 🌐 HTML | `.html` | 浏览器 | 标记 |
| 🎨 CSS | `.css` | — | 样式 |
| 📄 JSON | `.json` | — | 数据 |
| 📝 Markdown | `.md` | — | 文档 |

---

<a id="zh-dev"></a>

## 🛠 开发指南

<br>

### 📋 前置条件

| 要求 | 版本 |
|:-----|:-----|
| 🟢 Node.js | 20+ |
| 📦 npm | 9+ |
| 🖥️ 系统 | Windows x64 / macOS / Linux |

### 🏗 技术栈

| 层级 | 技术 |
|:-----|:-----|
| 🎨 前端 | React 18 · TypeScript 5 · Vite · Monaco Editor · xterm.js |
| ⚙️ 后端 | Express.js · TypeScript · WebSocket (ws) · Node.js |
| 🎨 样式 | CSS Variables · 深色/浅色主题 |
| 💾 状态 | React Hooks · localStorage 持久化 |

### 🔧 构建命令

```bash
# 🎨 前端
cd frontend && npm install && npm run build

# ⚙️ 后端
cd backend && npm install && npm run build

# 📦 复制前端 → 后端
Copy-Item -Path "frontend/dist/*" -Destination "backend/public/" -Recurse -Force

# 🖥️ 桌面版 EXE
cd Mixture-of-Agents-Desktop && npm run build:all && npx electron-builder --win dir
```

---

<a id="zh-changelog"></a>

## 📋 更新日志

<br>

### 🏷️ v1.0.0 — 最新版本

| 功能 | 状态 | 说明 |
|:-----|:----:|:-----|
| 🤖 多模型协作对话 | ✅ | 调控模型 + 子代理 |
| 🔄 计划→执行→观察→重规划 | ✅ | 最多 12 轮 |
| 🔍 验证子代理 | ✅ | 无记忆质量检查 |
| 🔌 17 个提供商 | ✅ | API 池 + 故障转移 |
| 🧪 8 维度测试 | ✅ | 10 分制 |
| 🧩 MCP(28) + 技能(27) + 专家(15) | ✅ | 完整扩展系统 |
| 📝 Monaco 编辑器 | ✅ | VS Code 引擎 |
| 🖼️ 多模态检测 | ✅ | 视觉/音频自动标签 |
| 📦 上下文压缩 | ✅ | DeepSeek 风格缓存 |
| 🌗 深色/浅色主题 | ✅ | 切换开关 |
| 💻 EXE 打包 | ✅ | 便携版 + 安装版 |

---

<div align="center">

**🖥️ 桌面版 → [Mixture-of-Agents-Desktop](../../Mixture-of-Agents-Desktop)**

[⬆ 返回顶部](#top)

</div>
<div align="center">

<a id="top"></a>

# ⚛️ Mixture of Agents — Web

### Intelligent Multi-Model Agent System · Built on Claude Code Architecture

<br>

![Platform](https://img.shields.io/badge/Platform-Web%20%2B%20Node.js-ff6b9f?style=for-the-badge&logo=node.js&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge)
![Electron](https://img.shields.io/badge/Electron-28-47848f?style=for-the-badge&logo=electron&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-00ff00?style=for-the-badge)

<br>

Web-based multi-model AI agent system with collaborative chat, model testing, MCP/Skill extensions, and automated code execution.

For the Desktop (EXE) version → [**Mixture-of-Agents-Desktop**](../../Mixture-of-Agents-Desktop)

**[English](#top) · [中文版](#chinese-doc)**

</div>

---

<a id="toc"></a>

## 📑 Table of Contents

| Section | Description |
|:--------|:------------|
| [✨ Features](#features) | Multi-model chat, testing, extensions, editor |
| [🏗 Architecture](#architecture) | System design, orchestration flow, tech stack |
| [🚀 Quick Start](#quickstart) | Clone, install, and run in 3 ways |
| [⚙️ Configuration](#configuration) | Environment, API pool, thinking modes |
| [🔌 API Reference](#apireference) | REST & SSE endpoints |
| [🧪 Model Testing](#modeltesting) | 8-dimension scoring system |
| [🧩 Extensions](#extension) | MCP servers, skills, experts |
| [📝 Languages](#languages) | 14 supported programming languages |
| [🛠 Development](#development) | Prerequisites, tech stack, build commands |
| [📋 Changelog](#changelog) | Version history |

---

<a id="features"></a>

## ✨ Features

<br>

### 🤖 Multi-Model Collaborative Chat

> The orchestrator analyzes your task, creates a step-by-step plan, then dispatches sub-agents — each potentially using a different model.

- **Plan → Act → Observe → Replan** loop (up to 12 rounds) — same core architecture as Claude Code / Codex
- **Global thinking intensity**: `Low` / `Medium` / `High` / `Auto`
- Orchestrator and sub-agent thinking strength configured independently
- **Stateless verification sub-agents** check project completeness after each round
- **Context compression** — DeepSeek-style cache-friendly message formatting
- SSE streaming responses with real-time progress updates

---

### 🧪 Model Capability Testing

> Automated benchmarking across 8 dimensions with authority-sourced test questions.

- **Quick Test** (~3 min/question) and **Standard Test** (~12 min/question)
- **8 dimensions**: Coding, Reasoning, Math, Creative Writing, Instruction Following, Tool Use, Multilingual, Context
- **10-point scale** with linear time-based fitting and multi-regex correctness coefficients
- Automatic multimodal detection (Vision / Audio) via API testing
- Authority test banks with strong discrimination between model tiers

---

### 🔌 Provider & Model Management

> 17 preset providers with intelligent API pool management.

| Provider | Provider | Provider |
|:---------|:---------|:---------|
| OpenAI | DeepSeek | Zhipu AI |
| Moonshot | SiliconFlow | StepFun |
| Volcengine | MiniMax | Qwen |
| Baidu | iFlytek | Baichuan |
| LingYiwanWu | Tencent | MiMo |
| Anthropic | Local/Ollama | |

- Up to 50 API keys per provider with automatic round-robin
- **Concurrency control** — max 80 concurrent requests per key
- Rate limit handling (429/401/403) with automatic key rotation
- One-click model fetch with capability detection (Vision / Audio / Multimodal)
- Custom provider support (any OpenAI-compatible API)

---

### 🧩 Extension System

> Pre-configured MCP servers, skill environments, and expert knowledge bases.

| Category | Count | Highlights |
|:---------|:------|:-----------|
| **MCP Servers** | 28 presets | Filesystem, GitHub, Database, Search, AI Tools |
| **Skill Servers** | 27 presets | Web automation, data analysis, system management |
| **Expert Library** | 15 presets | Development workflow templates |

All extensions: one-click add, test, enable/disable, and delete.

---

### 📝 Code Editor

> Monaco Editor (same engine as VS Code) with integrated file management and code execution.

- Built-in file tree with right-click context menu (New / Rename / Delete)
- **Project directory selector** — choose any workspace location
- **Smart file creation** — auto-appends correct file extension per language
- **Change highlighting** — real-time visual markers on modified lines
- Bottom command bar for shell command execution
- One-click file runner supporting 14+ languages

---

<a id="architecture"></a>

## 🏗 Architecture

### Project Structure

```
Mixture-of-Agents/
├── frontend/                     # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx               # Main application (single-file SPA)
│   │   ├── components/           # Chat, Editor, FileTree, Terminal, Testing, Extensions
│   │   ├── services/api.ts       # API client with SSE support
│   │   └── types.ts              # TypeScript type definitions
│   └── dist/                     # Built frontend → copied to backend/public
│
├── backend/                      # Express.js + TypeScript
│   ├── src/
│   │   ├── index.ts              # Server entry point
│   │   ├── providers/            # API pool manager + 17 provider presets
│   │   │   ├── api-pool.ts       # Key rotation, concurrency control, failover
│   │   │   └── presets.ts        # Provider configurations
│   │   ├── routes/
│   │   │   ├── chat.ts           # Orchestrator: Plan→Act→Observe→Replan
│   │   │   ├── providers.ts      # Provider CRUD, model fetch
│   │   │   ├── testing.ts        # 8-dimension model testing
│   │   │   ├── extensions.ts     # MCP / Skill / Expert management
│   │   │   └── projects.ts       # File management, code execution
│   │   ├── services/
│   │   │   ├── llm-client.ts     # Unified LLM API client
│   │   │   └── project-service.ts
│   │   └── types.ts
│   ├── public/                   # Static frontend (served by Express)
│   ├── data/                     # Runtime data (pool state, extensions)
│   └── dist/                     # Compiled TypeScript
│
└── README.md
```

### Orchestration Flow

```
┌──────────────────────────────────────────────────────────┐
│                    USER SENDS MESSAGE                     │
└──────────────────────┬───────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────┐
│  1. THINK    Orchestrator creates plan                    │
│  2. ACT      Write files, run commands                    │
│  3. OBSERVE  Check errors, capture output                 │
│  4. FIX      Generate targeted fixes if errors found      │
│  5. REPEAT   Loop (up to 12 rounds)                       │
└──────────────────────┬───────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────┐
│  VERIFY    Stateless sub-agent checks project completeness│
│  FIX       One fix round if issues found                  │
└──────────────────────┬───────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────┐
│  DONE       Auto-install deps → auto-serve → open browser │
└──────────────────────────────────────────────────────────┘
```

---

<a id="quickstart"></a>

## 🚀 Quick Start

### Option 1: Clone & Run

```bash
# 1. Clone
git clone https://github.com/bauerelizabeth07139/Mixture-of-Agents.git
cd Mixture-of-Agents

# 2. Build frontend
cd frontend && npm install && npm run build && cd ..

# 3. Build backend
cd backend && npm install && npm run build && cd ..

# 4. Copy frontend to backend
# Windows PowerShell:
Copy-Item -Path "frontend/dist/*" -Destination "backend/public/" -Recurse -Force
# macOS / Linux:
# cp -r frontend/dist/* backend/public/

# 5. Start
cd backend && npm start
# → Open http://localhost:3001
```

### Option 2: Development Mode

```bash
# Terminal 1 — Backend (auto-reload)
cd backend && npm run dev

# Terminal 2 — Frontend (hot reload)
cd frontend && npm run dev
```

### Option 3: Desktop Version (EXE)

See [Mixture-of-Agents-Desktop](../../Mixture-of-Agents-Desktop) for download or build instructions.

---

<a id="configuration"></a>

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|:---------|:--------|:------------|
| `PORT` | `3001` | Backend server port |

### API Key Pool

| Feature | Behavior |
|:--------|:---------|
| **Deduplication** | Duplicate keys automatically removed |
| **Concurrency** | Max 80 concurrent requests per key |
| **Auto-rotation** | Switches to next key when limit reached |
| **Failover** | 401/403 keys removed from pool |
| **Balance sorting** | Keys with remaining quota used first |

### Thinking Intensity

| Mode | Verification | Fix Depth | Best For |
|:-----|:------------|:----------|:---------|
| **High** | Every step | Deep fixes | Complex projects, production code |
| **Medium** | Every step | Standard | Balanced speed and quality |
| **Low** | End only | Minimal | Simple tasks, fastest execution |
| **Auto** | — | — | Orchestrator estimates difficulty |

---

<a id="apireference"></a>

## 🔌 API Reference

### Chat

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/chat` | POST | Send message (SSE streaming response) |
| `/api/chat/projects` | GET | List workspace projects |
| `/api/chat/project-dir` | GET | Get project directory |

### Providers

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/providers` | GET | List all providers |
| `/api/providers` | POST | Create provider |
| `/api/providers/:id` | PUT | Update provider |
| `/api/providers/:id` | DELETE | Delete provider |
| `/api/providers/:id/fetch-models` | POST | Fetch model list |

### Models & Testing

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/models` | GET | List all discovered models |
| `/api/testing/run` | POST | Run model capability test |
| `/api/testing/price` | POST | Query model pricing |

### Projects

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/projects/files` | GET | List project files |
| `/api/projects/run` | POST | Execute code |

### Extensions

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/extensions/mcp` | GET/POST | MCP server management |
| `/api/extensions/skill` | GET/POST | Skill server management |
| `/api/extensions/expert` | GET/POST | Expert library management |

---

<a id="modeltesting"></a>

## 🧪 Model Testing

### Test Dimensions

| Dimension | Icon | Content |
|:----------|:-----|:--------|
| Coding | 💻 | Algorithm implementation, data structures |
| Reasoning | 🧠 | Logical reasoning, multi-step deduction |
| Math | 🔢 | Mathematical computation, proofs |
| Creative Writing | ✍️ | Format compliance, creative constraints |
| Instruction Following | 📋 | Complex instruction adherence |
| Tool Use | 🛠️ | API calls, structured output |
| Multilingual | 🌐 | Cross-language understanding |
| Context | 📚 | Long context retention, multi-turn dialogue |

### Scoring System

| Parameter | Value |
|:----------|:------|
| Points per dimension | **10** (2 questions × 5 points) |
| Total score | **80** (8 dimensions) |
| Time limit (Quick) | 3 min/question |
| Time limit (Standard) | 12 min/question |
| Time scoring | ≤50% time → 5pts, linear decay → 2pts at 100% |
| Correctness | Multi-regex matching with partial credit |

### Multimodal Detection

| Capability | Method |
|:-----------|:-------|
| **Vision** | API test with sample image |
| **Audio** | API test with sample audio |
| Tags | `🔊 Audio` / `👁️ Vision` / `🎤 Speech` |

---

<a id="extension"></a>

## 🧩 Extension System

### MCP Servers (28 presets)

| Category | Servers |
|:---------|:--------|
| **Filesystem** | Read/write, directory traversal, file search |
| **Code** | GitHub integration, code search, git operations |
| **Database** | SQLite, PostgreSQL, Redis, MongoDB |
| **Search** | Web search, document retrieval, knowledge base |
| **AI Tools** | Image generation, TTS, STT, translation |

### Skill Servers (27 presets)

Independent skill execution environments covering web automation, data analysis, system management, code review, and more.

### Expert Library (15 presets)

Pre-configured expert knowledge templates for common development workflows.

---

<a id="languages"></a>

## 📝 Supported Languages

| Language | Extension | Runner | Notes |
|:---------|:----------|:-------|:------|
| Python | `.py` | `python` | Full support |
| JavaScript | `.js` | `node` | Full support |
| TypeScript | `.ts` | `npx tsx` | Full support |
| C | `.c` | `gcc` | Compile & run |
| C++ | `.cpp` | `g++` | Compile & run |
| Go | `.go` | `go run` | Full support |
| Rust | `.rs` | `rustc` | Compile & run |
| Java | `.java` | `javac` + `java` | Compile & run |
| Ruby | `.rb` | `ruby` | Full support |
| Shell | `.sh` | `bash` | Script execution |
| HTML | `.html` | Browser | Open in browser |
| CSS | `.css` | — | Preview only |
| JSON | `.json` | — | View / format |
| Markdown | `.md` | — | Render preview |

---

<a id="development"></a>

## 🛠 Development

### Prerequisites

- **Node.js** 20+
- **npm** 9+
- **OS**: Windows x64 / macOS / Linux

### Tech Stack

| Layer | Technology |
|:------|:-----------|
| Frontend | React 18, TypeScript 5, Vite, Monaco Editor, xterm.js |
| Backend | Express.js, TypeScript, WebSocket (ws), Node.js |
| Desktop | Electron 28 |
| Styling | CSS Variables, dark/light themes |
| State | React Hooks, localStorage persistence |

### Build Commands

```bash
# Frontend
cd frontend && npm install && npm run build

# Backend
cd backend && npm install && npm run build

# Full (copy frontend → backend)
Copy-Item -Path "frontend/dist/*" -Destination "backend/public/" -Recurse -Force

# Desktop EXE
cd Mixture-of-Agents-Desktop && npm run build:all && npx electron-builder --win dir
```

---

<a id="changelog"></a>

## 📋 Changelog

### v1.0.0 — Latest

| Feature | Status |
|:--------|:------:|
| Multi-model chat with orchestrator | ✅ |
| Plan → Act → Observe → Replan loop | ✅ |
| Stateless verification sub-agents | ✅ |
| 17 preset providers with API pool | ✅ |
| 8-dimension model testing (10-point scale) | ✅ |
| 28 MCP + 27 Skill + 15 Expert presets | ✅ |
| Monaco code editor + file management | ✅ |
| Multimodal detection (Vision / Audio) | ✅ |
| Context compression & cache optimization | ✅ |
| Dark / Light theme toggle | ✅ |
| Portable EXE packaging | ✅ |

---

<a id="license"></a>

## 📄 License

MIT License © 2025

---

<div align="center">

**Desktop (EXE) version → [Mixture-of-Agents-Desktop](../../Mixture-of-Agents-Desktop)**

[⬆ Back to Top](#top)

</div>

---
---

<a id="chinese-doc"></a>

# ⚛️ Mixture of Agents — Web

### 基于 Claude Code 架构的多模型智能代理 Web 系统

<br>

![Platform](https://img.shields.io/badge/Platform-Web%20%2B%20Node.js-ff6b9f?style=for-the-badge&logo=node.js&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge)
![Electron](https://img.shields.io/badge/Electron-28-47848f?style=for-the-badge&logo=electron&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-00ff00?style=for-the-badge)

<br>

基于 Claude Code 架构的多模型协作智能代理系统，支持对话、模型测试、MCP/Skill 扩展和自动代码执行。

桌面版（EXE）→ [**Mixture-of-Agents-Desktop**](../../Mixture-of-Agents-Desktop)

**[English](#top) · [中文版](#chinese-doc)**

---

### 📑 目录

| 章节 | 说明 |
|:-----|:-----|
| [✨ 核心特性](#zh-features) | 多模型对话、测试、扩展、编辑器 |
| [🏗 架构说明](#zh-architecture) | 系统设计、编排流程、技术栈 |
| [🚀 快速开始](#zh-quickstart) | 三种方式克隆安装运行 |
| [⚙️ 配置说明](#zh-config) | 环境变量、API 池、思考强度 |
| [🔌 API 参考](#zh-api) | REST 与 SSE 端点 |
| [🧪 模型测试](#zh-testing) | 8 维度评分系统 |
| [🧩 扩展系统](#zh-extensions) | MCP 服务器、技能、专家库 |
| [📝 支持语言](#zh-languages) | 14 种编程语言 |
| [🛠 开发指南](#zh-dev) | 前置条件、技术栈、构建命令 |
| [📋 更新日志](#zh-changelog) | 版本历史 |

---

<a id="zh-features"></a>

## ✨ 核心特性

<br>

### 🤖 多模型协作对话

> 宏观调控模型分析任务，制定分步计划，分配子代理执行——每个子代理可使用不同的模型。

- **计划→执行→观察→重规划** 循环（最多 12 轮）—— 与 Claude Code / Codex 核心一致
- **全局思考强度**：`低` / `中` / `高` / `自动`
- 调控模型和子代理思考强度独立配置
- **无记忆验证代理** 每轮检查项目完整性
- **上下文压缩** —— DeepSeek 风格缓存友好消息格式
- SSE 流式响应，实时进度更新

---

### 🧪 模型能力测试

> 跨 8 个维度的自动基准测试，使用权威测试题。

- **快速测试**（~3 分钟/题）和 **标准测试**（~12 分钟/题）
- **8 个维度**：编码、推理、数学、创意写作、指令遵循、工具使用、多语言、上下文
- **10 分制评分**，线性时间拟合 + 多正则正确系数
- 自动多模态检测（视觉/音频）通过 API 测试
- 权威题库，具有模型区分度

---

### 🔌 提供商与模型管理

> 17 个预设提供商，智能 API 池管理。

| 提供商 | 提供商 | 提供商 |
|:-------|:-------|:-------|
| OpenAI | DeepSeek | 智谱AI |
| Moonshot | SiliconFlow | StepFun |
| 火山引擎 | MiniMax | 通义千问 |
| 百度 | 讯飞 | 百川 |
| 零一万物 | 腾讯 | MiMo |
| Anthropic | 本地/Ollama | |

- 每个提供商最多 50 个 API 密钥，自动轮换
- **并发控制** —— 单密钥最大 80 并发
- 429/401/403 速率限制自动处理与密钥轮换
- 一键获取模型列表并自动探测能力（视觉/音频/多模态）
- 自定义提供商支持（任何 OpenAI 兼容 API）

---

### 🧩 扩展系统

> 预配置的 MCP 服务器、技能环境和专家知识库。

| 类别 | 数量 | 亮点 |
|:-----|:-----|:-----|
| **MCP 服务器** | 28 个预设 | 文件系统、GitHub、数据库、搜索、AI 工具 |
| **技能服务器** | 27 个预设 | Web 自动化、数据分析、系统管理 |
| **专家库** | 15 个预设 | 开发工作流模板 |

所有扩展：一键添加、测试、启用/禁用、删除。

---

### 📝 代码编辑器

> Monaco 编辑器（与 VS Code 相同引擎），集成文件管理与代码执行。

- 内置文件树，右键菜单（新建/重命名/删除）
- **项目目录选择器** —— 选择任意工作区位置
- **智能文件创建** —— 自动追加正确的文件扩展名
- **改动高亮** —— 修改行的实时可视化标记
- 底部命令栏，支持 shell 命令执行
- 一键运行，支持 14+ 种语言

---

<a id="zh-architecture"></a>

## 🏗 架构说明

### 项目结构

```
Mixture-of-Agents/
├── frontend/                     # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx               # 主应用（单文件 SPA）
│   │   ├── components/           # 聊天、编辑器、文件树、终端、测试、扩展
│   │   ├── services/api.ts       # API 客户端（支持 SSE）
│   │   └── types.ts
│   └── dist/                     # 构建产物 → 复制到 backend/public
│
├── backend/                      # Express.js + TypeScript
│   ├── src/
│   │   ├── index.ts              # 服务入口
│   │   ├── providers/            # API 池管理 + 17 个提供商预设
│   │   │   ├── api-pool.ts       # 密钥轮换、并发控制、故障转移
│   │   │   └── presets.ts        # 提供商配置
│   │   ├── routes/
│   │   │   ├── chat.ts           # 编排器：计划→执行→观察→重规划
│   │   │   ├── providers.ts      # 提供商 CRUD、模型获取
│   │   │   ├── testing.ts        # 8 维度模型能力测试
│   │   │   ├── extensions.ts     # MCP / 技能 / 专家管理
│   │   │   └── projects.ts       # 文件管理、代码执行
│   │   ├── services/
│   │   │   ├── llm-client.ts     # 统一 LLM API 客户端
│   │   │   └── project-service.ts
│   │   └── types.ts
│   ├── public/                   # 静态前端文件（Express 托管）
│   ├── data/                     # 运行时数据
│   └── dist/                     # 编译后的 TypeScript
│
└── README.md
```

### 编排流程

```
┌──────────────────────────────────────────────────────────┐
│                      用户发送消息                          │
└──────────────────────┬───────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────┐
│  1. 思考    调控模型创建计划                               │
│  2. 执行    写入文件、运行命令                              │
│  3. 观察    检查错误、捕获输出                              │
│  4. 修复    有针对性地修复错误                              │
│  5. 重复    循环（最多 12 轮）                              │
└──────────────────────┬───────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────┐
│  验证    无记忆子代理检查项目完整性                          │
│  修复    如有问题进行一轮修复                               │
└──────────────────────┬───────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────────────────┐
│  完成    自动安装依赖 → 自动启动服务器 → 打开浏览器           │
└──────────────────────────────────────────────────────────┘
```

---

<a id="zh-quickstart"></a>

## 🚀 快速开始

### 方式一：克隆运行

```bash
# 1. 克隆
git clone https://github.com/bauerelizabeth07139/Mixture-of-Agents.git
cd Mixture-of-Agents

# 2. 构建前端
cd frontend && npm install && npm run build && cd ..

# 3. 构建后端
cd backend && npm install && npm run build && cd ..

# 4. 复制前端到后端
# Windows PowerShell:
Copy-Item -Path "frontend/dist/*" -Destination "backend/public/" -Recurse -Force
# macOS / Linux:
# cp -r frontend/dist/* backend/public/

# 5. 启动
cd backend && npm start
# → 打开 http://localhost:3001
```

### 方式二：开发模式

```bash
# 终端 1 — 后端（热重载）
cd backend && npm run dev

# 终端 2 — 前端（热更新）
cd frontend && npm run dev
```

### 方式三：桌面版（EXE）

参见 [Mixture-of-Agents-Desktop](../../Mixture-of-Agents-Desktop) 下载或构建说明。

---

<a id="zh-config"></a>

## ⚙️ 配置说明

### 环境变量

| 变量 | 默认值 | 说明 |
|:-----|:-------|:-----|
| `PORT` | `3001` | 后端服务端口 |

### API 密钥池

| 功能 | 行为 |
|:-----|:-----|
| **去重** | 重复密钥自动移除 |
| **并发** | 单密钥最大 80 并发 |
| **自动轮换** | 达到上限自动切换下一个密钥 |
| **故障转移** | 401/403 密钥自动从池中移除 |
| **余额排序** | 按剩余余额优先使用 |

### 思考强度

| 模式 | 验证频率 | 修复深度 | 适用场景 |
|:-----|:---------|:---------|:---------|
| **高** | 每步验证 | 深度修复 | 复杂项目、生产代码 |
| **中** | 每步验证 | 标准修复 | 平衡速度和质量 |
| **低** | 仅最终 | 最小修复 | 简单任务、最快执行 |
| **自动** | — | — | 调控模型评估难度后选择 |

---

<a id="zh-api"></a>

## 🔌 API 参考

### 对话

| 端点 | 方法 | 说明 |
|:-----|:-----|:-----|
| `/api/chat` | POST | 发送消息（SSE 流式响应） |
| `/api/chat/projects` | GET | 列出工作区项目 |
| `/api/chat/project-dir` | GET | 获取项目目录 |

### 提供商

| 端点 | 方法 | 说明 |
|:-----|:-----|:-----|
| `/api/providers` | GET | 列出所有提供商 |
| `/api/providers` | POST | 创建提供商 |
| `/api/providers/:id` | PUT | 更新提供商 |
| `/api/providers/:id` | DELETE | 删除提供商 |
| `/api/providers/:id/fetch-models` | POST | 获取模型列表 |

### 模型与测试

| 端点 | 方法 | 说明 |
|:-----|:-----|:-----|
| `/api/models` | GET | 列出所有已发现模型 |
| `/api/testing/run` | POST | 运行模型能力测试 |
| `/api/testing/price` | POST | 查询模型定价 |

### 项目

| 端点 | 方法 | 说明 |
|:-----|:-----|:-----|
| `/api/projects/files` | GET | 列出项目文件 |
| `/api/projects/run` | POST | 执行代码 |

### 扩展

| 端点 | 方法 | 说明 |
|:-----|:-----|:-----|
| `/api/extensions/mcp` | GET/POST | MCP 服务器管理 |
| `/api/extensions/skill` | GET/POST | 技能服务器管理 |
| `/api/extensions/expert` | GET/POST | 专家库管理 |

---

<a id="zh-testing"></a>

## 🧪 模型能力测试

### 测试维度

| 维度 | 图标 | 内容 |
|:-----|:-----|:-----|
| 编码 | 💻 | 算法实现、数据结构 |
| 推理 | 🧠 | 逻辑推理、多步推导 |
| 数学 | 🔢 | 数学计算、证明 |
| 创意写作 | ✍️ | 格式遵循、创意约束 |
| 指令遵循 | 📋 | 复杂指令遵从 |
| 工具使用 | 🛠️ | API 调用、结构化输出 |
| 多语言 | 🌐 | 跨语言理解 |
| 上下文 | 📚 | 长上下文保持、多轮对话 |

### 评分系统

| 参数 | 值 |
|:-----|:---|
| 每维度分数 | **10 分**（2 题 × 5 分） |
| 总分 | **80 分**（8 个维度） |
| 快速测试时限 | 3 分钟/题 |
| 标准测试时限 | 12 分钟/题 |
| 时间评分 | ≤50% 时间 → 5分，线性递减 → 100%时 2分 |
| 正确系数 | 多正则匹配，支持部分得分 |

### 多模态检测

| 能力 | 方式 |
|:-----|:-----|
| **视觉** | API 传入测试图片 |
| **音频** | API 传入测试音频 |
| 标签 | `🔊 音频` / `👁️ 视觉` / `🎤 语音` |

---

<a id="zh-extensions"></a>

## 🧩 扩展系统

### MCP 服务器（28 个预设）

| 类别 | 服务器 |
|:-----|:-------|
| **文件系统** | 读写、目录遍历、文件搜索 |
| **代码** | GitHub 集成、代码搜索、git 操作 |
| **数据库** | SQLite、PostgreSQL、Redis、MongoDB |
| **搜索** | 网络搜索、文档检索、知识库 |
| **AI 工具** | 图像生成、TTS、STT、翻译 |

### 技能服务器（27 个预设）

预配置的技能执行环境，覆盖 Web 自动化、数据分析、系统管理、代码审查等场景。

### 专家库（15 个预设）

常用开发工作流的即用型专家知识模板。

---

<a id="zh-languages"></a>

## 📝 支持语言

| 语言 | 扩展名 | 运行方式 | 备注 |
|:-----|:-------|:---------|:-----|
| Python | `.py` | `python` | 完整支持 |
| JavaScript | `.js` | `node` | 完整支持 |
| TypeScript | `.ts` | `npx tsx` | 完整支持 |
| C | `.c` | `gcc` | 编译运行 |
| C++ | `.cpp` | `g++` | 编译运行 |
| Go | `.go` | `go run` | 完整支持 |
| Rust | `.rs` | `rustc` | 编译运行 |
| Java | `.java` | `javac` + `java` | 编译运行 |
| Ruby | `.rb` | `ruby` | 完整支持 |
| Shell | `.sh` | `bash` | 脚本执行 |
| HTML | `.html` | 浏览器 | 浏览器打开 |
| CSS | `.css` | — | 仅预览 |
| JSON | `.json` | — | 查看/格式化 |
| Markdown | `.md` | — | 渲染预览 |

---

<a id="zh-dev"></a>

## 🛠 开发指南

### 前置条件

- **Node.js** 20+
- **npm** 9+
- **系统**：Windows x64 / macOS / Linux

### 技术栈

| 层级 | 技术 |
|:-----|:-----|
| 前端 | React 18、TypeScript 5、Vite、Monaco Editor、xterm.js |
| 后端 | Express.js、TypeScript、WebSocket (ws)、Node.js |
| 桌面 | Electron 28 |
| 样式 | CSS Variables、深色/浅色主题 |
| 状态 | React Hooks、localStorage 持久化 |

### 构建命令

```bash
# 前端
cd frontend && npm install && npm run build

# 后端
cd backend && npm install && npm run build

# 完整构建（复制前端 → 后端）
Copy-Item -Path "frontend/dist/*" -Destination "backend/public/" -Recurse -Force

# 桌面版 EXE
cd Mixture-of-Agents-Desktop && npm run build:all && npx electron-builder --win dir
```

---

<a id="zh-changelog"></a>

## 📋 更新日志

### v1.0.0 — 最新

| 功能 | 状态 |
|:-----|:----:|
| 多模型协作对话与宏观调控 | ✅ |
| 计划→执行→观察→重规划循环 | ✅ |
| 无记忆验证子代理 | ✅ |
| 17 个预设提供商，API 池管理 | ✅ |
| 8 维度模型能力测试（10 分制） | ✅ |
| 28 MCP + 27 Skill + 15 专家预设 | ✅ |
| Monaco 编辑器 + 文件管理 | ✅ |
| 多模态检测（视觉/音频） | ✅ |
| 上下文压缩与缓存优化 | ✅ |
| 深色/浅色主题切换 | ✅ |
| 便携版 EXE 打包 | ✅ |

---

<div align="center">

**桌面版 → [Mixture-of-Agents-Desktop](../../Mixture-of-Agents-Desktop)**

[⬆ 返回顶部](#top)

</div>
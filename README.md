<div align="center">

<a id='top'></a>

# ⚛️ Mixture of Agents — Web

### Intelligent Multi-Model Agent System Built on Claude Code Architecture

![Platform](https://img.shields.io/badge/platform-Web%20%2B%20Node.js-ff6b9f?style=for-the-badge)
![Node](https://img.shields.io/badge/node.js-20+-339933?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

Web-based multi-model AI agent system with collaborative chat, model testing, MCP/Skill extensions, and automated code execution.

For the Desktop (EXE) version, see [Mixture-of-Agents-Desktop](../../Mixture-of-Agents-Desktop)

[Switch to Chinese / 切换中文 ▶](#chinese-doc)

</div>

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Model Testing](#-model-testing)
- [Extension System](#-extension-system)
- [Supported Languages](#-supported-languages)
- [Development](#-development)
- [Changelog](#-changelog)
- [License](#-license)

---

## ✨ Features

### 🤖 Multi-Model Collaborative Chat
- **Orchestrator Model** analyzes tasks, creates step-by-step plans, dispatches sub-agents
- **Plan → Act → Observe → Replan** loop (up to 12 rounds) — same core as Claude Code / Codex
- **Global thinking intensity**: Low / Medium / High / Auto (orchestrator decides for sub-agents)
- Orchestrator and sub-agent thinking strength configured independently
- **Stateless verification sub-agents** check project completeness after each round
- **Context compression** — DeepSeek-style cache-friendly message formatting
- SSE streaming responses with real-time progress

### 🧪 Model Capability Testing
- **Quick Test** (~3 min per question) and **Standard Test** (~12 min per question)
- 8 dimensions: Coding, Reasoning, Math, Creative Writing, Instruction Following, Tool Use, Multilingual, Context
- **10-point scale** with linear time-based fitting and multi-regex correctness coefficients
- Automatic multimodal detection (Vision / Audio) via API testing
-权威测试题库，具有区分度

### 🔌 Provider & Model Management
- **17 preset providers**: OpenAI, DeepSeek, Zhipu AI, Moonshot, SiliconFlow, StepFun, Volcengine, MiniMax, Qwen, Baidu, iFlytek, Baichuan, LingYiwanWu, Tencent, MiMo, Anthropic, Local/Ollama
- Up to 50 API keys per provider with automatic round-robin
- **API pool concurrency control** — max 80 concurrent requests per key
- Rate limit handling (429/401/403) with automatic key rotation
- One-click model fetch with capability detection (Vision / Audio / Multimodal)
- Custom provider support (any OpenAI-compatible API)

### 🧩 Extension System
- **28 MCP Server** presets (Filesystem, GitHub, Database, Search, AI tools, etc.)
- **27 Skill Server** presets (independent skill execution environments)
- **15 Expert/Skill** presets (pre-configured skill templates)
- All extensions: one-click add, test, enable/disable, and delete

### 📝 Code Editor
- **Monaco Editor** — the same engine powering VS Code
- Built-in file tree with right-click context menu (New / Rename / Delete)
- **Project directory selector** — choose any workspace location
- **Smart file creation** — auto-appends correct file extension per language
- **Change highlighting** — real-time visual markers on modified lines
- Bottom command bar for shell command execution
- One-click file runner supporting 14+ languages

### 🏗 Agent Orchestration
- Inspired by Claude Code, Codex, Trae, OpenHands, Cline, and OpenSpec
- Sub-agents can use **different models** for different task types
- Task verification loop — orchestrator assigns stateless sub-agents to check completion
- Automatic error recovery and retry (up to 10 rounds)
- Each conversation creates a new project folder

---

## 🏗 Architecture

```
Mixture-of-Agents/
├── frontend/                     # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx               # Main application (single-file SPA)
│   │   ├── components/           # Chat, Editor, FileTree, Terminal, Testing, Extensions
│   │   ├── services/api.ts       # API client with SSE support
│   │   └── types.ts              # TypeScript interfaces
│   └── dist/                     # Built frontend (copied to backend/public)
│
├── backend/                      # Express.js + TypeScript
│   ├── src/
│   │   ├── index.ts              # Server entry point
│   │   ├── providers/            # API pool manager + 17 provider presets
│   │   │   ├── api-pool.ts       # Key rotation, concurrency control, failover
│   │   │   └── presets.ts        # Provider configurations
│   │   ├── routes/
│   │   │   ├── chat.ts           # Orchestrator: Plan→Act→Observe→Replan loop
│   │   │   ├── providers.ts      # Provider CRUD, model fetch
│   │   │   ├── testing.ts        # 8-dimension model testing
│   │   │   ├── extensions.ts     # MCP / Skill / Expert management
│   │   │   └── projects.ts       # File management, code execution
│   │   ├── services/
│   │   │   ├── llm-client.ts     # Unified LLM API client (streaming + non-streaming)
│   │   │   └── project-service.ts # Project file operations
│   │   └── types.ts              # Shared type definitions
│   ├── public/                   # Static frontend files (served by Express)
│   ├── data/                     # Runtime data (pool state, extensions)
│   └── dist/                     # Compiled TypeScript
│
└── README.md
```

### Orchestration Flow

```
User Message
    ↓
┌─────────────────────────────────────────┐
│  1. THINK — Orchestrator creates plan   │
│  2. ACT — Write files, run commands     │
│  3. OBSERVE — Check errors, verify      │
│  4. FIX — If errors, generate fixes     │
│  5. REPEAT (up to 12 rounds)            │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  VERIFY — Stateless sub-agent checks    │
│  project completeness & correctness     │
└─────────────────────────────────────────┘
    ↓
Done → Auto-serve & open browser
```

---

## 🚀 Quick Start

### Option 1: Clone & Run

```bash
# 1. Clone the repository
git clone https://github.com/bauerelizabeth07139/Mixture-of-Agents.git
cd Mixture-of-Agents

# 2. Install frontend dependencies and build
cd frontend
npm install
npm run build
cd ..

# 3. Install backend dependencies and compile
cd backend
npm install
npm run build
cd ..

# 4. Copy frontend build to backend public directory
Copy-Item -Path "frontend/dist/*" -Destination "backend/public/" -Recurse -Force

# 5. Start the server
cd backend
npm start

# 6. Open browser
# http://localhost:3001
```

### Option 2: Development Mode

```bash
# Terminal 1 — Backend (with auto-reload)
cd backend
npm run dev

# Terminal 2 — Frontend (with hot reload)
cd frontend
npm run dev
```

### Option 3: Desktop Version (EXE)

Download from [Mixture-of-Agents-Desktop](../../Mixture-of-Agents-Desktop) or build from source:

```bash
git clone https://github.com/bauerelizabeth07139/Mixture-of-Agents-Desktop.git
cd Mixture-of-Agents-Desktop
npm install
npm run build:all
npx electron-builder --win dir
# EXE in release/win-unpacked/
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Backend server port |

### API Key Pool

- **Deduplication** — duplicate keys automatically removed
- **Concurrency limit** — max 80 concurrent requests per key
- **Auto-rotation** — switches to next key when limit reached
- **Failover** — 401/403 keys automatically removed from pool
- **Balance sorting** — keys with remaining quota used first

### Thinking Intensity Modes

| Mode | Verification | Fix Depth | Description |
|------|-------------|-----------|-------------|
| **High** | Every step | Deep fixes | Full verification after each round, aggressive error correction |
| **Medium** | Every step | Standard | Quick verification, balanced fix approach |
| **Low** | End only | Minimal | Verify only at the end, fastest execution |
| **Auto** | — | — | Orchestrator estimates task difficulty and selects intensity |

---

## 🔌 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/providers` | GET | List all providers |
| `/api/providers` | POST | Create provider |
| `/api/providers/:id` | PUT | Update provider |
| `/api/providers/:id` | DELETE | Delete provider |
| `/api/providers/:id/fetch-models` | POST | Fetch model list from provider |
| `/api/chat` | POST | Send chat message (SSE streaming) |
| `/api/chat/projects` | GET | List workspace projects |
| `/api/models` | GET | List all discovered models |
| `/api/testing/run` | POST | Run model capability test |
| `/api/testing/price` | POST | Query model pricing |
| `/api/projects/files` | GET | List project files |
| `/api/projects/run` | POST | Execute code |
| `/api/extensions/mcp` | GET/POST | MCP server management |
| `/api/extensions/skill` | GET/POST | Skill server management |
| `/api/extensions/expert` | GET/POST | Expert library management |

---

## 🧪 Model Testing

### Test Dimensions

| Dimension | Icon | Content |
|-----------|------|---------|
| **Coding** | 💻 | Algorithm implementation, data structures |
| **Reasoning** | 🧠 | Logical reasoning, multi-step deduction |
| **Math** | 🔢 | Mathematical computation, proofs |
| **Creative Writing** | ✍️ | Format compliance, creative constraints |
| **Instruction Following** | 📋 | Complex instruction adherence |
| **Tool Use** | 🛠️ | API calls, structured output |
| **Multilingual** | 🌐 | Cross-language understanding |
| **Context** | 📚 | Long context retention, multi-turn dialogue |

### Scoring System

- Each dimension: **10 points** (2 questions × 5 points each)
- **Time-based linear scoring**: ≤50% of time limit = 5 points, linear decay to 2 points at time limit
- **Correctness coefficient**: multi-regex matching with partial credit
- **Quick test**: 3 minutes per question
- **Standard test**: 12 minutes per question, higher difficulty
- **Multimodal detection**: automatic vision/audio capability tagging

---

## 🧩 Extension System

### MCP Servers (28 presets)

| Category | Examples |
|----------|----------|
| **Filesystem** | File read/write, directory traversal |
| **Code** | GitHub integration, code search |
| **Database** | SQLite, PostgreSQL, Redis |
| **Search** | Web search, document retrieval |
| **AI Tools** | Image generation, TTS, STT |

### Skill Servers (27 presets)

Independent skill execution environments covering web automation, data analysis, system management, code review, and more.

### Expert Library (15 presets)

Pre-configured expert knowledge templates for common development workflows.

---

## 📝 Supported Languages

| Language | Extension | Runner |
|----------|-----------|--------|
| Python | `.py` | `python` |
| JavaScript | `.js` | `node` |
| TypeScript | `.ts` | `npx tsx` |
| C | `.c` | `gcc` |
| C++ | `.cpp` | `g++` |
| Go | `.go` | `go run` |
| Rust | `.rs` | `rustc` |
| Java | `.java` | `javac` + `java` |
| Ruby | `.rb` | `ruby` |
| Shell | `.sh` | `bash` |
| HTML | `.html` | Browser |
| CSS | `.css` | — |
| JSON | `.json` | — |
| Markdown | `.md` | — |

---

## 🛠 Development

### Prerequisites

- Node.js 20+
- npm 9+
- Windows x64 / macOS / Linux

### Tech Stack

| Layer | Technology |
|-------|------------|
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

# Desktop EXE
cd Mixture-of-Agents-Desktop && npm run build:all && npx electron-builder --win dir
```

---

## 📋 Changelog

### v1.0.0 (Latest)
- ✅ Multi-model collaborative chat with orchestrator
- ✅ Plan → Act → Observe → Replan orchestration loop
- ✅ Stateless verification sub-agents
- ✅ 17 preset providers with API pool management
- ✅ 8-dimension model capability testing (10-point scale)
- ✅ 28 MCP + 27 Skill + 15 Expert presets
- ✅ Monaco-based code editor with file management
- ✅ Multimodal detection (Vision / Audio)
- ✅ Context compression & cache optimization
- ✅ Dark / Light theme toggle
- ✅ Portable EXE packaging

---

## 📄 License

MIT License © 2025

---

<div align="center">

**Desktop (EXE) version → [Mixture-of-Agents-Desktop](../../Mixture-of-Agents-Desktop)**

</div>

---
---

<a id="chinese-doc"></a>

# ⚛️ Mixture of Agents — Web

### 基于 Claude Code 架构的多模型智能代理 Web 系统

<div align="center">

![Platform](https://img.shields.io/badge/platform-Web%20%2B%20Node.js-ff6b9f?style=for-the-badge)
![Node](https://img.shields.io/badge/node.js-20+-339933?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

</div>

[◀ 返回英文版 / Back to English](#top)

---

## 📑 目录

- [核心特性](#-核心特性)
- [架构说明](#-架构说明)
- [快速开始](#-快速开始)
- [配置说明](#-配置说明)
- [API 参考](#-api-参考)
- [模型能力测试](#-模型能力测试)
- [扩展系统](#-扩展系统)
- [支持语言](#-支持语言)
- [开发指南](#-开发指南)
- [更新日志](#-更新日志)
- [许可证](#-许可证)

---

## ✨ 核心特性

### 🤖 多模型协作对话
- **宏观调控模型** 分析任务，制定分步计划，分配子代理执行
- **计划→执行→观察→重规划** 循环（最多 12 轮）—— 与 Claude Code / Codex 核心一致
- **全局思考强度**：低 / 中 / 高 / 自动（由宏观模型决定子代理强度）
- 调控模型和子代理思考强度独立配置
- **无记忆验证代理** 每轮检查项目完整性
- **上下文压缩** —— DeepSeek 风格缓存友好消息格式
- SSE 流式响应，实时进度展示

### 🧪 模型能力测试
- **快速测试**（每题 ~3 分钟）和 **标准测试**（每题 ~12 分钟）
- 8 个维度：编码、推理、数学、创意写作、指令遵循、工具使用、多语言、上下文
- **10 分制评分**，线性时间拟合 + 多正则正确系数
- 自动多模态检测（视觉 / 音频）通过 API 测试
- 权威测试题库，具有区分度

### 🔌 提供商与模型管理
- **17 个预设提供商**：OpenAI、DeepSeek、智谱AI、Moonshot、SiliconFlow、StepFun、火山引擎、MiniMax、通义千问、百度、讯飞、百川、零一万物、腾讯、MiMo、Anthropic、本地/Ollama
- 每个提供商最多 50 个 API 密钥，自动轮换
- **API 池并发控制** —— 单密钥最大 80 并发
- 429/401/403 速率限制自动处理与密钥轮换
- 一键获取模型列表并自动探测能力（视觉/音频/多模态）
- 自定义提供商支持（任何 OpenAI 兼容 API）

### 🧩 扩展系统
- **28 个 MCP 服务器**预设（文件系统、GitHub、数据库、搜索、AI 工具等）
- **27 个技能服务器**预设（独立技能执行环境）
- **15 个专家库**预设（预配置技能模板）
- 所有扩展：一键添加、测试、启用/禁用、删除

### 📝 代码编辑器
- **Monaco 编辑器** —— 与 VS Code 相同的编辑引擎
- 内置文件树，右键菜单（新建/重命名/删除）
- **项目目录选择器** —— 选择任意工作区位置
- **智能文件创建** —— 自动追加正确的文件扩展名
- **改动高亮** —— 修改行的实时可视化标记
- 底部命令栏，支持 shell 命令执行
- 一键运行，支持 14+ 种语言

### 🏗 智能代理编排
- 参考 Claude Code、Codex、Trae、OpenHands、Cline、OpenSpec 设计
- 子代理可使用 **不同模型** 执行不同任务类型
- 任务验证循环 —— 调控模型分配无记忆子代理检查完成度
- 自动错误恢复与重试（最多 10 轮）
- 每个对话自动创建独立项目文件夹

---

## 🏗 架构说明

```
Mixture-of-Agents/
├── frontend/                     # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx               # 主应用（单文件 SPA）
│   │   ├── components/           # 聊天、编辑器、文件树、终端、测试、扩展
│   │   ├── services/api.ts       # API 客户端（支持 SSE）
│   │   └── types.ts              # TypeScript 类型定义
│   └── dist/                     # 构建产物（复制到 backend/public）
│
├── backend/                      # Express.js + TypeScript
│   ├── src/
│   │   ├── index.ts              # 服务入口
│   │   ├── providers/            # API 池管理 + 17 个提供商预设
│   │   │   ├── api-pool.ts       # 密钥轮换、并发控制、故障转移
│   │   │   └── presets.ts        # 提供商配置
│   │   ├── routes/
│   │   │   ├── chat.ts           # 编排器：计划→执行→观察→重规划 循环
│   │   │   ├── providers.ts      # 提供商 CRUD、模型获取
│   │   │   ├── testing.ts        # 8 维度模型能力测试
│   │   │   ├── extensions.ts     # MCP / 技能 / 专家管理
│   │   │   └── projects.ts       # 文件管理、代码执行
│   │   ├── services/
│   │   │   ├── llm-client.ts     # 统一 LLM API 客户端（流式 + 非流式）
│   │   │   └── project-service.ts # 项目文件操作
│   │   └── types.ts              # 共享类型定义
│   ├── public/                   # 静态前端文件（Express 托管）
│   ├── data/                     # 运行时数据（池状态、扩展配置）
│   └── dist/                     # 编译后的 TypeScript
│
└── README.md
```

### 编排流程

```
用户消息
    ↓
┌─────────────────────────────────────────┐
│  1. 思考 — 调控模型创建计划              │
│  2. 执行 — 写入文件、运行命令             │
│  3. 观察 — 检查错误、验证结果             │
│  4. 修复 — 有错误则生成修复方案           │
│  5. 重复（最多 12 轮）                   │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  验证 — 无记忆子代理检查项目完整性        │
└─────────────────────────────────────────┘
    ↓
完成 → 自动启动服务器并打开浏览器
```

---

## 🚀 快速开始

### 方式一：克隆运行

```bash
# 1. 克隆仓库
git clone https://github.com/bauerelizabeth07139/Mixture-of-Agents.git
cd Mixture-of-Agents

# 2. 安装前端依赖并构建
cd frontend
npm install
npm run build
cd ..

# 3. 安装后端依赖并编译
cd backend
npm install
npm run build
cd ..

# 4. 复制前端构建产物到后端 public 目录
Copy-Item -Path "frontend/dist/*" -Destination "backend/public/" -Recurse -Force

# 5. 启动服务
cd backend
npm start

# 6. 打开浏览器
# http://localhost:3001
```

### 方式二：开发模式

```bash
# 终端 1 — 后端（热重载）
cd backend
npm run dev

# 终端 2 — 前端（热更新）
cd frontend
npm run dev
```

### 方式三：桌面版（EXE）

从 [Mixture-of-Agents-Desktop](../../Mixture-of-Agents-Desktop) 下载，或从源码构建：

```bash
git clone https://github.com/bauerelizabeth07139/Mixture-of-Agents-Desktop.git
cd Mixture-of-Agents-Desktop
npm install
npm run build:all
npx electron-builder --win dir
# EXE 位于 release/win-unpacked/
```

---

## ⚙️ 配置说明

### 环境变量

| 变量 | 默认值 | 描述 |
|------|--------|------|
| `PORT` | `3001` | 后端服务端口 |

### API 密钥池

- **去重** —— 重复密钥自动移除
- **并发上限** —— 单密钥最大 80 并发
- **自动轮换** —— 达到上限自动切换下一个密钥
- **故障转移** —— 401/403 密钥自动从池中移除
- **余额排序** —— 按剩余余额优先使用

### 思考强度模式

| 模式 | 验证频率 | 修复深度 | 描述 |
|------|---------|---------|------|
| **高** | 每步验证 | 深度修复 | 每轮完整验证，积极纠错 |
| **中** | 每步验证 | 标准修复 | 快速验证，平衡修复 |
| **低** | 仅最终 | 最小修复 | 仅最终验证，最快执行 |
| **自动** | — | — | 调控模型评估任务难度并选择强度 |

---

## 🔌 API 参考

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/health` | GET | 健康检查 |
| `/api/providers` | GET | 列出所有提供商 |
| `/api/providers` | POST | 创建提供商 |
| `/api/providers/:id` | PUT | 更新提供商 |
| `/api/providers/:id` | DELETE | 删除提供商 |
| `/api/providers/:id/fetch-models` | POST | 从提供商获取模型列表 |
| `/api/chat` | POST | 发送对话消息（SSE 流式） |
| `/api/chat/projects` | GET | 列出工作区项目 |
| `/api/models` | GET | 列出所有已发现模型 |
| `/api/testing/run` | POST | 运行模型能力测试 |
| `/api/testing/price` | POST | 查询模型定价 |
| `/api/projects/files` | GET | 列出项目文件 |
| `/api/projects/run` | POST | 执行代码 |
| `/api/extensions/mcp` | GET/POST | MCP 服务器管理 |
| `/api/extensions/skill` | GET/POST | 技能服务器管理 |
| `/api/extensions/expert` | GET/POST | 专家库管理 |

---

## 🧪 模型能力测试

### 测试维度

| 维度 | 图标 | 内容 |
|------|------|------|
| **编码** | 💻 | 算法实现、数据结构 |
| **推理** | 🧠 | 逻辑推理、多步推导 |
| **数学** | 🔢 | 数学计算、证明 |
| **创意写作** | ✍️ | 格式遵循、创意约束 |
| **指令遵循** | 📋 | 复杂指令遵从 |
| **工具使用** | 🛠️ | API 调用、结构化输出 |
| **多语言** | 🌐 | 跨语言理解 |
| **上下文** | 📚 | 长上下文保持、多轮对话 |

### 评分系统

- 每个维度 **10 分制**，总分 80 分
- **线性时间评分**：≤50% 时间 = 5 分，线性递减至上限时 2 分
- **正确系数**：多模式正则匹配，支持部分得分
- **快速测试**：每题上限 3 分钟
- **标准测试**：每题上限 12 分钟（难度更高）
- **多模态检测**：自动视觉/音频能力标签

---

## 🧩 扩展系统

### MCP 服务器（28 个预设）

| 类别 | 示例 |
|------|------|
| **文件系统** | 文件读写、目录遍历 |
| **代码** | GitHub 集成、代码搜索 |
| **数据库** | SQLite、PostgreSQL、Redis |
| **搜索** | 网络搜索、文档检索 |
| **AI 工具** | 图像生成、TTS、STT |

### 技能服务器（27 个预设）

预配置的技能执行环境，覆盖 Web 自动化、数据分析、系统管理、代码审查等场景。

### 专家库（15 个预设）

常用开发工作流的即用型专家知识模板。

---

## 📝 支持语言

| 语言 | 扩展名 | 运行方式 |
|------|--------|----------|
| Python | `.py` | `python` |
| JavaScript | `.js` | `node` |
| TypeScript | `.ts` | `npx tsx` |
| C | `.c` | `gcc` |
| C++ | `.cpp` | `g++` |
| Go | `.go` | `go run` |
| Rust | `.rs` | `rustc` |
| Java | `.java` | `javac` + `java` |
| Ruby | `.rb` | `ruby` |
| Shell | `.sh` | `bash` |
| HTML | `.html` | 浏览器打开 |
| CSS | `.css` | — |
| JSON | `.json` | — |
| Markdown | `.md` | — |

---

## 🛠 开发指南

### 前置条件

- Node.js 20+
- npm 9+
- Windows x64 / macOS / Linux

### 技术栈

| 层级 | 技术 |
|------|------|
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

# 桌面版 EXE
cd Mixture-of-Agents-Desktop && npm run build:all && npx electron-builder --win dir
```

---

## 📋 更新日志

### v1.0.0（最新）
- ✅ 多模型协作对话，宏观调控智能调度
- ✅ 计划→执行→观察→重规划编排循环
- ✅ 无记忆验证子代理
- ✅ 17 个预设提供商，API 池管理
- ✅ 8 维度模型能力测试（10 分制）
- ✅ 28 MCP + 27 Skill + 15 专家预设
- ✅ Monaco 编辑器 + 文件管理
- ✅ 多模态检测（视觉/音频）
- ✅ 上下文压缩与缓存优化
- ✅ 深色/浅色主题切换
- ✅ 便携版与安装版 EXE 打包

---

## 📄 许可证

MIT License © 2025

---

<div align="center">

**桌面版 → [Mixture-of-Agents-Desktop](../../Mixture-of-Agents-Desktop)**

</div>
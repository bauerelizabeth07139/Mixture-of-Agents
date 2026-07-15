<div align="center">

# ⚛️ Mixture of Agents — Web

### Intelligent Multi-Model Agent System Built on Claude Code Architecture

### 基于 Claude Code 架构的多模型智能代理 Web 系统

---

![Platform](https://img.shields.io/badge/platform-Web%20%2B%20Node.js-ff6b9d?style=for-the-badge)
![Node](https://img.shields.io/badge/node.js-20+-339933?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

*Web-based multi-model AI agent system with collaborative chat, model testing, MCP/Skill extensions, and automated code execution.*

*基于 Web 的多模型 AI 代理系统，集成协作对话、模型测试、MCP/Skill 扩展和自动化代码执行。*

*For the Desktop (EXE) version, see [Mixture-of-Agents-Desktop](../../Mixture-of-Agents-Desktop)*

<br/>

[English](#-features) · [中文](#-核心特性) · [Quick Start / 快速开始](#-quick-start--快速开始) · [API Reference / API 参考](#-api-reference--api-参考)

</div>

---

## ✨ Features

### 🤖 Multi-Model Collaborative Chat
- **Orchestrator Model** analyzes tasks, dispatches sub-agents with different models
- **Global thinking intensity**: Low / Medium / High / Auto
- Orchestrator and sub-agent thinking strength configured independently
- **Context compression** for long conversations
- SSE streaming responses
- DeepSeek-style cache-friendly message formatting

### 🧪 Model Capability Testing
- **Quick Test** (~3 min) and **Standard Test** (~12 min)
- 8 dimensions: Coding, Reasoning, Math, Creative Writing, Instruction Following, Tool Use, Multilingual, Context
- **10-point scale** with linear time-based fitting and correctness coefficients
- Automatic multimodal detection (Vision / Audio) via API testing

### 🔌 Provider & Model Management
- **17 preset providers** with API pool management
- Max 80 concurrent requests per key, automatic rotation
- Rate limit handling (429/401/403) with key pool management
- One-click model fetch with capability detection

### 🧩 Extension System
- **28 MCP Server** presets (Filesystem, GitHub, Search, Database, AI, Cloud...)
- **27 Skill Server** presets (stdio / HTTP transport)
- **15 Expert/Skill** presets

### 📝 Code Editor
- Monaco Editor with file tree, smart templates (14 languages)
- One-click code execution
- Change highlighting and command bar

---

## 🚀 Quick Start / 快速开始

### From Source / 从源码构建

```bash
# Clone / 克隆
git clone https://github.com/bauerelizabeth07139/Mixture-of-Agents.git
cd Mixture-of-Agents

# Install / 安装
npm install

# Build / 构建
cd frontend && npm install && npm run build && cd ..
cd backend && npm install && npm run build && cd ..

# Start / 启动
cd backend && npm start
# Open http://localhost:3001
```

### Development Mode / 开发模式

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

---

## 🔌 API Reference

| Endpoint / 端点 | Method | Description / 描述 |
|----------------|--------|---------------------|
| `/api/health` | GET | Health check / 健康检查 |
| `/api/providers` | GET/POST | Provider CRUD / 提供商管理 |
| `/api/providers/:id/fetch-models` | POST | Fetch models from provider / 获取模型列表 |
| `/api/providers/:id/test` | POST | Test provider connectivity / 测试连接 |
| `/api/chat/send` | POST | Send chat message (SSE) / 发送对话 |
| `/api/models` | GET | List all models / 列出所有模型 |
| `/api/models/capabilities/:id` | GET | Model capabilities / 模型能力 |
| `/api/testing/run` | POST | Run model test / 运行模型测试 |
| `/api/testing/provider/:id` | POST | Test all models in provider / 测试提供商全部模型 |
| `/api/testing/all` | POST | Test all models / 测试全部模型 |
| `/api/projects/files` | GET | List project files / 列出项目文件 |
| `/api/projects/file` | GET/PUT | Read/write file / 读写文件 |
| `/api/projects/run` | POST | Execute code file / 执行代码文件 |
| `/api/extensions/mcp` | GET/POST | MCP server management / MCP 服务器管理 |
| `/api/extensions/skill` | GET/POST | Skill management / 技能管理 |
| `/api/extensions/skill-server` | GET/POST | Skill server management / 技能服务器管理 |

---

## 🏗 Architecture / 架构

```
Mixture-of-Agents/
├── frontend/                    # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx              # Main application
│   │   ├── components/          # Editor, File Manager, Terminal
│   │   ├── services/api.ts      # API client
│   │   └── types.ts
│   └── dist/                    # Built frontend
│
├── backend/                     # Express.js + TypeScript
│   ├── src/
│   │   ├── index.ts             # Server entry
│   │   ├── providers/           # API pool & presets (17 providers)
│   │   ├── routes/              # REST + SSE endpoints
│   │   └── services/            # Project, Extension, Code execution
│   └── public/                  # Static frontend files
│
└── README.md
```

---

## 📋 Changelog / 更新日志

### v1.0.0 (Latest)
- ✅ Multi-model chat with orchestrator
- ✅ 17 preset providers with API pool
- ✅ 8-dimension model testing (10-point scale)
- ✅ 28 MCP + 27 Skill + 15 Expert presets
- ✅ Monaco-based code editor
- ✅ Multimodal detection
- ✅ Context compression & cache optimization

---

## 📄 License

MIT License © 2025

---

<div align="center">

**For the Desktop (EXE) version → [Mixture-of-Agents-Desktop](../../Mixture-of-Agents-Desktop)**

*For the Web version → You are here*

</div>
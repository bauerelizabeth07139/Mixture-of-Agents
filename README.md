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
- **28 MCP Server** presets
- **27 Skill Server** presets
- **15 Expert/Skill** presets

### 📝 Code Editor
- Monaco Editor with file tree, smart templates (14 languages)
- One-click code execution, change highlighting, command bar

---

## 🚀 Quick Start

```bash
git clone https://github.com/bauerelizabeth07139/Mixture-of-Agents.git
cd Mixture-of-Agents
npm install
cd frontend && npm install && npm run build && cd ..
cd backend && npm install && npm run build && cd ..
cd backend && npm start
# Open http://localhost:3001
```

### Development Mode

```bash
# Terminal 1: Backend
cd backend && npm run dev
# Terminal 2: Frontend
cd frontend && npm run dev
```

---

## 🔌 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/providers` | GET/POST | Provider CRUD |
| `/api/providers/:id/fetch-models` | POST | Fetch models |
| `/api/chat/send` | POST | Send chat (SSE) |
| `/api/models` | GET | List all models |
| `/api/testing/run` | POST | Run model test |
| `/api/projects/files` | GET | List project files |
| `/api/projects/run` | POST | Execute code |
| `/api/extensions/mcp` | GET/POST | MCP management |
| `/api/extensions/skill` | GET/POST | Skill management |

---

## 🏗 Architecture

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
│   │   ├── providers/           # API pool & 17 presets
│   │   ├── routes/              # REST + SSE endpoints
│   │   └── services/            # Project, Extension, Code execution
│   └── public/                  # Static frontend files
│
└── README.md
```

---

## 📋 Changelog

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

</div>

---
---

<a id="chinese-doc"></a>`n`n# 中文文档

<div align="center">

# ⚛️ Mixture of Agents — Web

### 基于 Claude Code 架构的多模型智能代理 Web 系统

</div>

[◀ 返回英文版 / Back to English](#top)

---

## ✨ 核心特性

### 🤖 多模型协作对话
- **宏观调控模型**分析任务，自动分配子代理执行
- **全局思考强度**：低 / 中 / 高 / 自动
- 调控模型和子代理思考强度独立配置
- **上下文压缩**，长对话自动精简
- SSE 流式响应
- DeepSeek 风格缓存友好消息格式

### 🧪 模型能力测试
- **快速测试**（~3 分钟）和**标准测试**（~12 分钟）
- 8 个维度：编码、推理、数学、创意写作、指令遵循、工具使用、多语言、上下文
- **10 分制评分**，线性时间拟合 + 正确系数
- 自动多模态检测（视觉/音频）

### 🔌 提供商与模型管理
- **17 个预设提供商**，API 池管理
- 单密钥最大 80 并发，自动轮换
- 429/401/403 速率限制处理
- 一键获取模型列表并探测能力

### 🧩 扩展系统
- **28 个 MCP 服务器**预设
- **27 个技能服务器**预设
- **15 个专家库**预设

### 📝 代码编辑器
- Monaco 编辑器 + 文件树 + 14 种语言智能模板
- 一键运行、改动高亮、命令栏

---

## 🚀 快速开始

```bash
git clone https://github.com/bauerelizabeth07139/Mixture-of-Agents.git
cd Mixture-of-Agents
npm install
cd frontend && npm install && npm run build && cd ..
cd backend && npm install && npm run build && cd ..
cd backend && npm start
# 打开 http://localhost:3001
```

### 开发模式

```bash
# 终端 1：后端
cd backend && npm run dev
# 终端 2：前端
cd frontend && npm run dev
```

---

## 🔌 API 参考

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/health` | GET | 健康检查 |
| `/api/providers` | GET/POST | 提供商管理 |
| `/api/providers/:id/fetch-models` | POST | 获取模型列表 |
| `/api/chat/send` | POST | 发送对话（SSE） |
| `/api/models` | GET | 列出所有模型 |
| `/api/testing/run` | POST | 运行模型测试 |
| `/api/projects/files` | GET | 列出项目文件 |
| `/api/projects/run` | POST | 执行代码 |
| `/api/extensions/mcp` | GET/POST | MCP 管理 |
| `/api/extensions/skill` | GET/POST | 技能管理 |

---

## 🏗 架构说明

```
Mixture-of-Agents/
├── frontend/                    # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx              # 主应用
│   │   ├── components/          # 编辑器、文件管理、终端
│   │   ├── services/api.ts      # API 客户端
│   │   └── types.ts
│   └── dist/                    # 构建产物
│
├── backend/                     # Express.js + TypeScript
│   ├── src/
│   │   ├── index.ts             # 服务入口
│   │   ├── providers/           # API 池 & 17 个预设
│   │   ├── routes/              # REST + SSE 端点
│   │   └── services/            # 项目、扩展、代码执行
│   └── public/                  # 静态前端文件
│
└── README.md
```

---

## 📋 更新日志

### v1.0.0（最新）
- ✅ 多模型协作对话，宏观调控
- ✅ 17 个预设提供商，API 池管理
- ✅ 8 维度模型测试（10 分制）
- ✅ 28 MCP + 27 Skill + 15 专家预设
- ✅ Monaco 编辑器
- ✅ 多模态检测
- ✅ 上下文压缩与缓存优化

---

## 📄 许可证

MIT License © 2025

---

<div align="center">

**Desktop 桌面版 → [Mixture-of-Agents-Desktop](../../Mixture-of-Agents-Desktop)**

</div>
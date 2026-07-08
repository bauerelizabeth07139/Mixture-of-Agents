# Mixture of Agents (MoA)

Multi-model collaborative agent system driven by intelligent scheduling engine.

![Platform](https://img.shields.io/badge/platform-Windows%20|%20macOS%20|%20Linux-blue)
![Node](https://img.shields.io/badge/node.js-18+-339933)
![License](https://img.shields.io/badge/license-MIT-green)

## Core Features

- Intelligent scheduling engine with adaptive task decomposition
- Multi-model collaboration across same/different API keys
- Cost/efficiency control slider (0 = efficiency, 1 = cost)
- API pool management: up to 50 keys per URL with auto-failover
- Context library: question bank (50) + sub-agent strategy library
- Capability testing: 8 standardized tests
- Dark/Light theme: Codex-style UI

## Quick Start

Prerequisites: Node.js 18+

```bash
git clone https://github.com/bauerelizabeth07139/Mixture-of-Agents.git
cd Mixture-of-Agents

# Start backend
cd backend && npm install && npm run dev

# Start frontend (new terminal)
cd frontend && npm install && npm run dev
```

### Windows one-click start

```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
```

## Configure API Key

Manage API Keys via the Web UI:

1. Go to Providers page
2. Select a provider (MiMo, OpenAI, DeepSeek, etc.)
3. Add your API Key
4. Click Fetch Models to discover available models

## MIMO API Key Test Results

| Model | Status | Description |
|-------|--------|-------------|
| mimo-v2.5 | Available | Full-modal model with reasoning |
| mimo-v2.5-pro | Available | Reasoning flagship model |
| mimo-v2.5-tts | Available | Text-to-Speech |
| mimo-v2.5-asr | Available | Speech recognition |

API endpoint: https://api.xiaomimimo.com/v1

## Preset Providers (17)

OpenAI, DeepSeek, Zhipu AI, Moonshot, SiliconFlow, StepFun, Volcengine, MiniMax, Qwen, Baidu, iFlytek, Baichuan, LingYiwanWu, Tencent, MiMo, Anthropic, Local/Ollama

## Architecture

```text
        Intelligent Scheduling Engine (Macro Orchestrator)
       /      |       |       \
  Code Agent  Reasoning  Chat  Multimodal
```

### Scheduling Protocol

1. Task decomposition: assign sub-agents by capability
2. Failure evaluation: retry / switch_model / abort
3. Context awareness: reference question bank to avoid duplication
4. Result aggregation: synthesize, remove contradictions, fill gaps
5. No compromise: exhaust all options before marking failure

## Tech Stack

- Frontend: React 18 + TypeScript + Vite
- Backend: Express + TypeScript + WebSocket
- Theme: Codex-style dark/light toggle
- Real-time: WebSocket for task progress

## Project Structure

```text
Mixture-of-Agents/
├── backend/                 # Express backend
│   └── src/
│       ├── orchestrator/    # Scheduling engine
│       ├── providers/       # API pool + 17 presets
│       ├── services/        # LLM client, testing, coding engine
│       └── routes/          # API routes
├── frontend/                # React frontend
│   └── src/
│       ├── App.tsx          # Main UI
│       └── styles/          # Codex-style themes
└── start.ps1                # Windows launcher
```

## License

MIT
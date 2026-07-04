# Mixture of Agents (MoA)

Multi-model collaborative agent system with macro orchestrator.

## Architecture

```
         Orchestrator (default model)
              |    |    |
         Agent1 Agent2 Agent3
         (code) (agent)(chat)
```

## Features

- Multi-model collaboration under same/different API keys
- Cost/Efficiency slider (0-1, draggable + input box)
- API pool: up to 50 keys per URL, auto-failover
- Issue library (last 50), agent summaries (completed: last 20)
- 15+ preset providers (OpenAI, DeepSeek, SiliconFlow, etc.)
- Model capability scoring (code, agent, chat, context, speed, multimodal)
- Thinking modes: low/medium/high
- TTS and image generation model support
- Real-time WebSocket monitoring

## Quick Start

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

Visit http://localhost:5173

## Preset Providers

| Provider | URL |
|----------|-----|
| OpenAI | api.openai.com/v1 |
| DeepSeek | api.deepseek.com/v1 |
| Zhipu AI | open.bigmodel.cn/api/paas/v4 |
| Moonshot | api.moonshot.cn/v1 |
| SiliconFlow | api.siliconflow.cn/v1 |
| StepFun | api.stepfun.com/v1 |
| Volcengine | ark.cn-beijing.volces.com/api/v3 |
| MiniMax | api.minimax.chat/v1 |
| Qwen | dashscope.aliyuncs.com/compatible-mode/v1 |
| Baidu | aip.baidubce.com |
| iFlytek | spark-api-open.xf-yun.com/v1 |
| Baichuan | api.baichuan-ai.com/v1 |
| Anthropic | api.anthropic.com/v1 |
| MiMo | api.mimo.ai/v1 |
| Local/Ollama | localhost:11434/v1 |

## Tech Stack

- Backend: Node.js + Express + TypeScript + WebSocket
- Frontend: React + TypeScript + Vite

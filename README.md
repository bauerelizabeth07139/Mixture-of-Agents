# Mixture of Agents (MoA)

多模型协同智能体系统 — 智能调度引擎驱动，通过宏观调控模型动态分配子代理。

## 核心架构

```
        智能调度引擎 (Macro Orchestrator)
       /      |       |       \
  Code Agent  Reasoning  Chat  Multimodal
```

## 核心特性

- 智能调度引擎: 自适应任务分解、失败评估、模型切换
- 多模型协同: 同一/不同API Key下模型协同
- 成本/效率控制: 进度条+数字输入 (0=效率, 0.5=均衡, 1=成本)
- API池管理: 每URL最多50条Key，自动故障转移
- 上下文库: 问题库(50条) + 子代理概略库(完成20条/未完成)
- 思考强度: 低/中/高
- 17+预设提供商 + 自动模型发现
- 模型能力评分 + TTS/图片/ASR支持

## 快速开始

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

## 预设提供商 (17家)

OpenAI, DeepSeek, 智谱AI, 月之暗面, 硅基流动, 阶跃星辰, 火山引擎, MiniMax, 通义千问, 百度千帆, 讯飞星火, 百川智能, 零一万物, 腾讯混元, 小米MiMo, Anthropic, 本地/Ollama

## 调度引擎决策协议

1. 任务分解: 按能力分配子代理
2. 失败评估: retry / switch_model / abort
3. 上下文感知: 引用问题库避免重复
4. 结果聚合: 合成、去矛盾、填补空白
5. 绝不妥协: 用尽方案才标记失败

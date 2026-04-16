# Claude Agent SDK Demo

基于 `@anthropic-ai/claude-agent-sdk` 的示例项目，演示核心功能。

## 安装

```bash
npm install
```

## 环境变量

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

## Demo 文件

| 文件 | 演示内容 |
|------|----------|
| `1-basic-chat.ts` | 基础对话：创建 Agent、发送消息、获取回复 |
| `2-multi-turn.ts` | 多轮对话 + 工具调用追踪 |
| `3-hooks.ts` | Hook 系统：onStart/onToolUse/onMessage/onComplete 等 |
| `4-model-selection.ts` | 模型切换：不同模型比较、动态切换 |
| `5-advanced.ts` | 高级控制：流式输出、暂停/恢复、状态管理 |

## 运行

```bash
# 基础对话
npx ts-node src/1-basic-chat.ts

# 多轮对话 + 工具调用
npx ts-node src/2-multi-turn.ts

# Hook 控制
npx ts-node src/3-hooks.ts

# 模型切换
npx ts-node src/4-model-selection.ts

# 高级功能
npx ts-node src/5-advanced.ts
```

## 核心 API 概览

```typescript
import { Agent } from "@anthropic-ai/claude-agent-sdk";

// 创建 Agent
const agent = new Agent({
  model: "claude-3-5-sonnet-20241022",
  systemPrompt: "你的角色设定",
  tools: [...],       // 可用工具列表
  hooks: {...},       // 生命周期钩子
});

// 运行对话
const response = await agent.run({ message: "你好" });

// 工具调用追踪
agent.getToolCalls();

// 对话历史
agent.getConversationHistory();

// 状态管理
agent.getStatus();     // 'idle' | 'running' | 'paused' | 'completed'
agent.pause();
agent.resume();
agent.interrupt();

// 模型切换
agent.setModel("claude-3-5-haiku-20241022");
agent.getModel();
```

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
| `1-startup-and-query.ts` | 初始化 SDK + 基础 query |
| `2-session-management.ts` | 会话管理：创建/多轮/历史/重命名/标记 |
| `3-hooks.ts` | Hook 系统：工具 Hook + 会话 Hook |
| `4-model-selection.ts` | 模型切换：不同模型比较 |

## 运行

```bash
# 初始化 + 基础查询
npx ts-node src/1-startup-and-query.ts

# 会话管理
npx ts-node src/2-session-management.ts

# Hook 系统
npx ts-node src/3-hooks.ts

# 模型切换
npx ts-node src/4-model-selection.ts
```

## 核心 API 概览

```typescript
import {
  startup,      // 初始化 SDK
  shutdown,     // 关闭 SDK
  query,        // 发送消息（简单方式）
  tool,         // 注册工具
  unstable_v2_createSession,  // 创建会话
  unstable_v2_prompt,         // 发送消息到会话
  unstable_v2_resumeSession,  // 恢复会话
  listSessions, // 列出所有会话
  getSessionMessages, // 获取会话历史
  renameSession, // 重命名会话
  tagSession,    // 标记会话
} from "@anthropic-ai/claude-agent-sdk";

// 初始化
await startup({});

// 方式一：直接 query
const result = await query({ message: "你好" });

// 方式二：创建会话后多轮对话
const session = await unstable_v2_createSession({
  systemPrompt: "你是...",
  model: "claude-sonnet-4-20250514",
  hooks: {...},
});
const r1 = await unstable_v2_prompt("第一轮消息", {});
const r2 = await unstable_v2_prompt("第二轮（上下文保持）", {});

// 注册工具
const myTool = tool("tool_name", "描述", { arg: { type: "string" } }, async (args) => {
  return { result: "..." };
}, {
  onCall: (args) => { /* 调用前 */ },
  onResult: (result) => { /* 调用后 */ },
});

// 会话管理
const sessions = await listSessions({});
const messages = await getSessionMessages(sessionId, {});
await renameSession(sessionId, "新标题");
await tagSession(sessionId, "tag");
```

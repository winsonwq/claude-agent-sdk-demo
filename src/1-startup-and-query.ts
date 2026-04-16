/**
 * Demo 1: 初始化 + 基础查询
 * 
 * SDK 需要先 startup() 初始化，然后通过 query() 发消息。
 */

import { startup, query, shutdown } from "@anthropic-ai/claude-agent-sdk";

async function main() {
  console.log("=== Demo 1: 初始化 + 基础查询 ===\n");

  // 初始化 SDK
  const started = await startup({
    // 不传 agentPath 会启动内置的最小 Agent
  });
  console.log("SDK 启动:", started.ok ? "成功" : "失败");

  if (!started.ok) {
    console.error("启动失败:", started.error);
    return;
  }

  try {
    // 发送查询
    console.log("\n发送查询: '解释一下 TypeScript 的类型系统'\n");
    const result = await query({
      message: "解释一下 TypeScript 的类型系统",
    });

    console.log("--- 结果 ---");
    console.log("结果:", result.message);
    console.log("Usage:", {
      inputTokens: result.usage.input_tokens,
      outputTokens: result.usage.output_tokens,
    });
  } finally {
    // 关闭 SDK
    await shutdown();
  }
}

main().catch(console.error);

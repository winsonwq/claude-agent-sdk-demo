/**
 * Demo 3: Hook 系统
 * 
 * SDK 提供两种 Hook 机制：
 * 1. 注册工具时的 callback（onCall, onResult）
 * 2. createSession 的 hooks 参数（会话生命周期）
 */

import {
  startup,
  shutdown,
  tool,
  unstable_v2_createSession,
  unstable_v2_prompt,
} from "@anthropic-ai/claude-agent-sdk";

async function main() {
  await startup({});

  try {
    console.log("=== Demo 3: Hook 系统 ===\n");

    // --- 注册工具 + Hook ---
    console.log("--- 注册带 Hook 的工具 ---");

    // 注册一个 "calculate" 工具
    const calcTool = tool(
      "calculate",
      "执行数学计算",
      {
        expression: {
          type: "string",
          description: "要计算的数学表达式，如 '2 + 3 * 4'",
        },
      },
      async (args) => {
        // onResult hook: 工具执行完后
        console.log(`[Hook] calculate 被调用，输入: ${args.expression}`);

        try {
          // 安全地计算表达式（仅支持基本运算）
          const result = Function(`"use strict"; return (${args.expression})`)();
          return { result };
        } catch {
          return { error: "计算表达式无效" };
        }
      },
      {
        // onCall hook: 工具被调用前
        onCall: (args) => {
          console.log(`[Hook] calculate 将被调用，参数:`, args);
        },
        // onResult hook: 工具执行后
        onResult: (result) => {
          console.log(`[Hook] calculate 结果:`, result);
        },
      }
    );

    // --- 创建带会话 Hook 的会话 ---
    console.log("\n--- 创建带会话 Hook 的会话 ---");

    const session = await unstable_v2_createSession({
      systemPrompt: "你是一个数学助手，可以执行计算。",
      hooks: {
        // 会话开始
        onStart: () => {
          console.log("[Hook] 会话开始");
        },
        // 消息发送前（可以修改消息或拒绝）
        onMessage: (msg: any) => {
          console.log(`[Hook] 收到消息: ${msg.type}`);
          // 返回 undefined 表示不拦截
        },
        // 发生错误
        onError: (error: Error) => {
          console.error("[Hook] 会话错误:", error.message);
        },
        // 会话完成
        onComplete: () => {
          console.log("[Hook] 会话完成");
        },
      },
    });

    // --- 测试对话 + 工具调用 ---
    console.log("\n--- 测试对话 ---");
    const r1 = await unstable_v2_prompt("计算 (15 + 25) * 2 等于多少？", {});
    console.log("回复:", r1.message.text);

    const r2 = await unstable_v2_prompt("再除以 5 呢？", {});
    console.log("回复:", r2.message.text);

  } finally {
    await shutdown();
  }
}

main().catch(console.error);

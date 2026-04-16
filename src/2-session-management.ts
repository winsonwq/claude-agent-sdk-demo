/**
 * Demo 2: 会话管理
 * 
 * 演示：
 * 1. 创建会话
 * 2. 多轮对话（上下文保持）
 * 3. 查询会话历史
 * 4. 重命名/标记会话
 */

import {
  startup,
  shutdown,
  unstable_v2_createSession,
  unstable_v2_prompt,
  unstable_v2_resumeSession,
  listSessions,
  getSessionMessages,
  renameSession,
  tagSession,
} from "@anthropic-ai/claude-agent-sdk";

async function main() {
  await startup({});

  try {
    // --- 创建新会话 ---
    console.log("=== Demo 2: 会话管理 ===\n");

    console.log("--- 创建新会话 ---");
    const session = await unstable_v2_createSession({
      systemPrompt: "你是一个代码助手，用简洁的语言回答。",
      model: "claude-sonnet-4-20250514",
    });
    console.log("会话 ID:", session.sessionId);
    console.log("会话状态:", session.status);

    // --- 第 1 轮对话 ---
    console.log("\n--- 第 1 轮 ---");
    const r1 = await unstable_v2_prompt("什么是闭包？", {});
    console.log("回复:", r1.message.text?.slice(0, 100) + "...");

    // --- 第 2 轮（上下文保持）---
    console.log("\n--- 第 2 轮（上下文保持）---");
    const r2 = await unstable_v2_prompt("举一个 JavaScript 的例子", {});
    console.log("回复:", r2.message.text?.slice(0, 100) + "...");

    // --- 查看会话历史 ---
    console.log("\n--- 会话历史 ---");
    const messages = await getSessionMessages(session.sessionId, {});
    console.log(`共 ${messages.length} 条消息`);
    messages.forEach((m: any, i: number) => {
      const role = m.type === "user" ? "👤 User" : "🤖 Assistant";
      const text = m.message?.text?.slice(0, 60) || m.message?.content?.[0]?.text?.slice(0, 60) || "";
      console.log(`${i + 1}. ${role}: ${text}...`);
    });

    // --- 重命名会话 ---
    console.log("\n--- 重命名会话 ---");
    await renameSession(session.sessionId, "JavaScript 闭包讲解");
    console.log("已重命名为: JavaScript 闭包讲解");

    // --- 标记会话 ---
    console.log("\n--- 标记会话 ---");
    await tagSession(session.sessionId, "javascript");
    console.log("已标记: javascript");

    // --- 列出所有会话 ---
    console.log("\n--- 所有会话 ---");
    const sessions = await listSessions({});
    console.log(`共 ${sessions.length} 个会话`);
    sessions.forEach((s: any) => {
      console.log(`  - ${s.sessionId.slice(0, 8)}... | ${s.title || "(无标题)"} | tags: ${s.tags?.join(", ") || "无"}`);
    });
  } finally {
    await shutdown();
  }
}

main().catch(console.error);

/**
 * Demo 4: 模型切换
 * 
 * SDK 支持在创建会话时指定模型，或在会话中动态切换。
 */

import {
  startup,
  shutdown,
  unstable_v2_createSession,
  unstable_v2_prompt,
} from "@anthropic-ai/claude-agent-sdk";

async function main() {
  await startup({});

  try {
    console.log("=== Demo 4: 模型切换 ===\n");

    const MODELS = [
      { id: "claude-sonnet-4-20250514", name: "Sonnet 4", speed: "快速" },
      { id: "claude-opus-4-20250514", name: "Opus 4", speed: "最强" },
      { id: "claude-haiku-4-20250514", name: "Haiku 4", speed: "最快" },
    ];

    // --- 比较不同模型 ---
    console.log("--- 比较不同模型回答同一问题 ---\n");

    const question = "为什么天空是蓝色的？";

    for (const model of MODELS) {
      console.log(`\n--- ${model.name} (${model.speed}) ---`);
      const session = await unstable_v2_createSession({
        systemPrompt: "简洁回答，只说重点，不超过3句话。",
        model: model.id,
      });

      const result = await unstable_v2_prompt(question, {});
      console.log(`回复: ${result.message.text?.slice(0, 80)}...`);
      console.log(`Tokens: 输入 ${result.message.usage?.input_tokens} | 输出 ${result.message.usage?.output_tokens}`);
    }

    // --- 动态切换模型 ---
    console.log("\n--- 动态切换模型 ---");

    // 创建 Haiku 会话（快速）
    let session = await unstable_v2_createSession({
      systemPrompt: "你是助手。",
      model: "claude-haiku-4-20250514",
    });

    let r = await unstable_v2_prompt("1+1=?", {});
    console.log("Haiku 回复:", r.message.text);

    // 切换到 Opus（更强）
    console.log("\n切换到 Opus...");
    session = await unstable_v2_createSession({
      systemPrompt: "你是助手。",
      model: "claude-opus-4-20250514",
    });

    r = await unstable_v2_prompt("解释量子计算的基本原理", {});
    console.log("Opus 回复:", r.message.text?.slice(0, 100) + "...");

  } finally {
    await shutdown();
  }
}

main().catch(console.error);

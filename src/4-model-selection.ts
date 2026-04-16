/**
 * Demo 4: 模型切换
 * 
 * 演示：
 * 1. 不同模型的比较
 * 2. 动态切换模型
 * 3. 模型参数配置
 */

import { Agent } from "@anthropic-ai/claude-agent-sdk";

// 可用模型列表
const MODELS = {
  "claude-3-5-sonnet-20241022": "Sonnet 4 (最新)",
  "claude-3-5-haiku-20241022": "Haiku 3.5 (快速)",
  "claude-3-opus-20240229": "Opus 3 (最强大)",
} as const;

async function compareModels(prompt: string) {
  console.log("=== Demo 4: 模型切换 ===\n");
  console.log(`查询: "${prompt}"\n`);

  const results: Record<string, { text: string; inputTokens: number; outputTokens: number; time: number }> = {};

  for (const [model, desc] of Object.entries(MODELS)) {
    console.log(`--- ${desc} (${model}) ---`);

    const agent = new Agent({
      model,
      systemPrompt: "简洁回答，只说重点。",
    });

    const start = Date.now();
    const response = await agent.run({ message: prompt });
    const elapsed = Date.now() - start;

    results[model] = {
      text: response.text,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      time: elapsed,
    };

    console.log(`回复: ${response.text}`);
    console.log(`耗时: ${elapsed}ms | 输入: ${response.usage.input_tokens} | 输出: ${response.usage.output_tokens}\n`);
  }

  // 总结对比
  console.log("--- 对比总结 ---");
  for (const [model, result] of Object.entries(results)) {
    const desc = MODELS[model as keyof typeof MODELS] || model;
    console.log(`${desc}: ${result.time}ms, ${result.outputTokens} output tokens`);
  }
}

async function dynamicModelSwitch() {
  console.log("\n--- 动态切换模型 ---");

  const agent = new Agent({
    model: "claude-3-5-haiku-20241022", // 默认用快速的
    systemPrompt: "你是助手。",
  });

  // 问一个简单问题（Haiku 够用）
  const r1 = await agent.run({ message: "1+1等于几？" });
  console.log("Haiku 回复:", r1.text);
  console.log("当前模型:", agent.getModel());

  // 切到更强的模型
  console.log("\n切换到 Sonnet...");
  agent.setModel("claude-3-5-sonnet-20241022");

  const r2 = await agent.run({ message: "解释一下量子计算的基本原理" });
  console.log("Sonnet 回复:", r2.text.slice(0, 100) + "...");
  console.log("当前模型:", agent.getModel());

  // 查看所有可用模型
  console.log("\n--- 可用模型 ---");
  const available = agent.getAvailableModels();
  available.forEach((m: string) => console.log(`  - ${m}`));
}

async function main() {
  await compareModels("为什么天空是蓝色的？");
  await dynamicModelSwitch();
}

main().catch(console.error);

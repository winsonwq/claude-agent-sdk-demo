/**
 * Demo 5: 高级控制 - 流式输出 / 中断 / 状态管理
 * 
 * 演示：
 * 1. 流式输出 (streaming)
 * 2. 中断 Agent 运行
 * 3. 状态暂停/恢复
 * 4. 增量输出处理
 */

import { Agent } from "@anthropic-ai/claude-agent-sdk";

async function streamingDemo() {
  console.log("=== Demo 5: 流式输出与中断 ===\n");

  const agent = new Agent({
    model: "claude-3-5-sonnet-20241022",
    systemPrompt: "你是一个作家，用生动的语言讲故事。",
  });

  // 启动流式响应（不等待完整回复）
  const stream = agent.runStream({
    message: "给我讲一个关于 AI 的科幻小故事，至少 500 字。",
  });

  console.log("--- 流式接收中 (可随时 Ctrl+C 中断) ---\n");

  let fullText = "";
  let chunkCount = 0;

  // 实时处理每个 chunk
  stream.on("chunk", (chunk: string) => {
    fullText += chunk;
    chunkCount++;
    process.stdout.write(chunk); // 实时打印
  });

  stream.on("done", () => {
    console.log("\n\n--- 流式接收完成 ---");
    console.log(`共 ${chunkCount} 个 chunks`);
    console.log(`总长度: ${fullText.length} 字符`);
  });

  stream.on("error", (err: Error) => {
    console.error("流式错误:", err.message);
  });

  // 可以随时中断
  // setTimeout(() => stream.interrupt(), 2000);
}

async function pauseResumeDemo() {
  console.log("\n\n=== 暂停/恢复 Demo ===\n");

  const agent = new Agent({
    model: "claude-3-5-sonnet-20241022",
    systemPrompt: "你是一个技术顾问。",
  });

  // 启动一个较长的任务
  const task = agent.run({
    message: "写一个完整的 Python FastAPI 应用代码，不少于 300 行",
  });

  // 暂停
  console.log("暂停 Agent...");
  agent.pause();

  // 可以在暂停时做其他事情
  console.log("Agent 已暂停，可以做其他事情...");

  // 恢复
  console.log("恢复 Agent...");
  const response = await agent.resume();

  console.log("\n最终回复长度:", response.text.length, "字符");
}

async function stateManagementDemo() {
  console.log("\n\n=== 状态管理 Demo ===\n");

  const agent = new Agent({
    model: "claude-3-5-sonnet-20241022",
    systemPrompt: "你是一个数学老师。",
  });

  // Agent 有多种状态
  console.log("初始状态:", agent.getStatus()); // 'idle'

  const task = agent.run({ message: "解释微积分的基本概念" });
  console.log("运行中状态:", agent.getStatus()); // 'running'

  const response = await task;
  console.log("完成状态:", agent.getStatus()); // 'completed'

  // 检查是否已完成
  if (agent.isComplete()) {
    console.log("✅ Agent 已成功完成");
  }

  // 获取本次会话的统计
  const stats = agent.getStats();
  console.log("会话统计:", {
    totalTokens: stats.totalTokens,
    toolCalls: stats.toolCalls,
    duration: stats.duration,
  });
}

async function main() {
  await streamingDemo();
  await pauseResumeDemo();
  await stateManagementDemo();
}

main().catch(console.error);

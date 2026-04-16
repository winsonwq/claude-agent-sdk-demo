/**
 * Demo 1: 基础对话
 * 
 * 创建 Agent，发送单条消息，打印回复。
 */

import { Agent } from "@anthropic-ai/claude-agent-sdk";

async function main() {
  console.log("=== Demo 1: 基础对话 ===\n");

  // 创建 Agent 实例
  const agent = new Agent({
    model: "claude-3-5-sonnet-20241022",
    systemPrompt: "你是一个有帮助的助手，用简洁的语言回答问题。",
  });

  // 发送消息并获取回复
  const response = await agent.run({
    message: "什么是 TypeScript？",
  });

  console.log("模型:", response.model);
  console.log("回复:", response.text);
  console.log("输入 tokens:", response.usage.input_tokens);
  console.log("输出 tokens:", response.usage.output_tokens);
}

main().catch(console.error);

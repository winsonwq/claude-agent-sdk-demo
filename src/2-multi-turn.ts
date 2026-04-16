/**
 * Demo 2: 多轮对话 + 工具调用追踪
 * 
 * 演示：
 * 1. 多轮对话上下文保持
 * 2. 工具调用记录与追踪
 * 3. 对话历史查看
 */

import { Agent, ToolResult } from "@anthropic-ai/claude-agent-sdk";

async function main() {
  console.log("=== Demo 2: 多轮对话 + 工具调用追踪 ===\n");

  // 创建一个带工具的 Agent
  const agent = new Agent({
    model: "claude-3-5-sonnet-20241022",
    systemPrompt: "你是一个代码助手，可以执行命令和读写文件。",
    tools: [
      {
        name: "bash",
        description: "执行 Bash 命令",
        inputSchema: {
          type: "object",
          properties: {
            command: { type: "string", description: "要执行的命令" },
          },
          required: ["command"],
        },
      },
      {
        name: "read_file",
        description: "读取文件内容",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string", description: "文件路径" },
          },
          required: ["path"],
        },
      },
    ],
    hooks: {
      // 每次工具调用时触发
      onToolUse: (tool: string, input: Record<string, unknown>) => {
        console.log(`\n🔧 工具调用: ${tool}`);
        console.log(`   输入:`, JSON.stringify(input, null, 2));
      },
      // 每次工具结果返回时触发
      onToolResult: (tool: string, result: ToolResult) => {
        console.log(`✅ 工具结果 [${tool}]:`, result.output.slice(0, 200) + "...");
      },
      // 每次消息时触发
      onMessage: (message: any) => {
        if (message.type === "assistant") {
          console.log(`\n🤖 Assistant:`, message.text?.slice(0, 100) + "...");
        }
      },
    },
  });

  // 第一轮对话
  console.log("\n--- 第 1 轮 ---");
  const response1 = await agent.run({
    message: "列出当前目录的文件",
  });
  console.log("最终回复:", response1.text);

  // 第二轮对话（上下文保持）
  console.log("\n--- 第 2 轮（上下文保持）---");
  const response2 = await agent.run({
    message: "这些文件里有哪些是 TypeScript 文件？",
  });
  console.log("最终回复:", response2.text);

  // 查看完整对话历史
  console.log("\n--- 对话历史 ---");
  const history = agent.getConversationHistory();
  console.log(`共 ${history.messages.length} 条消息`);
  history.messages.forEach((msg: any, i: number) => {
    const role = msg.type === "user" ? "👤 User" : "🤖 Assistant";
    console.log(`${i + 1}. ${role}: ${msg.text?.slice(0, 80)}...`);
  });

  // 查看工具调用记录
  console.log("\n--- 工具调用记录 ---");
  const toolCalls = agent.getToolCalls();
  console.log(`共 ${toolCalls.length} 次工具调用`);
  toolCalls.forEach((call: any, i: number) => {
    console.log(`${i + 1}. ${call.tool} → ${call.status}`);
  });
}

main().catch(console.error);

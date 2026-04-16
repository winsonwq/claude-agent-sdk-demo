/**
 * Demo 3: Hook 控制
 * 
 * 演示 Agent 的生命周期 Hook：
 * - onStart: Agent 启动时
 * - onToolUse: 工具使用时
 * - onToolResult: 工具结果返回时
 * - onMessage: 每条消息时
 * - onError: 错误时
 * - onComplete: 完成时
 * 
 * 还可以通过 Hook 实现：
 * - 拦截/修改工具输入输出
 * - 实时日志记录
 * - 进度跟踪
 * - 中断 Agent 运行
 */

import { Agent, ToolResult, Hooks } from "@anthropic-ai/claude-agent-sdk";

async function main() {
  console.log("=== Demo 3: Hook 控制 ===\n");

  // 定义 Hooks
  const hooks: Hooks = {
    // Agent 启动时
    onStart: () => {
      console.log("🚀 Agent 启动");
    },

    // 每次工具调用前（可以拦截/修改输入，或拒绝调用）
    onToolUse: (tool: string, input: Record<string, unknown>) => {
      console.log(`🔧 工具调用: ${tool}`);
      // 返回 false 可以拒绝执行该工具
      // return false;
      // 返回修改后的 input 可以改变输入
      // return { ...input, modified: true };
    },

    // 工具结果返回后（可以拦截/修改输出）
    onToolResult: (tool: string, result: ToolResult) => {
      console.log(`✅ 工具 [${tool}] 执行完成`);
      // 可以选择是否将结果返回给 Agent
      // if (result.error) return { output: "错误被Hook拦截" };
    },

    // 每次收到消息
    onMessage: (message: any) => {
      if (message.type === "assistant" && message.text) {
        const preview = message.text.slice(0, 100).replace(/\n/g, " ");
        console.log(`💬 Assistant: ${preview}...`);
      }
    },

    // 发生错误
    onError: (error: Error) => {
      console.error("❌ 错误:", error.message);
    },

    // Agent 完成
    onComplete: (result: any) => {
      console.log("🏁 Agent 完成");
      console.log(`   总输入 tokens: ${result.usage?.input_tokens}`);
      console.log(`   总输出 tokens: ${result.usage?.output_tokens}`);
    },
  };

  const agent = new Agent({
    model: "claude-3-5-sonnet-20241022",
    systemPrompt: "你是一个乐于助人的助手。",
    tools: [
      {
        name: "bash",
        description: "执行命令",
        inputSchema: {
          type: "object",
          properties: {
            command: { type: "string" },
          },
          required: ["command"],
        },
      },
    ],
    hooks,
  });

  // 运行过程中可以随时获取状态
  console.log("Agent 状态:", agent.getStatus());

  const response = await agent.run({
    message: "请执行 echo 'Hello from Hooks' 命令",
  });

  console.log("\n--- 最终结果 ---");
  console.log("回复:", response.text);
  console.log("最终状态:", agent.getStatus());
}

main().catch(console.error);

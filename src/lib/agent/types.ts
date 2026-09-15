export type ToolPermission = "READ_ONLY" | "ACTION";

export interface ToolContext {
  requestId: string;
}

export interface ToolResult {
  ok: boolean;
  content: string;
  sources?: Array<{ title: string; url: string }>;
}

export interface AgentTool<TInput = unknown> {
  name: string;
  description: string;
  permission: ToolPermission;
  parameters: Record<string, unknown>;
  execute: (input: TInput, context: ToolContext) => Promise<ToolResult>;
}

export interface AgentSettings {
  webSearch: boolean;
  fileAnalysis: boolean;
  voice: boolean;
  responseStyle: "concise" | "balanced" | "detailed";
}

import { calculatorTool, fileAnalysisTool } from "@/lib/agent/tools";

const tools = [calculatorTool, fileAnalysisTool] as const;

export function getTool(name: string) { return tools.find((tool) => tool.name === name); }
export function listTools() { return tools.map(({ name, description, permission, parameters }) => ({ name, description, permission, parameters })); }

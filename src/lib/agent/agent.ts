import { calculatorTool, looksLikeCalculation, needsWebSearch } from "@/lib/agent/tools";
import type { AgentSettings, ToolResult } from "@/lib/agent/types";

export function decideTools(prompt: string, settings: AgentSettings): string[] {
  const selected: string[] = [];
  if (looksLikeCalculation(prompt)) selected.push("calculator");
  if (settings.webSearch && needsWebSearch(prompt)) selected.push("web_search");
  return selected;
}

export async function runCalculator(prompt: string): Promise<ToolResult | null> {
  if (!looksLikeCalculation(prompt)) return null;
  const expression = prompt.replace(/^.*?calculate\s+/i, "").replace(/^.*?what is\s+/i, "").trim();
  return calculatorTool.execute({ expression }, { requestId: crypto.randomUUID() });
}

import type { Conversation, Feedback } from "@/types/chat";

export const CONVERSATIONS_KEY = "nexus-conversations";
export const FEEDBACK_KEY = "nexus-feedback";

export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(CONVERSATIONS_KEY) || "[]") as Conversation[];
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}

export function saveConversations(conversations: Conversation[]) {
  if (typeof window !== "undefined") localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

export function loadFeedback(): Record<string, Feedback> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "{}") as Record<string, Feedback>; } catch { return {}; }
}

export function saveFeedback(feedback: Record<string, Feedback>) {
  if (typeof window !== "undefined") localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
}
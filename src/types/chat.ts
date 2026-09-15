export type MessageRole = "user" | "assistant";
export type Feedback = "like" | "dislike";

export interface ChatAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  previewUrl?: string;
  data?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  feedback?: Feedback;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
  pinned?: boolean;
}

export interface AgentTool {
  name: string;
  description: string;
  execute: (input: unknown) => Promise<unknown>;
}

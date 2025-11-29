import { z } from 'zod';

/**
 * Minimal message summary returned inside Chat.messages.
 * Later you can move this to /messages and import it here.
 */
export const ChatMessageSummarySchema = z.object({
  id: z.uuid(),
  chat: z.uuid(),
  content: z.string(),
  messageType: z.string().optional().nullable(),
  createdAt: z.string(),
});

export type ChatMessageSummary = z.infer<typeof ChatMessageSummarySchema>;

/**
 * Chat object returned by POST/PATCH /chats and inside GET /chats results.
 */
export const ChatSchema = z.object({
  id: z.uuid(),
  user: z.uuid(),
  title: z.string().min(1).max(255),
  createdAt: z.string(),
  updatedAt: z.string(),
  isActive: z.boolean(),
  is_temporary: z.boolean(),
  flow_step: z.number().int(),
  messages: z.array(ChatMessageSummarySchema).optional(),
  messageCount: z.string(),
  lastMessage: z.string().nullable().optional(),
});

export type Chat = z.infer<typeof ChatSchema>;

/**
 * Payload for POST /chats
 */
export const ChatCreateSchema = z.object({
  title: z.string().min(1).max(255),
  isActive: z.boolean().optional(),
});

export type ChatCreateRequest = z.infer<typeof ChatCreateSchema>;

/**
 * Payload for PATCH /chats/{id}
 * Swagger says same shape as POST.
 */
export const ChatUpdateSchema = ChatCreateSchema;
export type ChatUpdateRequest = z.infer<typeof ChatUpdateSchema>;

/**
 * Paginated list response for GET /chats
 */
export const ChatListResponseSchema = z.object({
  count: z.number().int(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(ChatSchema),
});

export type ChatListResponse = z.infer<typeof ChatListResponseSchema>;

/**
 * Query params for GET /chats
 * ordering, search, page, page_size
 */
export interface ChatListQueryParams {
  search?: string;
  ordering?: string;
  page?: number;
  pageSize?: number;
}

import { z } from 'zod';

export const ChatMessageSummarySchema = z.object({
  id: z.uuid(),
  chat: z.uuid(),
  content: z.string(),
  messageType: z.string().optional().nullable(),
  createdAt: z.string(),
});

export type ChatMessageSummary = z.infer<typeof ChatMessageSummarySchema>;

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
  messageCount: z.number(),
  lastMessage: z.any().optional().nullable(),
});

export type Chat = z.infer<typeof ChatSchema>;

export const ChatCreateSchema = z.object({
  title: z.string().min(1).max(255),
  isActive: z.boolean().optional(),
});

export type ChatCreateRequest = z.infer<typeof ChatCreateSchema>;

export const ChatUpdateSchema = ChatCreateSchema;
export type ChatUpdateRequest = z.infer<typeof ChatUpdateSchema>;

export const ChatListResponseSchema = z.object({
  count: z.number().int(),
  next: z.url().nullable(),
  previous: z.url().nullable(),
  results: z.array(ChatSchema),
});

export type ChatListResponse = z.infer<typeof ChatListResponseSchema>;

export interface ChatListQueryParams {
  search?: string;
  ordering?: string;
  page?: number;
  pageSize?: number;
}

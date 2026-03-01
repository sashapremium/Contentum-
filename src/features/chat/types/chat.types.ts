import { FormStepSchema } from '@/features/forms/types/formStep.types';
import { z } from 'zod';

export const ChatFieldsSchema = z.object({
  postType: z.string().min(1), // currently "announcement", future-proof
});

export const ChatMessageTypeSchema = z.enum([
  'form',
  'generated_text',
  'regeneration_request',
]);

export type ChatMessageType = z.infer<typeof ChatMessageTypeSchema>;

export const FormPayloadSchema = FormStepSchema;

export type FormPayload = z.infer<typeof FormPayloadSchema>;

export const GeneratedTextPayloadSchema = z.object({
  content: z.array(z.string()), // ["...", "...", "..."]
  metrics: z.record(z.string(), z.unknown()), // flexible for now
  version_number: z.number().int(),
});

export type GeneratedTextPayload = z.infer<typeof GeneratedTextPayloadSchema>;

export const RegenerationRequestPayloadSchema = z.object({
  mode: z.string().min(1), // e.g. "comment_only"
  comment: z.string(),
});

export type RegenerationRequestPayload = z.infer<
  typeof RegenerationRequestPayloadSchema
>;

export const PayloadSchema = z.union([
  FormPayloadSchema,
  GeneratedTextPayloadSchema,
  RegenerationRequestPayloadSchema,
]);

export type Payload = z.infer<typeof PayloadSchema>;

export const ChatMessageSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.uuid(),
    chat: z.uuid(),
    type: z.literal('form'),
    payload: FormPayloadSchema,
  }),

  z.object({
    id: z.uuid(),
    chat: z.uuid(),
    type: z.literal('generated_text'),
    payload: GeneratedTextPayloadSchema,
  }),

  z.object({
    id: z.uuid(),
    chat: z.uuid(),
    type: z.literal('regeneration_request'),
    payload: RegenerationRequestPayloadSchema,
  }),
]);

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatMessagesSchema = z.array(ChatMessageSchema);
export type ChatMessages = z.infer<typeof ChatMessagesSchema>;

export const ChatUserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  role: z.string(), // keep flexible for now (user | admin | future roles)
});

export type ChatUser = z.infer<typeof ChatUserSchema>;

/**
 * Chat type — extensible
 * Do NOT use z.enum(['announcement']) yet.
 * Backend will expand this.
 */
export const ChatTypeSchema = z.string().min(1);

export type ChatType = z.infer<typeof ChatTypeSchema>;

export const ChatSchema = z.object({
  id: z.uuid(),

  user: ChatUserSchema,

  type: ChatTypeSchema, // currently "announcement"

  title: z.string().min(1).max(255),

  updatedAt: z.string(), // ISO string
  isActive: z.boolean(),

  // Optional — if backend still returns messages for detailed view
  messages: ChatMessagesSchema.optional(),
  messageCount: z.number().int().optional(),
});

export type Chat = z.infer<typeof ChatSchema>;

export const ChatListResponseSchema = z.object({
  count: z.number().int(),
  next: z.url().nullable(),
  previous: z.url().nullable(),
  results: z.array(ChatSchema),
});

export type ChatListResponse = z.infer<typeof ChatListResponseSchema>;

export type ChatFields = z.infer<typeof ChatFieldsSchema>;

export const ChatCreateSchema = z.object({
  user: z.uuid(),
  fields: ChatFieldsSchema,
});

export type ChatCreateRequest = z.infer<typeof ChatCreateSchema>;

export const ChatCreateResponseSchema = z.object({
  chatId: z.uuid(),
  type: z.string().min(1), // currently "form", future-proof
  payload: z.unknown(),
});

export type ChatCreateResponse = z.infer<typeof ChatCreateResponseSchema>;

export const ChatUpdateSchema = ChatCreateSchema;
export type ChatUpdateRequest = z.infer<typeof ChatUpdateSchema>;

export interface ChatListQueryParams {
  search?: string;
  ordering?: string;
  page?: number;
  pageSize?: number;
}

export interface ChatProps {
  chat?: Chat;
}

// Zod-схемы для сообщений чата.
// MessageContent - discriminated union по type: text (строка) или image (ImageInfo с url'ами).
// SendMessageResponse содержит оба сообщения (user_message и system_message) и служебные поля генерации.

import { z } from 'zod';

export const ImageInfoSchema = z.object({
  createdAt: z.string(),
  mainText: z.string(),
  resultPng: z.string(),
  resultWebp: z.string(),
  sourceImageUrl: z.string(),
  templateId: z.string(),
  variantNumber: z.number().int(),
});

export type ImageInfo = z.infer<typeof ImageInfoSchema>;

export const MessageContentSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    info: z.string().min(1),
  }),

  z.object({
    type: z.literal('image'),
    info: ImageInfoSchema,
  }),
]);

export type MessageContent = z.infer<typeof MessageContentSchema>;

export const MessageSchema = z.object({
  id: z.uuid(),
  chat: z.uuid(),
  content: MessageContentSchema,
  messageType: z.enum(['SYSTEM', 'USER']),
  createdAt: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;

export const MessagesSchema = z.array(MessageSchema);
export type Messages = Message[];

export const GetMessagesResponseSchema = z.object({
  count: z.number().int(),
  next: z.url().nullable(),
  previous: z.url().nullable(),
  results: z.array(MessageSchema),
});

export type GetMessagesResponse = z.infer<typeof GetMessagesResponseSchema>;

export const SendMessageBodySchema = z.object({
  chat: z.uuid(),
  content: MessageContentSchema,
  messageType: z.enum(['USER', 'SYSTEM']).default('USER'),
});

export type SendMessageBody = z.infer<typeof SendMessageBodySchema>;

export const SendMessageResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    user_message: MessageSchema.optional(),
    system_message: MessageSchema.optional(),

    prompt_parameters_id: z.string().optional(),
    prompt_history_id: z.string().optional(),
    assembled_prompt: z.string().optional(),

    generation_task_id: z.string().optional(),
    image_url: z.string().optional(),

    regeneration_attempts: z.number().optional(),
    total_attempts: z.number().optional(),
  }),
});

export type SendMessageResponse = z.infer<typeof SendMessageResponseSchema>;

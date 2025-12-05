import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.uuid(),
  chat: z.uuid(),
  content: z.string().min(1),
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
  content: z.string().min(1),
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

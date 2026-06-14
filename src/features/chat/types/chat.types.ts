// Zod-схемы и типы для чатов.
// Сообщение (ChatMessage) - discriminated union из трёх типов: form (шаг бриефа),
// generatedText (варианты текста с метриками), regenerationRequest (запрос перегенерации).
import { FieldsSchema } from '@/features/forms/types/formField.types';
import { FormStepSchema } from '@/features/forms/types/formStep.types';
import { StepSchema } from '@/features/forms/types/step.types';
import { UserIdSchema, UserSchema } from '@/features/user/types/user.types';
import { z } from 'zod';

export const ChatMessageTypeSchema = z.enum([
  'form',
  'generatedText',
  'regenerationRequest',
]);
export type ChatMessageType = z.infer<typeof ChatMessageTypeSchema>;

export const FormPayloadSchema = FormStepSchema;
export type FormPayload = z.infer<typeof FormPayloadSchema>;

// Значение метрики: число, булево или 'disabled' (метрика отключена на бэкенде)
export const MetricValueSchema = z.union([
  z.number(),
  z.boolean(),
  z.literal('disabled'),
]);
export type MetricValue = z.infer<typeof MetricValueSchema>;

export const MetricsSchema = z.record(z.string(), MetricValueSchema);
export type Metrics = z.infer<typeof MetricsSchema>;

export const GeneratedTextSchema = z.object({
  text: z.string(),
  metrics: MetricsSchema,
});
export type GeneratedText = z.infer<typeof GeneratedTextSchema>;

export const GeneratedTextPayloadSchema = z.object({
  content: z.array(GeneratedTextSchema),
  versionNumber: z.number().int(),
});
export type GeneratedTextPayload = z.infer<typeof GeneratedTextPayloadSchema>;

export const RegenerationRequestPayloadSchema = z.object({
  mode: z.string().min(1),
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

export const ChatMessageIdSchema = z.number().int().nullable();
export type ChatMessageId = z.infer<typeof ChatMessageIdSchema>;

const BaseMessageSchema = z.object({
  id: ChatMessageIdSchema,
});

export const FormMessageSchema = BaseMessageSchema.extend({
  type: z.literal('form'),
  payload: FormPayloadSchema,
});
export type FormMessage = z.infer<typeof FormMessageSchema>;

export const GeneratedTextMessageSchema = BaseMessageSchema.extend({
  type: z.literal('generatedText'),
  payload: GeneratedTextPayloadSchema,
});
export type GeneratedTextMessage = z.infer<typeof GeneratedTextMessageSchema>;

export const RegenerationRequestMessageSchema = BaseMessageSchema.extend({
  type: z.literal('regenerationRequest'),
  payload: RegenerationRequestPayloadSchema,
});
export type RegenerationRequestMessage = z.infer<
  typeof RegenerationRequestMessageSchema
>;

// Итоговый discriminated union по полю type
export const ChatMessageSchema = z.discriminatedUnion('type', [
  FormMessageSchema,
  GeneratedTextMessageSchema,
  RegenerationRequestMessageSchema,
]);
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatMessagesSchema = z.array(ChatMessageSchema);
export type ChatMessages = z.infer<typeof ChatMessagesSchema>;

export const ChatTypeSchema = z.string().min(1);

export type ChatType = z.infer<typeof ChatTypeSchema>;

export const ChatIdSchema = z.uuid();
export type ChatId = z.infer<typeof ChatIdSchema>;

export const ChatSchema = z.object({
  id: ChatIdSchema,

  user: UserSchema,

  type: ChatTypeSchema,

  title: z.string().min(1).max(255),

  updatedAt: z.string(),
  isActive: z.boolean(),

  messages: ChatMessagesSchema.optional(),
  messageCount: z.number().int().optional(),
});
export type Chat = z.infer<typeof ChatSchema>;

export const ChatListResponseSchema = z.object({
  chats: z.array(ChatSchema),
  payload: FormStepSchema,
});
export type ChatListResponse = z.infer<typeof ChatListResponseSchema>;

export const ChatCreateSchema = z.object({
  user: UserIdSchema,
  fields: FieldsSchema,
});
export type ChatCreateRequest = z.infer<typeof ChatCreateSchema>;

export const ChatCreateResponseSchema = z.object({
  chatId: z.uuid(),
  type: z.string().min(1),
  payload: z.unknown(),
});
export type ChatCreateResponse = z.infer<typeof ChatCreateResponseSchema>;

export const ChatRenameSchema = z.object({
  title: z
    .string()
    .min(1, 'Название не может быть пустым')
    .max(255, 'Максимум 255 символов'),
});
export type ChatRenameForm = z.infer<typeof ChatRenameSchema>;
export type ChatRenameRequest = z.infer<typeof ChatRenameSchema>;

export const ChatUpdateSchema = z.object({
  step: StepSchema,
  mode: z.string().min(1),
  fields: FieldsSchema,
});
export type ChatUpdateRequest = z.infer<typeof ChatUpdateSchema>;

export const ChatUpdateResponseSchema = z.object({
  payload: PayloadSchema,
  type: z.string().min(1),
});
export type ChatUpdateResponse = z.infer<typeof ChatUpdateResponseSchema>;

export interface ChatListQueryParams {
  search?: string;
  ordering?: string;
  page?: number;
  pageSize?: number;
}

export interface ChatProps {
  chat?: Chat;
}

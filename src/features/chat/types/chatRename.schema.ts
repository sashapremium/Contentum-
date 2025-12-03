import { z } from 'zod';

export const ChatRenameSchema = z.object({
  title: z
    .string()
    .min(1, 'Название не может быть пустым')
    .max(255, 'Максимум 255 символов'),
});

export type ChatRenameForm = z.infer<typeof ChatRenameSchema>;

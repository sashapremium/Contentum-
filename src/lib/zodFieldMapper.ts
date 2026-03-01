import { z } from 'zod';

export const ZOD_FIELDS = {
  password: z.string().min(8, 'Минимальная длина пароля - 8 символов'),
  fullName: z
    .string()
    .min(3, 'Минимальная длина ФИО - 3 символа')
    .max(254, 'Слишком длиное ФИО'),
  min: (min: number, message?: string) =>
    message ?? `Минимальная длина ${min} символов`,
  max: (max: number, message?: string) =>
    message ?? `Максимальная длина ${max} символов`,
  required: (message?: string) => message ?? 'Обязательное поле',
  mustBeFuture: (message?: string) => message ?? 'Дата должна быть в будущем',
};

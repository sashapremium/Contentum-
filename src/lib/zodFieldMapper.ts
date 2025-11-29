import { z } from 'zod';

export const ZOD_FIELDS = {
  password: z.string().min(8, 'Минимальная длина пароля - 8 символов'),
  fullName: z
    .string()
    .min(3, 'Минимальная длина ФИО - 3 символа')
    .max(254, 'Слишком длиное ФИО'),
};

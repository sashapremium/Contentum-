import { z } from 'zod';

export const ZOD_ERRORS = {
  password: z.string().min(8, 'Минимальная длина пароля - 8 символов'),
};

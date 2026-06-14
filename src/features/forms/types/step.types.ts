// Номер шага: бэкенд присылает строку или число.

import z from 'zod';

export const StepSchema = z.union([z.string().min(1), z.number().int()]);
export type Step = z.infer<typeof StepSchema>;

import { z } from 'zod';
import { FormFieldSchema } from './formField.types';
import { StepSchema } from './step.types';

/**
 * Placeholder for fields until you describe field types.
 * We validate that it’s an object with at least `name` and `type` strings
 * to avoid accepting totally broken data, but everything else is deferred.
 */
export const FormFieldPlaceholderSchema = z
  .object({
    name: z.string().min(1),
    type: z.string().min(1),
  })
  .loose();

export type FormFieldPlaceholder = z.infer<typeof FormFieldPlaceholderSchema>;

export const FormFieldsGroupSchema = z.object({
  groupName: z.string().min(1),
  groupLabel: z.string().nullable().optional(),
  groupFields: z.array(FormFieldSchema),
});

export type FormFieldsGroup = z.infer<typeof FormFieldsGroupSchema>;

export const FormModeSchema = z.object({
  name: z.string().min(1),
  label: z.string().nullable(),
  fieldsGroups: z.array(FormFieldsGroupSchema),
});

export type FormMode = z.infer<typeof FormModeSchema>;

/**
 * Your step example is a "form" step.
 * Later you’ll likely also have result/generation steps — we’ll add a discriminated union then.
 */
export const FormStepSchema = z.object({
  step: StepSchema,
  type: z.literal('form'),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  disabled: z.boolean(),
  modes: z.array(FormModeSchema).min(1),
});

export type FormStep = z.infer<typeof FormStepSchema>;

/**
 * Useful when backend returns an array of steps.
 */
export const FormStepsSchema = z.array(FormStepSchema);
export type FormSteps = z.infer<typeof FormStepsSchema>;

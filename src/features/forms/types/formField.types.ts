import { z } from 'zod';
import { StepSchema } from './step.types';

export const FieldOptionSchema = z.object({
  value: z.union([z.string(), z.number().int()]),
  label: z.string(),
});

export type FieldOption = z.infer<typeof FieldOptionSchema>;

export const TextValidationSchema = z
  .object({
    minLength: z.number().int().nonnegative().optional(),
    maxLength: z.number().int().nonnegative().optional(),
    isUrl: z.boolean().optional(),
  })
  .loose();

export type TextValidation = z.infer<typeof TextValidationSchema>;

export const DateTimeValidationSchema = z
  .object({
    mustBeFuture: z.boolean().optional(),
  })
  .loose();

export type DateTimeValidation = z.infer<typeof DateTimeValidationSchema>;

export const MultipleValidationSchema = z
  .object({
    maxItems: z.number().int().nonnegative().optional(),
    minItems: z.number().int().nonnegative().optional(),
  })
  .loose();

export type MultipleValidation = z.infer<typeof MultipleValidationSchema>;

/**
 * Catch-all if backend sends validation for other field types later.
 * Keeps it flexible without losing safety for known keys above.
 */
export const UnknownValidationSchema = z.record(z.string(), z.unknown());
export type UnknownValidation = z.infer<typeof UnknownValidationSchema>;

const BaseFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  required: z.boolean(),
  value: z.unknown().nullable(),
});

export const TextFieldSchema = BaseFieldSchema.extend({
  type: z.literal('text'),
  validation: TextValidationSchema.optional(),
}).loose();

export type TextField = z.infer<typeof TextFieldSchema>;

export const SearchFieldSchema = BaseFieldSchema.extend({
  type: z.literal('search'),
  options: z.array(FieldOptionSchema),
  validation: TextValidationSchema.optional(),
}).loose();

export type SearchField = z.infer<typeof SearchFieldSchema>;

export const SelectFieldSchema = BaseFieldSchema.extend({
  type: z.literal('select'),
  options: z.array(FieldOptionSchema),
  validation: UnknownValidationSchema.optional(),
}).loose();

export type SelectField = z.infer<typeof SelectFieldSchema>;

export const MultipleFieldSchema = BaseFieldSchema.extend({
  type: z.literal('multiple'),
  options: z.array(FieldOptionSchema),
  validation: MultipleValidationSchema.optional(),
}).loose();

export type MultipleField = z.infer<typeof MultipleFieldSchema>;

export const CheckboxFieldSchema = BaseFieldSchema.extend({
  type: z.literal('checkbox'),
  validation: UnknownValidationSchema.optional(),
}).loose();

export type CheckboxField = z.infer<typeof CheckboxFieldSchema>;

export const DateTimeFieldSchema = BaseFieldSchema.extend({
  type: z.literal('datetime'),
  validation: DateTimeValidationSchema.optional(),
}).loose();

export type DateTimeField = z.infer<typeof DateTimeFieldSchema>;

export const FormFieldSchema = z.discriminatedUnion('type', [
  TextFieldSchema,
  SearchFieldSchema,
  SelectFieldSchema,
  MultipleFieldSchema,
  CheckboxFieldSchema,
  DateTimeFieldSchema,
]);

export type FormField = z.infer<typeof FormFieldSchema>;
export type FormFieldType = FormField['type'];

export const FieldsSchema = z.record(z.string().min(1), z.unknown());
export type Fields = z.infer<typeof FieldsSchema>;

export const FormSubmitSchema = z.object({
  step: StepSchema,
  mode: z.string().min(1),
  fields: FieldsSchema,
});
export type FormSubmit = z.infer<typeof FormSubmitSchema>;

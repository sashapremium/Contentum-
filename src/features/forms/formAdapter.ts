import { z, ZodType } from 'zod';
import type { FormStep } from './types/formStep.types';
import type { FormField } from './types/formField.types';
import { ZOD_FIELDS } from '@/lib/zodFieldMapper';

/**
 * Derives proper default values for React Hook Form
 * @param step backend step with modes
 * @param modeName selected mode key
 */
export function buildDefaultValues(
  step: FormStep,
  modeName: string,
): Record<string, unknown> {
  const mode = step.modes.find((m) => m.name === modeName)!;

  const values: Record<string, unknown> = {};

  mode.fieldsGroups.forEach((group) => {
    group.groupFields.forEach((field) => {
      const raw = field.value;

      values[field.name] =
        raw !== null && raw !== undefined ? raw : defaultByType(field.type);
    });
  });

  return values;
}

/**
 * Default values based on type
 */
function defaultByType(type: string): unknown {
  switch (type) {
    case 'text':
    case 'search':
    case 'select':
      return '';
    case 'multiple':
      return [];
    case 'checkbox':
      return false;
    case 'datetime':
      return null;
    default:
      return '';
  }
}

/**
 * Build dynamic Zod schema from backend config
 */
export function buildZodSchema(
  step: FormStep,
  modeName: string,
): ZodType<Record<string, unknown>> {
  const mode = step.modes.find((m) => m.name === modeName)!;

  const shape: Record<string, any> = {};

  mode.fieldsGroups.forEach((group) => {
    group.groupFields.forEach((field) => {
      shape[field.name] = buildFieldSchema(field);
    });
  });

  return z.object(shape);
}

/**
 * Map backend field config → Zod schema
 */
function buildFieldSchema(field: FormField): z.ZodTypeAny {
  const { required, validation } = field;

  switch (field.type) {
    case 'text': {
      let schema = z.string();

      if (required) schema = schema.min(1, ZOD_FIELDS.required());
      if (validation?.minLength)
        schema = schema.min(
          validation.minLength,
          ZOD_FIELDS.min(validation.minLength),
        );
      if (validation?.maxLength)
        schema = schema.max(
          validation.maxLength,
          ZOD_FIELDS.max(validation.maxLength),
        );
      return schema;
    }

    case 'search': {
      let schema = z.string();
      if (required) schema = schema.min(1, ZOD_FIELDS.required());
      if (validation?.minLength)
        schema = schema.min(
          validation.minLength,
          ZOD_FIELDS.min(validation.minLength),
        );
      if (validation?.maxLength)
        schema = schema.max(
          validation.maxLength,
          ZOD_FIELDS.max(validation.maxLength),
        );
      return schema;
    }

    case 'select': {
      let schema = z.string();
      if (required) schema = schema.min(1, ZOD_FIELDS.required());
      return schema;
    }

    case 'multiple': {
      let schema = z.array(z.string());
      if (required) schema = schema.min(1, ZOD_FIELDS.required());
      if (validation?.maxItems) schema = schema.max(validation.maxItems);
      return schema;
    }

    case 'checkbox': {
      let schema = z.boolean();
      if (required)
        schema = schema.refine((v) => v === true, {
          message: 'Required',
        });
      return schema;
    }

    case 'datetime': {
      let schema = z.preprocess(
        (v) => (v ? new Date(v as string) : null),
        z.date().nullable(),
      );

      if (required)
        schema = schema.refine((v) => v !== null, { message: 'Required' });
      if (validation?.mustBeFuture)
        schema = schema.refine((d) => !d || d > new Date(), {
          message: 'Date must be in the future',
        });

      return schema;
    }

    default:
      return z.any();
  }
}

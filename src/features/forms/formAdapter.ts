// Адаптер между конфигом формы от бэкенда и React Hook Form.
// Бэкенд присылает FormStep с описанием полей, режимов и правил валидации.
// Этот модуль превращает FormStep в:
//   - buildDefaultValues: начальные значения для useForm({ defaultValues })
//   - buildZodSchema: схему валидации для zodResolver
// Вызывается в FormContainer при каждой смене режима (mode).

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { z, ZodType } from 'zod';
import type { FormStep } from './types/formStep.types';
import type { FormField } from './types/formField.types';
import { ZOD_FIELDS } from '@/lib/zodFieldMapper';
import { localToDate } from '@/lib/dateTime';

// Собирает начальные значения полей активного режима.
// Если у поля есть value от бэкенда - берёт его, иначе подставляет пустое значение по типу.
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

function defaultByType(type: string): unknown {
  switch (type) {
    case 'text':
    case 'search':
    case 'select':
    case 'datetime':
      return '';
    case 'multiple':
      return [];
    case 'checkbox':
      return false;
    default:
      return '';
  }
}

export function buildZodSchema(
  step: FormStep,
  modeName: string,
): ZodType<Record<string, unknown>> {
  const mode = step.modes.find((m) => m.name === modeName)!;

  const shape: Record<string, unknown> = {};

  mode.fieldsGroups.forEach((group) => {
    group.groupFields.forEach((field) => {
      shape[field.name] = buildFieldSchema(field);
    });
  });

  return z.object(shape);
}

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
      if (validation?.maxItems)
        schema = schema.max(
          validation.maxItems,
          ZOD_FIELDS.max(
            validation.maxItems,
            `Не более ${validation.maxItems} вариантов`,
          ),
        );
      if (validation?.minItems)
        schema = schema.min(
          validation.minItems,
          ZOD_FIELDS.min(
            validation.minItems,
            `Не менее ${validation.minItems} вариантов`,
          ),
        );
      return schema;
    }

    case 'checkbox': {
      let schema = z.boolean();
      if (required)
        schema = schema.refine((v) => v === true, {
          message: ZOD_FIELDS.required(),
        });
      return schema;
    }

    case 'datetime': {
      let schema = z.string();

      if (required) {
        schema = schema.min(1, ZOD_FIELDS.required());
      }

      schema = schema.refine(
        (v) => v === '' || !Number.isNaN(new Date(v).getTime()),
        { message: ZOD_FIELDS.invalidDateTime?.() ?? ZOD_FIELDS.required() },
      );

      if (required) {
        schema = schema.min(1, ZOD_FIELDS.required());
      }

      if (validation?.mustBeFuture) {
        schema = schema.refine((v) => {
          if (v === '') return true;
          const d = localToDate(v);
          return d ? d.getTime() > Date.now() : false;
        }, ZOD_FIELDS.mustBeFuture());
      }

      return schema;
    }

    default:
      return z.any();
  }
}

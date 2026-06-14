// Группа полей одного режима с опциональным заголовком.
// applyFieldMappings переопределяет опции поля 'audience' на AUDIENCE_OPTIONS - захардкоженный список,
// потому что бэкенд присылает для этого поля пустой массив options.

import { cx } from 'class-variance-authority';
import type { FormField as FormFieldType } from '../types/formField.types';
import type { FormFieldsGroup } from '../types/formStep.types';
import { FormField } from './FormField';

interface FieldGroupProps {
  group: FormFieldsGroup;
  disabled: boolean;
}

const AUDIENCE_OPTIONS = [
  { value: 'families', label: 'Семьи с детьми' },
  { value: 'youth18_25', label: 'Молодежная аудитория' },
  { value: 'youth25_40', label: 'Широкая аудитория' },
  { value: 'elderly', label: 'Аудитория классического искусства' },
  { value: 'theatreLovers', label: 'Постоянная аудитория' },
];

function applyFieldMappings(field: FormFieldType): FormFieldType {
  if (field.name === 'audience' && 'options' in field) {
    return { ...field, options: AUDIENCE_OPTIONS };
  }
  return field;
}

export const FieldGroup = ({ group, disabled }: FieldGroupProps) => {
  return (
    <div className="space-y-3">
      {group.groupLabel && (
        <h2
          className={cx(
            'text-sm font-medium',
            disabled && 'text-muted-foreground',
          )}
        >
          {group.groupLabel}
        </h2>
      )}

      <div className="flex flex-col gap-3">
        {group.groupFields.map((field) => (
          <FormField key={field.name} field={applyFieldMappings(field)} />
        ))}
      </div>
    </div>
  );
};

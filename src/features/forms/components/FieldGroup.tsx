import { cx } from 'class-variance-authority';
import type { FormFieldsGroup } from '../types/formStep.types';
import { FormField } from './FormField';

interface FieldGroupProps {
  group: FormFieldsGroup;
  disabled: boolean;
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
          <FormField key={field.name} field={field} />
        ))}
      </div>
    </div>
  );
};

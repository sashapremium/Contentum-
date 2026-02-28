import type { FormFieldsGroup } from '../types/formStep.types';
import { FormField } from './FormField';

interface FieldGroupProps {
  group: FormFieldsGroup;
}

export const FieldGroup = ({ group }: FieldGroupProps) => {
  return (
    <div className="space-y-4">
      {group.groupLabel && (
        <h2 className="text-sm font-medium text-muted-foreground">
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

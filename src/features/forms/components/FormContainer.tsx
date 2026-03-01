import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FormStep } from '../types/formStep.types';
import { buildDefaultValues, buildZodSchema } from '../formAdapter';
import { FormModeButton } from './FormModeButton';
import { Button } from '@/components/ui/button';
import { FieldGroup } from './FieldGroup';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FormContainerProps {
  formStep: FormStep;
  chatId: string;
  onSubmit: (values: Record<string, unknown>) => void;
}

export const FormContainer = ({
  formStep,
  chatId,
  onSubmit,
}: FormContainerProps) => {
  const [selectedMode, setSelectedMode] = useState(formStep.modes[0]);
  const [disabled] = useState(formStep.disabled);

  const defaultValues = buildDefaultValues(formStep, selectedMode.name);
  const schema = buildZodSchema(formStep, selectedMode.name);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    disabled,
  });

  useEffect(() => {
    form.reset(buildDefaultValues(formStep, selectedMode.name));
  }, [selectedMode.name, formStep]);

  const handleSubmit = form.handleSubmit((values) => {
    console.log('Submitted values', values);
    onSubmit({
      step: formStep.step,
      mode: selectedMode.name,
      fields: values,
    });
  });

  return (
    <FormProvider {...form}>
      <div className="space-y-6 p-6 bg-card rounded-lg shadow">
        {/* header */}
        <header className="space-y-2">
          <h1 className="text-xl font-semibold">{formStep.title}</h1>
          {formStep.description && (
            <p className="text-sm text-muted-foreground">
              {formStep.description}
            </p>
          )}
        </header>

        {/* modes if >1 */}
        {!disabled && formStep.modes.length > 1 && (
          <FormModeButton
            modes={formStep.modes}
            selectedMode={selectedMode}
            onChange={setSelectedMode}
          />
        )}

        {/* fields */}
        <ScrollArea className={`h-128`}>
          <div
            className={`space-y-8 px-4 ${disabled ? 'pointer-events-none' : ''}`}
          >
            {selectedMode.fieldsGroups.map((group) => (
              <FieldGroup key={group.groupName} group={group} />
            ))}
          </div>
        </ScrollArea>

        {/* footer */}
        {!disabled && (
          <footer className="flex justify-end">
            <Button onClick={handleSubmit}>Далее</Button>
          </footer>
        )}
      </div>
    </FormProvider>
  );
};

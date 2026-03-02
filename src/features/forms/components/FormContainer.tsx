import { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FormStep } from '../types/formStep.types';
import { buildDefaultValues, buildZodSchema } from '../formAdapter';
import { FormModeButton } from './FormModeButton';
import { Button } from '@/components/ui/button';
import { FieldGroup } from './FieldGroup';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FormSubmit } from '../types/formField.types';
import { cx } from 'class-variance-authority';
import { EventInfoById } from '@/features/events/components/EventInfoById';

interface FormContainerProps {
  formStep: FormStep;
  chatId?: string;
  onSubmit: (data: FormSubmit) => void;
}

export const FormContainer = ({ formStep, onSubmit }: FormContainerProps) => {
  const [selectedMode, setSelectedMode] = useState(formStep.modes[0]);
  const [disabled] = useState(formStep.disabled);

  const defaultValues = buildDefaultValues(formStep, selectedMode.name);
  const schema = buildZodSchema(formStep, selectedMode.name);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    disabled,
  });

  const eventId = useWatch({
    control: form.control,
    name: 'eventId', // must match the field name in your schema
  }) as string | undefined;
  const shouldShowEventInfo = Boolean(eventId);

  const flatFieldsCount = useMemo(
    () =>
      selectedMode.fieldsGroups.reduce(
        (acc, group) => acc + group.groupFields.length,
        0,
      ),
    [selectedMode.fieldsGroups],
  );

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
      <div className="space-y-6  ">
        {/* header */}
        <header className="space-y-2">
          <span
            className={cx(
              'text-xl font-semibold',
              disabled && 'text-muted-foreground',
            )}
          >
            {formStep.title}
          </span>
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
        <ScrollArea className={`${flatFieldsCount > 6 ? 'h-96' : ''}`}>
          <div
            className={`space-y-8 pr-4 pl-1 pb-1 ${disabled ? 'pointer-events-none' : ''}`}
          >
            {selectedMode.fieldsGroups.map((group) => (
              <FieldGroup
                key={group.groupName}
                disabled={disabled}
                group={group}
              />
            ))}

            {shouldShowEventInfo && <EventInfoById eventId={eventId!} />}
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

'use client';

import { Controller, useFormContext } from 'react-hook-form';
import type { FormField as FormFieldType } from '../types/formField.types';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldProps {
  field: FormFieldType;
}

export const FormField = ({ field }: FormFieldProps) => {
  const { control } = useFormContext();

  if (field.type === 'checkbox') {
    return (
      <Controller
        control={control}
        name={field.name}
        render={({ field: { value, onChange }, fieldState }) => (
          <FormItem>
            {/* Label for checkbox */}
            <FormLabel className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={!!value}
                  onCheckedChange={(checked) => onChange(checked)}
                />
              </FormControl>
              <span>{field.label}</span>
            </FormLabel>
            {/* Error message */}
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
    );
  }

  if (field.type === 'text') {
    return (
      <Controller
        name={field.name}
        control={control}
        render={({ field: { value, onChange }, fieldState }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              <Textarea
                value={value as string}
                onChange={(e) => onChange(e.target.value)}
                // Optionally connect validation attributes
                {...(field.validation?.maxLength
                  ? { maxLength: field.validation.maxLength }
                  : {})}
              />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
    );
  }

  // Fallback for unsupported types
  return null;
};

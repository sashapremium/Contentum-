import { Controller, useFormContext } from 'react-hook-form';
import type {
  FieldOption,
  FormField as FormFieldType,
} from '../types/formField.types';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import { DateTimePicker } from './DateTimePicker';

interface FormFieldProps {
  field: FormFieldType;
}

export const FormField = ({ field }: FormFieldProps) => {
  const { control } = useFormContext();
  const anchor = useComboboxAnchor();

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

  if (field.type === 'search') {
    const options = field.options ?? [];

    return (
      <Controller
        name={field.name}
        control={control}
        render={({ field: { onChange }, fieldState }) => {
          return (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <Combobox
                  items={options}
                  onValueChange={(value) =>
                    onChange((value as FieldOption).value)
                  }
                >
                  <ComboboxInput />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found</ComboboxEmpty>
                    <ComboboxList>
                      {(opt) => (
                        <ComboboxItem key={opt.value} value={opt}>
                          {opt.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          );
        }}
      />
    );
  }

  if (field.type === 'select') {
    const options = field.options ?? [];

    return (
      <Controller
        name={field.name}
        control={control}
        render={({ field: { value, onChange }, fieldState }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              <Select
                value={(value as string) ?? ''}
                onValueChange={(v) => onChange(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите значение" />
                </SelectTrigger>

                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>

            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
    );
  }

  if (field.type === 'multiple') {
    const options = field.options ?? [];

    return (
      <Controller
        name={field.name}
        control={control}
        render={({ field: { onChange }, fieldState }) => {
          return (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <Combobox
                  multiple
                  autoHighlight
                  items={options}
                  onValueChange={(value) =>
                    onChange(value.map((v) => (v as FieldOption).value))
                  }
                >
                  <ComboboxChips ref={anchor} className="w-full max-w-xs">
                    <ComboboxValue>
                      {(values) => (
                        <React.Fragment>
                          {values.map((value: FieldOption) => (
                            <ComboboxChip key={value.value}>
                              {value.label}
                            </ComboboxChip>
                          ))}
                          <ComboboxChipsInput />
                        </React.Fragment>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No items found</ComboboxEmpty>
                    <ComboboxList>
                      {(opt) => (
                        <ComboboxItem key={opt.value} value={opt}>
                          {opt.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </FormControl>

              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          );
        }}
      />
    );
  }

  if (field.type === 'datetime') {
    const mustBeFuture = Boolean(field.validation?.mustBeFuture);

    return (
      <Controller
        name={field.name}
        control={control}
        render={({ field: { value, onChange }, fieldState }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              <DateTimePicker
                value={value as string}
                onChange={(next) => onChange(next)}
                mustBeFuture={mustBeFuture}
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

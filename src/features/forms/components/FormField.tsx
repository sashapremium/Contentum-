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

const NOT_FOUND = 'Ничего не найдено';
const SELECT_PLACEHOLDER = 'Выберите значение';
const TEXT_PLACEHOLDER = 'Введите значение';

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
                className="min-h-9"
                placeholder={TEXT_PLACEHOLDER}
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
                  <ComboboxInput placeholder={SELECT_PLACEHOLDER} />
                  <ComboboxContent>
                    <ComboboxEmpty>{NOT_FOUND}</ComboboxEmpty>
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
                <SelectTrigger className="w-[100%]">
                  <SelectValue placeholder={SELECT_PLACEHOLDER} />
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
        render={({ field: { value, onChange }, fieldState }) => {
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
                  <ComboboxChips ref={anchor} className="w-[100%]">
                    <ComboboxValue>
                      {(values) => (
                        <React.Fragment>
                          {values.map((value: FieldOption) => (
                            <ComboboxChip key={value.value}>
                              {value.label}
                            </ComboboxChip>
                          ))}
                          <ComboboxChipsInput
                            placeholder={
                              value?.length > 0 ? undefined : SELECT_PLACEHOLDER
                            }
                          />
                        </React.Fragment>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>{NOT_FOUND}</ComboboxEmpty>
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

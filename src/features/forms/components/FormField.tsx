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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ChevronDownIcon, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
                      {options.map((opt) => (
                        <ComboboxItem key={opt.value} value={opt}>
                          {opt.label}
                        </ComboboxItem>
                      ))}
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
                  items={options}
                  multiple
                  autoHighlight
                  onValueChange={onChange}
                >
                  <ComboboxChips ref={anchor} className="w-full max-w-xs">
                    <ComboboxValue>
                      {(values) => (
                        <React.Fragment>
                          {values.map((value: string) => (
                            <ComboboxChip key={value}>{value}</ComboboxChip>
                          ))}
                          <ComboboxChipsInput />
                        </React.Fragment>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxInput />
                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No items found</ComboboxEmpty>
                    <ComboboxList>
                      {options.map((opt) => (
                        <ComboboxItem key={opt.value} value={opt}>
                          {opt.label}
                        </ComboboxItem>
                      ))}
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
    return (
      <Controller
        name={field.name}
        control={control}
        render={({ field: { value, onChange }, fieldState }) => {
          // Store value in RHF as ISO string (or '' when empty)
          const iso = typeof value === 'string' ? value : '';
          const datePart = iso ? new Date(iso) : undefined;

          const timeFromIso = () => {
            if (!iso) return '10:30:00';
            const d = new Date(iso);
            const hh = String(d.getHours()).padStart(2, '0');
            const mm = String(d.getMinutes()).padStart(2, '0');
            const ss = String(d.getSeconds()).padStart(2, '0');
            return `${hh}:${mm}:${ss}`;
          };

          const toIso = (d: Date | undefined, time: string) => {
            if (!d) return '';
            const [hh, mm, ss] = (time || '00:00:00').split(':');
            const next = new Date(d);
            next.setHours(Number(hh ?? 0), Number(mm ?? 0), Number(ss ?? 0), 0);
            return next.toISOString();
          };

          const handleDateSelect = (d: Date | undefined) => {
            onChange(toIso(d, timeFromIso()));
          };

          const handleTimeChange = (time: string) => {
            onChange(toIso(datePart, time));
          };

          const mustBeFuture = Boolean(field.validation?.mustBeFuture);
          const minDate = mustBeFuture ? new Date() : undefined;

          return (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>

              <FormControl>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  {/* Date */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between font-normal sm:w-40"
                        type="button"
                      >
                        {datePart ? format(datePart, 'PPP') : 'Выберите дату'}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={datePart}
                        captionLayout="dropdown"
                        defaultMonth={datePart}
                        fromDate={minDate}
                        onSelect={(d) => handleDateSelect(d)}
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Time */}
                  <Input
                    type="time"
                    step="1"
                    value={timeFromIso()}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="bg-background appearance-none sm:w-40 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </div>
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

  // Fallback for unsupported types
  return null;
};

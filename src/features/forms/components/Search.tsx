// Изолированный Combobox для поиска по списку опций
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';

import type { FieldOption } from '../types/formField.types';

interface Props {
  options: FieldOption[];
  onChange: (value: string) => void;
}

export const Search = ({ options, onChange }: Props) => {
  return (
    <Combobox
      items={options}
      onValueChange={(value) => onChange((value as FieldOption).value)}
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
  );
};

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FormMode } from '../types/formStep.types';

interface FormModeButtonProps {
  modes: FormMode[];
  selectedMode: FormMode;
  onChange: (mode: FormMode) => void;
}

export const FormModeButton = ({
  modes,
  selectedMode,
  onChange,
}: FormModeButtonProps) => {
  return (
    <Tabs
      value={selectedMode.name}
      onValueChange={(value) => {
        const mode = modes.find((m) => m.name === value);
        if (mode) onChange(mode);
      }}
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 border-b">
        {modes.map((mode) => (
          <TabsTrigger key={mode.name} value={mode.name}>
            {mode.label ?? mode.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

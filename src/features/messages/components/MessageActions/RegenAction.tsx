// Кнопка перегенерации текста
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RotateCcw } from 'lucide-react';

interface RegenActionProps {
  handleRegen: () => void;
}

export const RegenAction = ({ handleRegen }: RegenActionProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleRegen}
        >
          <RotateCcw />
        </Button>
      </TooltipTrigger>

      <TooltipContent showArrow={false} className="p-1">
        <span className="font-medium">Перегенерировать</span>
      </TooltipContent>
    </Tooltip>
  );
};

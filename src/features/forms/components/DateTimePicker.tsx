import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { ru } from 'date-fns/locale';

interface DateTimePickerProps {
  value: string | null | undefined; // ISO string or empty
  onChange: (next: string) => void; // ISO string or ''
  mustBeFuture?: boolean;
  placeholder?: string;
  defaultTime?: string; // 'HH:mm:ss'
}

const pad2 = (n: number) => String(n).padStart(2, '0');

const getTimeFromIso = (iso: string, fallback: string) => {
  if (!iso) return fallback; // fallback must be 'HH:mm'
  const d = new Date(iso);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

const toIso = (date: Date | undefined, time: string) => {
  if (!date) return '';
  const [hh, mm] = (time || '00:00').split(':');
  const next = new Date(date);
  next.setHours(Number(hh ?? 0), Number(mm ?? 0), 0, 0);
  return next.toISOString();
};

const DEFAULT_TIME = '17:00';

export const DateTimePicker = ({
  value,
  onChange,
  mustBeFuture,
  placeholder = 'Выберите дату',
  defaultTime = DEFAULT_TIME,
}: DateTimePickerProps) => {
  const [open, setOpen] = useState(false);
  const iso = typeof value === 'string' ? value : '';
  const selectedDate = useMemo(() => (iso ? new Date(iso) : undefined), [iso]);
  const timeRef = useRef<HTMLInputElement>(null);

  const timeValue = useMemo(
    () => getTimeFromIso(iso, defaultTime),
    [iso, defaultTime],
  );

  const minDate = mustBeFuture ? new Date() : undefined;

  const handleDateSelect = (d: Date | undefined) => {
    onChange(toIso(d, timeValue));
    setOpen(false);
    timeRef.current?.focus();
  };

  const handleTimeChange = (time: string) => {
    onChange(toIso(selectedDate, time));
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-optional"
            className="min-w-[50%] justify-between font-normal"
          >
            {selectedDate
              ? format(selectedDate, 'PPP', { locale: ru })
              : placeholder}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            defaultMonth={selectedDate}
            hidden={
              minDate
                ? {
                    before: minDate,
                  }
                : undefined
            }
            onSelect={handleDateSelect}
          />
        </PopoverContent>
      </Popover>

      <Input
        ref={timeRef}
        type="time"
        step={60}
        value={timeValue}
        onChange={(e) => handleTimeChange(e.target.value)}
        className="min-w-[50%] bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
    </div>
  );
};

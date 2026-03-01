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
import { buildLocalDateTime, parseLocalDateTime } from '@/lib/dateTime';

interface DateTimePickerProps {
  value: string | null | undefined; // ISO string or empty
  onChange: (next: string) => void; // ISO string or ''
  disabled?: boolean;
  mustBeFuture?: boolean;
  placeholder?: string;
  defaultTime?: string; // 'HH:mm:ss'
}

const DEFAULT_TIME = '17:00';

export const DateTimePicker = ({
  value,
  onChange,
  mustBeFuture,
  placeholder = 'Выберите дату',
  defaultTime = DEFAULT_TIME,
  disabled,
}: DateTimePickerProps) => {
  const [open, setOpen] = useState(false);
  const iso = typeof value === 'string' ? value : '';
  const parsed = useMemo(
    () => (value ? parseLocalDateTime(value) : null),
    [value],
  );

  const selectedDate = useMemo(() => {
    if (!parsed) return undefined;
    // Create date in local time at midnight; no timezone shift for just date UI.
    return new Date(parsed.y, parsed.m - 1, parsed.d);
  }, [parsed]);

  const timeValue = useMemo(() => {
    if (!parsed) return defaultTime; // 'HH:mm'
    return `${String(parsed.hh).padStart(2, '0')}:${String(parsed.mm).padStart(2, '0')}`;
  }, [parsed, defaultTime]);

  const timeRef = useRef<HTMLInputElement>(null);
  const minDate = mustBeFuture ? new Date() : undefined;

  const handleDateSelect = (d: Date | undefined) => {
    onChange(buildLocalDateTime(d, timeValue));
    setOpen(false);
    timeRef.current?.focus();
  };

  const handleTimeChange = (time: string) => {
    onChange(buildLocalDateTime(selectedDate, time));
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant="outline"
            id="date-picker-optional"
            className="min-w-[48%] justify-between font-normal"
          >
            {selectedDate
              ? format(selectedDate, 'PPP', { locale: ru })
              : placeholder}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            disabled={disabled}
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
        disabled={disabled}
        ref={timeRef}
        type="time"
        step={60}
        value={timeValue}
        onChange={(e) => handleTimeChange(e.target.value)}
        className="min-w-[48%] bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
    </div>
  );
};

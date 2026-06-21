// Диалог изменения размера холста: пресеты (1:1, 16:9, 9:16, баннер 2:1) и ручной ввод

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const PRESETS = [
  { label: 'Квадрат 1:1', width: 1080, height: 1080 },
  { label: 'Широкий 16:9', width: 1920, height: 1080 },
  { label: 'Вертикальный 9:16', width: 1080, height: 1920 },
  { label: 'Баннер 2:1', width: 1200, height: 628 },
] as const;

const schema = z.object({
  width: z
    .string()
    .min(1, 'Введите ширину')
    .refine((v) => /^\d+$/.test(v) && parseInt(v, 10) > 0, 'Целое число > 0'),
  height: z
    .string()
    .min(1, 'Введите высоту')
    .refine((v) => /^\d+$/.test(v) && parseInt(v, 10) > 0, 'Целое число > 0'),
});

type FormValues = z.infer<typeof schema>;

interface CanvasSizeDialogProps {
  current: { width: number; height: number };
  onApply: (width: number, height: number) => void;
}

export const CanvasSizeDialog = ({
  current,
  onApply,
}: CanvasSizeDialogProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      width: String(current.width),
      height: String(current.height),
    },
  });

  const w = form.watch('width');
  const h = form.watch('height');

  const handlePreset = (width: number, height: number) => {
    form.setValue('width', String(width), { shouldValidate: true });
    form.setValue('height', String(height), { shouldValidate: true });
  };

  const handleSubmit = (values: FormValues) => {
    onApply(parseInt(values.width, 10), parseInt(values.height, 10));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {current.width} × {current.height}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Размер холста</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p.label}
                variant={
                  w === String(p.width) && h === String(p.height)
                    ? 'default'
                    : 'outline'
                }
                size="sm"
                onClick={() => handlePreset(p.width, p.height)}
              >
                {p.label}
              </Button>
            ))}
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-3"
            >
              <div className="flex gap-3 items-start">
                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Ширина (px)</FormLabel>
                      <FormControl>
                        <Input {...field} inputMode="numeric" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Высота (px)</FormLabel>
                      <FormControl>
                        <Input {...field} inputMode="numeric" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                Применить
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

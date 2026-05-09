import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PRESETS = [
  { label: 'Квадрат 1:1', width: 1080, height: 1080 },
  { label: 'Широкий 16:9', width: 1920, height: 1080 },
  { label: 'Вертикальный 9:16', width: 1080, height: 1920 },
  { label: 'Баннер 2:1', width: 1200, height: 628 },
  { label: 'Горизонт. A4', width: 1654, height: 1169 },
] as const;

interface CanvasSizeDialogProps {
  current: { width: number; height: number };
  onApply: (width: number, height: number) => void;
}

export const CanvasSizeDialog = ({ current, onApply }: CanvasSizeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [w, setW] = useState(String(current.width));
  const [h, setH] = useState(String(current.height));

  const handlePreset = (width: number, height: number) => {
    setW(String(width));
    setH(String(height));
  };

  const handleApply = () => {
    const width = parseInt(w, 10);
    const height = parseInt(h, 10);
    if (width > 0 && height > 0) {
      onApply(width, height);
      setOpen(false);
    }
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
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p.label}
                variant={w === String(p.width) && h === String(p.height) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePreset(p.width, p.height)}
              >
                {p.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <Label>Ширина (px)</Label>
              <Input
                type="number"
                min={100}
                max={8000}
                value={w}
                onChange={(e) => setW(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label>Высота (px)</Label>
              <Input
                type="number"
                min={100}
                max={8000}
                value={h}
                onChange={(e) => setH(e.target.value)}
              />
            </div>
          </div>
          <Button className="w-full" onClick={handleApply}>
            Применить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

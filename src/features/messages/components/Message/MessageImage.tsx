import { useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cx } from 'class-variance-authority';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { ImageInfo } from '../../types/messages.types';

interface MessageImageProps {
  info: ImageInfo;
}

export const MessageImage = ({ info }: MessageImageProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div
            className={cx(
              'bg-muted w-full max-w-[75%] overflow-hidden rounded-xl shadow-sm cursor-pointer'
            )}
          >
            <AspectRatio ratio={4 / 5} className="bg-black/10 rounded-xl">
              <img
                src={info.image_url}
                alt="Сгенерированное изображение"
                className="h-full w-full object-contain rounded-xl transition hover:opacity-90"
              />
            </AspectRatio>
          </div>
        </DialogTrigger>

        <DialogContent
          className="group max-w-4xl p-0 bg-background border-none shadow-none"
          aria-describedby={undefined}
        >
          <DialogTitle hidden>Сгенерированное изображение</DialogTitle>
          <div className="relative flex justify-center items-center">
            <Button
              asChild
              variant={'ghost'}
              size={'icon-lg'}
              className="rounded-full absolute opacity-0 transition group-hover:opacity-100"
            >
              <a download href={info.download_url} className="p-8">
                <Download />
              </a>
            </Button>
            <img
              src={info.image_url}
              alt="Сгенерированное изображение (полный размер)"
              className="max-h-[90vh] w-auto rounded-xl object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

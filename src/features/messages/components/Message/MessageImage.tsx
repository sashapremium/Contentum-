import { useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cx } from 'class-variance-authority';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { ImageInfo } from '../../types/messages.types';

interface MessageImageProps {
  info: Pick<ImageInfo, 'resultPng' | 'resultWebp'>;
  prefix?: string;
  showDownload?: boolean;
}

export const MessageImage = ({ info, prefix, showDownload = true }: MessageImageProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div
            className={cx(
              'bg-muted overflow-hidden rounded-xl shadow-sm cursor-pointer',
            )}
          >
            <AspectRatio ratio={1 / 1} className="bg-black/10 rounded-xl">
              <img
                src={`${prefix ?? ''}${info.resultPng}`}
                alt="Сгенерированное изображение"
                className="h-full w-full object-contain rounded-xl transition hover:opacity-90"
              />
            </AspectRatio>
          </div>
        </DialogTrigger>

        <DialogContent
          className="group max-w-4xl p-0 bg-background border-none shadow-none"
          aria-describedby={undefined}
          showCloseButton={false}
        >
          <DialogTitle hidden>Сгенерированное изображение</DialogTitle>
          <div className="relative flex justify-center items-center">
            {showDownload && (
              <Button
                asChild
                variant={'ghost'}
                size={'icon-lg'}
                className="rounded-full absolute opacity-0 transition group-hover:opacity-100"
              >
                <a
                  href={`${prefix ?? ''}${info.resultPng}`}
                  className="p-8"
                  download="photo_v.png"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Download />
                </a>
              </Button>
            )}
            <img
              src={`${prefix ?? ''}${info.resultPng}`}
              alt="Сгенерированное изображение (полный размер)"
              className="max-h-[90vh] w-auto rounded-xl object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

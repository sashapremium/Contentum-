import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { ImageInfo } from '../types/messages.types';
import { cx } from 'class-variance-authority';

interface MessageImageProps {
  info: ImageInfo;
}

export const MessageImage = ({ info }: MessageImageProps) => {
  return (
    <div
      className={cx(
        'bg-muted w-full max-w-[75%] overflow-hidden rounded-xl shadow-sm'
      )}
    >
      <AspectRatio ratio={4 / 5} className="bg-black/10 rounded-xl">
        <img
          src={info.image_url}
          alt="Сгенерированное изображение"
          className="h-full w-full object-contain rounded-xl"
        />
      </AspectRatio>
    </div>
  );
};

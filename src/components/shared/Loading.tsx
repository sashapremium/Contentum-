// Спиннер загрузки, центрированный в контейнере.
import { Spinner } from '@/components/ui/spinner';
import { cx } from 'class-variance-authority';

interface LoadingProps {
  className?: string;
}
export const Loading = ({ className }: LoadingProps) => {
  return (
    <div className={cx('flex items-center justify-center m-auto', className)}>
      <Spinner className="size-8" />
    </div>
  );
};

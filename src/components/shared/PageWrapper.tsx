import { cx } from 'class-variance-authority';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

export const PageWrapper = ({
  className,
  children,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cx(
        'max-w-none mx-0 px-4',
        'sm:max-w-[min(65vw,768px)] sm:mx-auto sm:px-0',
        'w-full',
        className
      )}
    >
      {children}
    </div>
  );
};

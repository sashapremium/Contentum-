import { cx } from 'class-variance-authority';
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { MainHeader } from './MainHeader';
import { useSidebar } from '../ui/sidebar';

interface PageWrapperProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  header?: ReactNode;
}

export const PageWrapper = ({
  className,
  children,
  header,
  ...props
}: PageWrapperProps) => {
  const { isMobile } = useSidebar();

  return (
    <>
      {header === undefined ? (
        isMobile && <MainHeader>{header}</MainHeader>
      ) : (
        <MainHeader>{header}</MainHeader>
      )}

      <div
        {...props}
        className={cx(
          'max-w-none mx-0 px-4',
          'sm:max-w-[min(65vw,768px)] sm:mx-auto sm:px-0',
          'w-full',
          className,
        )}
      >
        {children}
      </div>
    </>
  );
};

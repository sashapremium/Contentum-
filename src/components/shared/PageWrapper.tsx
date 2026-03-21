import { cx } from 'class-variance-authority';
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { MainHeader } from './MainHeader';
import { useSidebar } from '../ui/sidebar';

interface PageWrapperProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  header?: ReactNode;
  wide?: boolean;
}

export const PageWrapper = ({
  className,
  children,
  header,
  wide,
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
          'max-w-none mx-0 px-4 w-full',
          !wide && 'sm:max-w-[min(65vw,768px)] sm:mx-auto sm:px-0',
          wide && 'px-4 sm:px-16',
          className,
        )}
      >
        {children}
      </div>
    </>
  );
};

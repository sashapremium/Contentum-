// Заголовок страницы (h1) с обрезкой длинного текста через truncate.
import { cx } from 'class-variance-authority';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type PageHeadingProps = DetailedHTMLProps<
  HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

export const PageHeading = ({
  children,
  className,
  ...props
}: PageHeadingProps) => (
  <h1 className={cx('truncate', className)} {...props}>
    {children}
  </h1>
);

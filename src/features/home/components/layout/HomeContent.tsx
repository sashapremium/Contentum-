// Обёртка для основного контента страницы

import type { ReactNode } from 'react';

interface HomeContentProps {
  children: ReactNode;
}

export const HomeContent = ({ children }: HomeContentProps) => {
  return <>{children}</>;
};

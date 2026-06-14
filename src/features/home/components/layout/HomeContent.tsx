// Обёртка для основного контента страницы. Зарезервирована для будущего общего оформления.

import type { ReactNode } from 'react';

interface HomeContentProps {
  children: ReactNode;
}

export const HomeContent = ({ children }: HomeContentProps) => {
  return <>{children}</>;
};

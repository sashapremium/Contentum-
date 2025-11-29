import type { ReactNode } from 'react';

interface HomeContentProps {
  children: ReactNode;
}

export const HomeContent = ({ children }: HomeContentProps) => {
  return <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>;
};

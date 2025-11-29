import type { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface ErrorProps {
  description: ReactNode;

  title?: ReactNode;
}

export const Error = ({ description, title }: ErrorProps) => {
  return (
    <Alert variant="destructive">
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

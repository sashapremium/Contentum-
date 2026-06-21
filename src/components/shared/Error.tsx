// компонент для отображения ошибок: иконка, опциональный заголовок и текст описания
import type { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircleIcon } from 'lucide-react';

interface ErrorProps {
  description: ReactNode;

  title?: ReactNode;
}

export const Error = ({ description, title }: ErrorProps) => {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

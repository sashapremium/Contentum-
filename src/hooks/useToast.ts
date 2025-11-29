import { toast } from 'sonner';

export const useInfo = () => {
  return (message: string) =>
    toast.info(message, {
      position: 'top-center',
      style: { backgroundColor: 'var(--color-info)' },
    });
};

export const useError = () => {
  return (message: string) =>
    toast.error(message, {
      position: 'top-center',
      style: { backgroundColor: 'var(--color-error)' },
    });
};

export const useSuccess = () => {
  return (message: string) =>
    toast.error(message, {
      position: 'top-center',
      style: { backgroundColor: 'var(--color-success)' },
    });
};

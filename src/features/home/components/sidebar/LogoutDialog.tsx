import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/store/auth.store';

export const LogoutDialog = ({
  open,
  onOpenChange,
}: React.ComponentProps<typeof Dialog>) => {
  const logout = useAuthStore((s) => s.logout);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Выйти из аккаунта?</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите завершить сеанс?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange?.(false)}>
            Отмена
          </Button>
          <Button variant="destructive" onClick={logout}>
            Выйти
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

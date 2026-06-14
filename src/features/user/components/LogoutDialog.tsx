// Диалог подтверждения выхода из аккаунта. При подтверждении вызывает logout из useAuthStore.

import { Dialog } from '@/components/ui/dialog';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export const LogoutDialog = ({
  open,
  onOpenChange,
}: React.ComponentProps<typeof Dialog>) => {
  const logout = useAuthStore((s) => s.logout);

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Выйти из аккаунта?"
      description="Вы уверены, что хотите завершить сеанс?"
      confirmText="Выйти"
      onClickConfirm={logout}
    />
  );
};

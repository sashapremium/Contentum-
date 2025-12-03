import { Button } from '../ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from '../ui/dialog';

interface ConfirmDialogProps extends React.ComponentProps<typeof Dialog> {
  title: string;
  confirmText: string;
  cancelText?: string;
  description?: string;

  onClickConfirm: () => void;
  onClickCancel?: () => void;
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  onClickConfirm,
  onClickCancel,
  title,
  description,
  confirmText,
  cancelText = 'Отмена',
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          {cancelText && (
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange?.(false);
                onClickCancel?.();
              }}
            >
              {cancelText}
            </Button>
          )}
          <Button variant="destructive" onClick={onClickConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

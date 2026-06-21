// Вкладка учреждений: список, кнопка создания, редактирование через, удаление

import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FilePlus, Settings2, Trash2 } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { THEATRE_CREATE } from '@/app/router/routes';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Error } from '@/components/shared/Error';
import { Loading } from '@/components/shared/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import type { Theatre, TheatreCreateRequest } from '../types';
import { TheatreCreateRequestSchema } from '../types';
import { useTheatresQuery } from '../queries/useTheatresQuery';
import { useDeleteTheatreMutation } from '../queries/useDeleteTheatreMutation';
import { useUpdateTheatreMutation } from '../queries/useUpdateTheatreMutation';

interface UpdateTheatreDialogProps {
  theatre: Theatre | null;
  onClose: () => void;
}

const UpdateTheatreDialog = ({
  theatre,
  onClose,
}: UpdateTheatreDialogProps) => {
  const updateMutation = useUpdateTheatreMutation();

  const form = useForm<TheatreCreateRequest>({
    resolver: zodResolver(TheatreCreateRequestSchema),
    values: theatre
      ? { name: theatre.name, address: theatre.address }
      : { name: '', address: '' },
  });

  const onSubmit = (payload: TheatreCreateRequest) => {
    if (!theatre) return;
    updateMutation.mutate({ id: theatre.id, payload }, { onSuccess: onClose });
  };

  return (
    <Dialog open={Boolean(theatre)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Изменить учреждение</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название*</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите название" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите адрес" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {updateMutation.isError && (
              <Error description="Не удалось обновить учреждение" />
            )}
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                Сохранить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const TheatresTab = () => {
  const theatresQuery = useTheatresQuery();
  const deleteMutation = useDeleteTheatreMutation();

  const [editTarget, setEditTarget] = useState<Theatre | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Theatre | null>(null);

  if (theatresQuery.isLoading) return <Loading />;
  if (theatresQuery.isError)
    return <Error description="Не удалось загрузить учреждения" />;

  const theatres = theatresQuery.data?.theatres ?? [];

  return (
    <div className="space-y-4">
      <div>
        <Button asChild>
          <Link to={THEATRE_CREATE}>
            <FilePlus />
            Создать учреждение
          </Link>
        </Button>
      </div>

      {theatres.length === 0 && (
        <p className="text-sm text-muted-foreground">Учреждения не найдены</p>
      )}

      <div className="space-y-2">
        {theatres.map((theatre) => (
          <div
            key={theatre.id}
            className="flex items-center justify-between rounded-lg border px-4 py-3"
          >
            <div>
              <div className="font-medium">{theatre.name}</div>
              {theatre.address && (
                <div className="text-sm text-muted-foreground">
                  {theatre.address}
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditTarget(theatre)}
                  >
                    <Settings2 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Изменить</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(theatre)}
                  >
                    <Trash2 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Удалить</TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      <UpdateTheatreDialog
        theatre={editTarget}
        onClose={() => setEditTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить учреждение?"
        description={`Учреждение «${deleteTarget?.name}» будет удалено безвозвратно.`}
        confirmText="Удалить"
        onClickConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          });
        }}
      />
    </div>
  );
};

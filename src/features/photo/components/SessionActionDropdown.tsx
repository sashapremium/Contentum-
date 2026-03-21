import { useState } from 'react';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontal, SquarePen, Trash } from 'lucide-react';

import type { PhotoSessionListItem } from '../types/photos.types';

import { useDeletePhotoSessionMutation } from '../queries/useDeletePhotoSessionMutation';
import { useUpdatePhotoSessionMutation } from '../queries/useUpdatePhotoSessionMutation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SidebarMenuAction, useSidebar } from '@/components/ui/sidebar';

import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Error } from '@/components/shared/Error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

const SessionRenameSchema = z.object({
  title: z.string().trim().min(1).max(255),
});

type SessionRenameForm = z.infer<typeof SessionRenameSchema>;

interface SessionActionDropdownProps {
  session: PhotoSessionListItem;
}

export const SessionActionDropdown = ({
  session,
}: SessionActionDropdownProps) => {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  const deleteMutation = useDeletePhotoSessionMutation();
  const updateMutation = useUpdatePhotoSessionMutation();

  const form = useForm<SessionRenameForm>({
    resolver: zodResolver(SessionRenameSchema),
    defaultValues: {
      title: session.title,
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(session.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        navigate('/');
      },
    });
  };

  const handleRename = (values: SessionRenameForm) => {
    updateMutation.mutate(
      {
        id: session.id,
        payload: {
          title: values.title,
        },
      },
      {
        onSuccess: () => {
          setRenameOpen(false);
        },
      },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-48 rounded-lg"
          side={isMobile ? 'bottom' : 'right'}
          align={isMobile ? 'end' : 'start'}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem onClick={() => setRenameOpen(true)}>
            <SquarePen className="mr-2" />
            <span>Переименовать</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash className="mr-2" />
            <span>Удалить</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Удалить сессию "${session.title.length > 20 ? `${session.title.slice(0, 20)}…` : session.title}"?`}
        description="Все сгенерированные варианты будут потеряны"
        confirmText={deleteMutation.isPending ? 'Удаление...' : 'Удалить'}
        onClickConfirm={handleDelete}
      />

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent
          className="max-w-sm"
          aria-describedby={undefined}
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Введите новое название сессии</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleRename)}
              className="space-y-4"
              noValidate
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Новое название" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {updateMutation.isError && (
                <Error description="Ошибка при переименовании сессии" />
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setRenameOpen(false)}
                >
                  Отмена
                </Button>

                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending
                    ? 'Переименование...'
                    : 'Переименовать'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

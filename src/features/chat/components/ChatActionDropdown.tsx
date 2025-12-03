import { useState } from 'react';
import type { Chat } from '../types/chat.types';

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

import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Ellipsis, SquarePen, Trash } from 'lucide-react';

import { useForm } from 'react-hook-form';
import {
  ChatRenameSchema,
  type ChatRenameForm,
} from '../types/chatRename.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Error } from '@/components/shared/Error';
import { useDeleteChatMutation } from '../queries/useDeleteChatMutation';
import { useUpdateChatMutation } from '../queries/useUpdateChatMutation';

interface ChatActionDropdownProps {
  chat: Chat;
}

export const ChatActionDropdown = ({ chat }: ChatActionDropdownProps) => {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteMutation = useDeleteChatMutation();
  const updateMutation = useUpdateChatMutation();

  const form = useForm<ChatRenameForm>({
    resolver: zodResolver(ChatRenameSchema),
    defaultValues: { title: chat.title },
  });

  const handleDelete = () => {
    deleteMutation.mutate(chat.id, {
      onSuccess: () => setDeleteOpen(false),
    });
  };

  const handleRename = (values: ChatRenameForm) => {
    updateMutation.mutate(
      {
        id: chat.id,
        data: {
          title: values.title,
          isActive: chat.isActive,
        },
      },
      {
        onSuccess: () => setRenameOpen(false),
      }
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={(e) => e.stopPropagation()}
          className="p-1 hover:bg-muted rounded"
        >
          <Ellipsis className="h-5 w-5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={4}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem onClick={() => setRenameOpen(true)}>
            <SquarePen className="mr-2" />
            Переименовать
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash className="mr-2" />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Удалить чат?"
        description="Вся история сообщений будет потеряна"
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
            <DialogTitle>Введите новое название чата</DialogTitle>
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
                <Error description="Ошибка при переименовании чата" />
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

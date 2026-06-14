// Dropdown с действиями над чатом: переименование (через диалог с формой) и удаление (через ConfirmDialog).
import { useState } from 'react';
import {
  ChatRenameSchema,
  type Chat,
  type ChatRenameForm,
} from '../types/chat.types';

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

import { MoreHorizontal, SquarePen, Trash } from 'lucide-react';

import { useForm } from 'react-hook-form';
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
import { useNavigate } from 'react-router';
import { useRenameChatMutation } from '../queries/useRenameChatMutation';
import { SidebarMenuAction, useSidebar } from '@/components/ui/sidebar';

interface ChatActionDropdownProps {
  chat: Chat;
}

export const ChatActionDropdown = ({ chat }: ChatActionDropdownProps) => {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteMutation = useDeleteChatMutation();
  const renameMutation = useRenameChatMutation();

  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  const form = useForm<ChatRenameForm>({
    resolver: zodResolver(ChatRenameSchema),
    defaultValues: { title: chat.title },
  });

  const handleDelete = () => {
    deleteMutation.mutate(chat.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        navigate('/');
      },
    });
  };

  const handleRename = (values: ChatRenameForm) => {
    renameMutation.mutate(
      {
        id: chat.id,
        data: {
          title: values.title,
        },
      },
      {
        onSuccess: () => setRenameOpen(false),
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
        title={`Удалить чат "${chat.title.length > 20 ? chat.title.slice(0, 20) + '…' : chat.title}"?`}
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

              {renameMutation.isError && (
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

                <Button type="submit" disabled={renameMutation.isPending}>
                  {renameMutation.isPending
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

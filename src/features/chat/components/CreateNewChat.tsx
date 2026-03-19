import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { MainHeader } from '@/components/shared/MainHeader';
import { useSidebar } from '@/components/ui/sidebar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { FormContainer } from '@/features/forms/components/FormContainer';

import { useCreateChatMutation } from '../queries/useCreateChatMutation';
import type { FormSubmit } from '@/features/forms/types/formField.types';
import { useUserMeQuery } from '@/features/user/queries/useUserMeQuery';
import { useChatsQuery } from '../queries/useChatsQuery';
import { Loading } from '@/components/shared/Loading';
import { POST_PREFIX } from '@/app/router/routes';

export const CreateNewChat = () => {
  const navigate = useNavigate();

  const createChat = useCreateChatMutation();
  const { data: user } = useUserMeQuery();
  const { data: chats, isLoading } = useChatsQuery();

  const { isMobile } = useSidebar();

  const [open, setOpen] = useState(false);

  const handleCreate = (formData: FormSubmit) => {
    console.log('data', formData);
    createChat.mutate(
      {
        user: user!.id,
        fields: formData.fields,
      },
      {
        onSuccess: (res) => {
          setOpen(false);
          navigate(`${POST_PREFIX}${res.chatId}`);
        },
      },
    );
  };

  return (
    <>
      {isMobile && <MainHeader />}

      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex items-center justify-center m-auto">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={createChat.isPending}>
                {createChat.isPending ? 'Создание...' : 'Создать новый пост'}
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <FormContainer
                formStep={chats!.payload}
                chatId="new"
                onSubmit={handleCreate}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { MainHeader } from '@/components/shared/MainHeader';
import { useSidebar } from '@/components/ui/sidebar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { FormContainer } from '@/features/forms/components/FormContainer';
import type { FormStep } from '@/features/forms/types/formStep.types';

import { useCreateChatMutation } from '../queries/useCreateChatMutation';
import type { FormSubmit } from '@/features/forms/types/formField.types';

export const CreateNewChat = () => {
  const navigate = useNavigate();
  const createChat = useCreateChatMutation();
  const { isMobile } = useSidebar();

  const [open, setOpen] = useState(false);

  const handleCreate = (data: FormSubmit) => {
    console.log('data', data);
    createChat.mutate(
      {
        user: MOCK_USER_ID,
        fields: data.fields,
      },
      {
        onSuccess: (res) => {
          setOpen(false);
          navigate(`/chat/${res.chatId}`);
        },
      },
    );
  };

  return (
    <>
      {isMobile && <MainHeader />}

      <div className="flex items-center justify-center m-auto">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={createChat.isPending}>
              {createChat.isPending ? 'Создание...' : 'Создать новый чат'}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl p-0">
            <FormContainer
              formStep={createChatFormStep}
              chatId="new"
              onSubmit={handleCreate}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { MainHeader } from '@/components/shared/MainHeader';
import { useSidebar } from '@/components/ui/sidebar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

import { FormContainer } from '@/features/forms/components/FormContainer';
import type { FormStep } from '@/features/forms/types/formStep.types';

import { useCreateChatMutation } from '../queries/useCreateChatMutation';
import type { FormSubmit } from '@/features/forms/types/formField.types';

const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000'; // valid UUID for now

export const CreateNewChat = () => {
  const navigate = useNavigate();
  const createChat = useCreateChatMutation();
  const { isMobile } = useSidebar();

  const [open, setOpen] = useState(false);

  const createChatFormStep: FormStep = useMemo(
    () => ({
      step: 0,
      type: 'form',
      title: 'Создание нового поста',
      description: 'Выберите тип публикации',
      disabled: false,
      modes: [
        {
          name: 'default',
          label: null,
          fieldsGroups: [
            {
              groupName: 'default',
              groupLabel: null,
              groupFields: [
                {
                  name: 'postType',
                  type: 'select',
                  label: 'Тип поста',
                  required: true,
                  value: null,
                  options: [
                    { value: 'announcement', label: 'Анонс мероприятия' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
    [],
  );

  /**
   * FormContainer calls onSubmit with: { step, mode, fields }
   */
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

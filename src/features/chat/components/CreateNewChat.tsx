import { useNavigate } from 'react-router';

import { FormContainer } from '@/features/forms/components/FormContainer';

import { useCreateChatMutation } from '../queries/useCreateChatMutation';
import type { FormSubmit } from '@/features/forms/types/formField.types';
import { useUserMeQuery } from '@/features/user/queries/useUserMeQuery';
import { useChatsQuery } from '../queries/useChatsQuery';
import { Loading } from '@/components/shared/Loading';
import { POST } from '@/app/router/routes';
import { Card, CardContent } from '@/components/ui/card';

export const CreateNewChat = () => {
  const navigate = useNavigate();

  const createChat = useCreateChatMutation();
  const { data: user } = useUserMeQuery();
  const { data: chats, isLoading } = useChatsQuery();

  const handleCreate = (formData: FormSubmit) => {
    console.log('data', formData);
    createChat.mutate(
      {
        user: user!.id,
        fields: formData.fields,
      },
      {
        onSuccess: (res) => {
          navigate(`${POST}/${res.chatId}`);
        },
      },
    );
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="my-auto px-[5%] sm:px-[10%] md:px-[20%] lg:px-[30%]">
          <Card>
            <CardContent>
              <FormContainer
                formStep={chats!.payload}
                chatId="new"
                onSubmit={handleCreate}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

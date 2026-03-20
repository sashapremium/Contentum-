import { POST } from '@/app/router/routes';
import type { FormSubmit } from '@/features/forms/types/formField.types';
import { useUserMeQuery } from '@/features/user/queries/useUserMeQuery';
import { useNavigate } from 'react-router';
import { useChatsQuery } from '../../queries/useChatsQuery';
import { useCreateChatMutation } from '../../queries/useCreateChatMutation';
import { Loading } from '@/components/shared/Loading';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { FormContainer } from '@/features/forms/components/FormContainer';

export const ChatCreatePage = () => {
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageWrapper header={<h1 className="truncate">Создать пост</h1>}>
      <Card>
        <CardContent>
          <FormContainer
            formStep={chats!.payload}
            chatId="new"
            onSubmit={handleCreate}
          />
        </CardContent>
      </Card>
    </PageWrapper>
  );
};

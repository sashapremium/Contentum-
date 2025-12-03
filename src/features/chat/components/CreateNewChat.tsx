import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { useCreateChatMutation } from '../queries/useCreateChatMutation';

export const CreateNewChat = () => {
  const navigate = useNavigate();
  const createChat = useCreateChatMutation();

  const handleCreate = () => {
    createChat.mutate(
      { title: 'Новый чат', isActive: true },
      {
        onSuccess: (chat) => {
          navigate(`/chat/${chat.id}`);
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center m-auto">
      <Button onClick={handleCreate} disabled={createChat.isPending}>
        {createChat.isPending ? 'Создание...' : 'Создать новый чат'}
      </Button>
    </div>
  );
};

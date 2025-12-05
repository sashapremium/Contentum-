import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendMessage } from '../api/messages.api';
import { MESSAGES_QUERY_KEYS } from './messages.queryKeys';
import type {
  SendMessageBody,
  SendMessageResponse,
  Message,
} from '../types/messages.types';
import { v4 as uuid } from 'uuid';

export const useSendMessageMutation = (chatId: string) => {
  const qc = useQueryClient();

  return useMutation<SendMessageResponse, unknown, SendMessageBody>({
    mutationFn: (body) => sendMessage(body),

    onMutate: async (body) => {
      await qc.cancelQueries({
        queryKey: MESSAGES_QUERY_KEYS.list(chatId),
      });

      const previousMessages = qc.getQueryData<Message[]>(
        MESSAGES_QUERY_KEYS.list(chatId)
      );

      const tempId = uuid();

      const optimistic: Message = {
        id: tempId,
        chat: chatId,
        content: body.content,
        messageType: body.messageType ?? 'USER',
        createdAt: new Date().toISOString(),
      };

      qc.setQueryData<Message[]>(
        MESSAGES_QUERY_KEYS.list(chatId),
        (old = []) => [...old, optimistic]
      );

      return { previousMessages, tempId };
    },

    onError: (_error, _body, ctx) => {
      if (!ctx) return;

      qc.setQueryData<Message[]>(
        MESSAGES_QUERY_KEYS.list(chatId),
        ctx.previousMessages ?? []
      );
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: MESSAGES_QUERY_KEYS.list(chatId),
      });
    },
  });
};

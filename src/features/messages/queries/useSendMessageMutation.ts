import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendMessage } from '../api/messages.api';
import { MESSAGES_QUERY_KEYS } from './messages.queryKeys';
import type {
  SendMessageBody,
  SendMessageResponse,
} from '../types/messages.types';

export const useSendMessageMutation = (chatId: string) => {
  const qc = useQueryClient();

  return useMutation<SendMessageResponse, unknown, SendMessageBody>({
    mutationFn: (body) => sendMessage(body),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: MESSAGES_QUERY_KEYS.list(chatId),
      });
    },
  });
};

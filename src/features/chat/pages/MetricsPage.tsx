import { useParams } from 'react-router-dom';
import { Loading } from '@/components/shared/Loading';
import { Error } from '@/components/shared/Error';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { mapApiError } from '@/lib/apiErrorMapper';
import { POST } from '@/app/router/routes';
import { useChatQuery } from '../queries/useChatQuery';
import { GeneratedVariantCard } from '@/features/messages/components/GeneratedVariantCard';
import { getVariantLabels } from '@/features/messages/components/MessageGenerated/metricsUtils';

export function MetricsPage() {
  const { chatId, messageId } = useParams<{
    chatId: string;
    messageId: string;
  }>();

  const { data: chat, isLoading, isError, error } = useChatQuery(chatId);

  if (isLoading) return <Loading />;

  if (isError || !chat) {
    return (
      <div className="m-auto">
        <Error description={mapApiError(error)} />
      </div>
    );
  }

  const msgIdNum = messageId ? parseInt(messageId, 10) : NaN;
  const message = chat.messages?.find((m) => m.id === msgIdNum);

  if (!message || message.type !== 'generatedText') {
    return (
      <div className="m-auto">
        <Error description="Сообщение не найдено или не является результатом генерации" />
      </div>
    );
  }

  const items = message.payload.content;
  const labels = getVariantLabels(items);
  const bestIdx = labels.indexOf('Лучший вариант');

  return (
    <PageWrapper
      size="wide"
      header={
        <Breadcrumbs
          links={[
            { url: `${POST}/${chatId}`, label: chat.title },
            { url: '#', label: 'Подробный обзор' },
          ]}
        />
      }
    >
      <div
        className="mt-2 grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        }}
      >
        {items.map((item, idx) => (
          <GeneratedVariantCard
            key={idx}
            item={item}
            index={idx}
            label={labels[idx]}
            isBest={idx === bestIdx}
          />
        ))}
      </div>
    </PageWrapper>
  );
}

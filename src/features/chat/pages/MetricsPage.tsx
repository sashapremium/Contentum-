import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loading } from '@/components/shared/Loading';
import { Error } from '@/components/shared/Error';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { mapApiError } from '@/lib/apiErrorMapper';
import { POST } from '@/app/router/routes';
import { useChatQuery } from '../queries/useChatQuery';
import { MetricsSummaryTab } from '@/features/messages/components/MessageGenerated/MetricsSummaryTab';
import { MetricsVariantsTab } from '@/features/messages/components/MessageGenerated/MetricsVariantsTab';

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
  const chatUrl = `${POST}/${chatId}`;

  return (
    <PageWrapper
      size="medium"
      header={
        <Breadcrumbs
          links={[
            { url: chatUrl, label: chat.title },
            { url: '#', label: 'Метрики' },
          ]}
        />
      }
    >
      <Tabs defaultValue="summary" className="mt-2">
        <TabsList>
          <TabsTrigger value="summary">Сводка</TabsTrigger>
          <TabsTrigger value="variants">По вариантам</TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="mt-4">
          <MetricsSummaryTab items={items} />
        </TabsContent>
        <TabsContent value="variants" className="mt-4">
          <MetricsVariantsTab items={items} />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}

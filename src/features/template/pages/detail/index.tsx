// Страница редактирования шаблона: загружает шаблон по theatreId+templateId из URL
// и передаёт его в EditorPage в режиме update.

import { useParams } from 'react-router';

import { Error } from '@/components/shared/Error';
import { Loading } from '@/components/shared/Loading';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { PageHeading } from '@/components/shared/PageHeading';

import { useTemplateQuery } from '../../queries/useTemplateQuery';
import { EditorPage } from '../editor';

export const TemplateDetailPage = () => {
  const { theatreId, templateId } = useParams<{ theatreId: string; templateId: string }>();
  const query = useTemplateQuery(Number(theatreId), templateId);

  if (query.isLoading) return <Loading />;

  if (query.isError || !query.data) {
    return (
      <PageWrapper header={<PageHeading>Шаблон</PageHeading>}>
        <Error description="Не удалось загрузить шаблон" />
      </PageWrapper>
    );
  }

  return <EditorPage mode="update" initialTemplate={query.data} />;
};

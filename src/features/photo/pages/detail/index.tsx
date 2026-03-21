import { useParams } from 'react-router';

import { PageHeading } from '@/components/shared/PageHeading';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Error } from '@/components/shared/Error';
import { usePhotoSessionQuery } from '../../queries/usePhotoSessionQuery';
import { Loading } from '@/components/shared/Loading';
import { mapApiError } from '@/lib/apiErrorMapper';

export const PhotoDetailPage = () => {
  const { photoId } = useParams<{ photoId: string }>();

  const sessionQuery = usePhotoSessionQuery(photoId);

  if (!photoId) {
    return (
      <div className="m-auto">
        <Error description="Сессия с данным id не найдена" />
      </div>
    );
  }

  if (sessionQuery.isLoading) {
    return <Loading />;
  }

  if (sessionQuery.isError || !sessionQuery.data) {
    return (
      <div className="m-auto">
        <Error description={mapApiError(sessionQuery.error)} />
      </div>
    );
  }

  const session = sessionQuery.data;

  return (
    <PageWrapper header={<PageHeading>{session.title}</PageHeading>}>
      <div className="space-y-6">
        <div className="text-sm text-muted-foreground">
          Session ID: {session.sessionId}
        </div>

        <div className="space-y-2">
          <div>Theatre ID: {session.theatreId}</div>
          <div>Template: {session.templateId}</div>
          <div>Created: {session.createdAt}</div>
          <div>Updated: {session.updatedAt}</div>
        </div>

        <div className="space-y-4">
          <div className="font-medium">History</div>

          {session.history.length === 0 && (
            <div className="text-muted-foreground">No variants yet</div>
          )}

          {session.history.map((item) => (
            <div
              key={item.variantNumber}
              className="border rounded-md p-3 space-y-2"
            >
              <div>Variant #{item.variantNumber}</div>
              <div>{item.mainText}</div>

              <img src={item.resultWebp} alt="" className="max-w-xs rounded" />
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

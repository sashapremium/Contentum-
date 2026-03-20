import { PHOTO_TITLE } from '@/app/router/routes';
import { PageHeading } from '@/components/shared/PageHeading';
import { PageWrapper } from '@/components/shared/PageWrapper';

export const PhotoCreatePage = () => {
  return (
    <PageWrapper
      header={<PageHeading>{PHOTO_TITLE}</PageHeading>}
    ></PageWrapper>
  );
};

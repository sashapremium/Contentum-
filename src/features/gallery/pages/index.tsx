import { GALLERY_TITLE } from '@/app/router/routes';
import { PageHeading } from '@/components/shared/PageHeading';
import { PageWrapper } from '@/components/shared/PageWrapper';

export const GalleryPage = () => {
  return (
    <PageWrapper
      header={<PageHeading>{GALLERY_TITLE}</PageHeading>}
    ></PageWrapper>
  );
};

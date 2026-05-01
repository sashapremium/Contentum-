import { THEATRE_TITLE } from '@/app/router/routes';
import { PageHeading } from '@/components/shared/PageHeading';
import { PageWrapper } from '@/components/shared/PageWrapper';

export const TheatrePage = () => {
  return (
    <PageWrapper
      wide
      header={<PageHeading>{THEATRE_TITLE}</PageHeading>}
    ></PageWrapper>
  );
};

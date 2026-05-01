import { TEMPLATE_TITLE } from '@/app/router/routes';
import { PageHeading } from '@/components/shared/PageHeading';
import { PageWrapper } from '@/components/shared/PageWrapper';

export const TemplateCreatePage = () => {
  return (
    <PageWrapper header={<PageHeading>{TEMPLATE_TITLE}</PageHeading>}>
      template
    </PageWrapper>
  );
};

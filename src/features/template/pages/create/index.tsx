import { THEATRE, THEATRE_TITLE, TEMPLATE_TITLE } from '@/app/router/routes';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { PageWrapper } from '@/components/shared/PageWrapper';

const breadcrumbs = [
  { url: THEATRE, label: THEATRE_TITLE },
  { url: '#', label: TEMPLATE_TITLE },
];

export const TemplateCreatePage = () => {
  return (
    <PageWrapper header={<Breadcrumbs links={breadcrumbs} />}>
      template
    </PageWrapper>
  );
};

import { THEATRE_TEMPLATE_CREATE, THEATRE_TITLE } from '@/app/router/routes';
import { PageHeading } from '@/components/shared/PageHeading';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';

export const TheatrePage = () => {
  return (
    <PageWrapper wide header={<PageHeading>{THEATRE_TITLE}</PageHeading>}>
      <Button asChild>
        <Link to={THEATRE_TEMPLATE_CREATE}>
          <FilePlus />
          Создать шаблон
        </Link>
      </Button>
    </PageWrapper>
  );
};

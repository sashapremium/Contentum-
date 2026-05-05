import {
  THEATRE,
  THEATRE_TEMPLATE_CREATE,
  THEATRE_TITLE,
} from '@/app/router/routes';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

export const TheatrePage = () => {
  return (
    <PageWrapper
      wide
      header={<Breadcrumbs links={[{ label: THEATRE_TITLE, url: THEATRE }]} />}
    >
      <Button asChild>
        <Link to={THEATRE_TEMPLATE_CREATE}>
          <FilePlus />
          Создать шаблон
        </Link>
      </Button>
    </PageWrapper>
  );
};

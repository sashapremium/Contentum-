import { THEATRE, THEATRE_TITLE } from '@/app/router/routes';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { BrandbooksTab } from './BrandbooksTab';
import { TemplatesTab } from './TemplatesTab';
import { TheatresTab } from './TheatresTab';

export const TheatrePage = () => {
  return (
    <PageWrapper
      wide
      header={<Breadcrumbs links={[{ label: THEATRE_TITLE, url: THEATRE }]} />}
    >
      <Tabs defaultValue="theatres">
        <TabsList>
          <TabsTrigger value="theatres">Учреждения</TabsTrigger>
          <TabsTrigger value="brandbooks">Брэндбуки</TabsTrigger>
          <TabsTrigger value="templates">Шаблоны</TabsTrigger>
        </TabsList>
        <TabsContent value="theatres" className="mt-4">
          <TheatresTab />
        </TabsContent>
        <TabsContent value="brandbooks" className="mt-4">
          <BrandbooksTab />
        </TabsContent>
        <TabsContent value="templates" className="mt-4">
          <TemplatesTab />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

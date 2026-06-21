// Страница учреждений
// Активная вкладка хранится в хэше

import { useLocation, useNavigate, useSearchParams } from 'react-router';

import { THEATRE, THEATRE_TITLE } from '@/app/router/routes';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { EventsTab } from '@/features/events/pages/EventsTab';
import { TemplatesTab } from './TemplatesTab';
import { TheatresTab } from './TheatresTab';

const VALID_TABS = ['theatres', 'events', 'templates'] as const;
type TabValue = (typeof VALID_TABS)[number];

export const TheatrePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hash = location.hash.slice(1);
  const activeTab: TabValue = (VALID_TABS as readonly string[]).includes(hash)
    ? (hash as TabValue)
    : 'theatres';

  const theatreParam = searchParams.get('theatre');
  const selectedTheatreId = theatreParam ? Number(theatreParam) : undefined;

  const handleTabChange = (value: string) => {
    navigate(
      { pathname: location.pathname, search: location.search, hash: value },
      { replace: true },
    );
  };

  const handleTheatreChange = (id: number | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (id === undefined) {
      next.delete('theatre');
    } else {
      next.set('theatre', String(id));
    }
    navigate(
      {
        pathname: location.pathname,
        search: next.toString(),
        hash: location.hash,
      },
      { replace: true },
    );
  };

  return (
    <PageWrapper
      size="wide"
      header={<Breadcrumbs links={[{ label: THEATRE_TITLE, url: THEATRE }]} />}
    >
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full">
          <TabsTrigger value="theatres" className="flex-1">
            Учреждения
          </TabsTrigger>
          <TabsTrigger value="events" className="flex-1">
            Мероприятия
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex-1">
            Шаблоны
          </TabsTrigger>
        </TabsList>
        <TabsContent value="theatres" className="mt-4">
          <TheatresTab />
        </TabsContent>
        <TabsContent value="events" className="mt-4">
          <EventsTab />
        </TabsContent>
        <TabsContent value="templates" className="mt-4">
          <TemplatesTab
            selectedTheatreId={selectedTheatreId}
            onTheatreChange={handleTheatreChange}
          />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

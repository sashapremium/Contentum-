// Стартовая страница, открывается по "/" для авторизованных пользователей
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Button } from '@/components/ui/button';
import { HEADER_ITEMS } from '@/features/home/constants'; // список разделов навигации: иконка, заголовок, ссылка
import { Link } from 'react-router';

export const EntryPage = () => {
  return (
    <PageWrapper className="flex flex-col items-center justify-center min-h-screen px-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Добро пожаловать</h1>
      <p className="text-lg text-muted-foreground mb-6">Выберите действие</p>
      <div className="flex gap-4 flex-col lg:flex-row">
        {HEADER_ITEMS.map(({ title, Icon, url }) => (
          <Button key={title} asChild>
            <Link to={url}>
              <Icon />
              {title}
            </Link>
          </Button>
        ))}
      </div>
    </PageWrapper>
  );
};

import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-6">Страница не найдена</p>
      <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
    </div>
  );
}

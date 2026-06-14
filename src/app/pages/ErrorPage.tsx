// Показывается при необработанных ошибках роута (errorElement в react-router)
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <h1 className="text-3xl font-bold mb-4">Ошибка</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Произошла непредвиденная ошибка
      </p>
      <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
    </div>
  );
}

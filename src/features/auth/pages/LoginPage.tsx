import { Button } from '@/components/ui/button';
import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router';

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate('/');
  };

  return (
    <div className="p-4 text-xl flex flex-col gap-4">
      <div>Login Page</div>
      <Button
        className="px-4 py-2 bg-black text-white rounded"
        onClick={handleLogin}
      >
        Dummy Login
      </Button>
    </div>
  );
}

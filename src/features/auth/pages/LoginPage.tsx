import { LoginForm } from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-6">Авторизация</h1>
        <LoginForm />
      </div>
    </div>
  );
}

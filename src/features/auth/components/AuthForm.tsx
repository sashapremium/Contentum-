// Карточка с вкладками Вход и Регистрация
// После успешной регистрации автоматически переключается на вкладку входа
import { useState } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { LoginForm } from './LoginForm';
import { RegistrationForm } from './RegistrationForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSuccess } from '@/hooks/useToast';

export const AuthForm = () => {
  const [tab, setTab] = useState('login');
  const s = useSuccess();

  const handleSuccess = () => {
    setTab('login');
    s('Пользователь успешно зарегистрирован');
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="space-y-4 pb-4">
        <CardTitle className="text-2xl font-semibold text-center">
          Contentum
        </CardTitle>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        <Tabs value={tab}>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>

          <TabsContent value="register">
            <RegistrationForm onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

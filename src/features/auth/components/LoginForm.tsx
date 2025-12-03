import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginRequestSchema } from '../types/auth.types';
import { useLoginMutation } from '../queries/useLoginMutation';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { z } from 'zod';
import { InputPassword } from '@/components/shared/InputPassword';
import { mapApiError } from '@/lib/apiErrorMapper';
import { Error } from '@/components/shared/Error';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const LoginForm = () => {
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginRequestSchema>>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = (values: z.infer<typeof LoginRequestSchema>) => {
    loginMutation.mutate(values);
  };

  useEffect(() => {
    if (loginMutation.isSuccess) {
      navigate('/');
    }
  }, [loginMutation.isSuccess, navigate]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Электронная почта</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <InputPassword {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {loginMutation.isError && (
          <Error description={mapApiError(loginMutation.error)} />
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Вход...' : 'Войти'}
        </Button>
      </form>
    </Form>
  );
};

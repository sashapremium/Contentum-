import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginRequestSchema } from '../types/auth.types';
import { useLoginMutation } from '../hooks/useLoginMutation';

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
import { Alert, AlertTitle } from '@/components/ui/alert';
import { InputPassword } from '@/components/shared/InputPassword';
import { mapApiError } from '../utils/apiErrorMapper';

export const LoginForm = () => {
  const loginMutation = useLoginMutation();

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

        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Вход...' : 'Войти'}
        </Button>

        {loginMutation.isError && (
          <Alert variant="destructive">
            <AlertTitle>{mapApiError(loginMutation.error)}</AlertTitle>
          </Alert>
        )}
      </form>
    </Form>
  );
};

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { RegisterRequestSchema } from '../types/auth.types';
import { useRegisterMutation } from '../hooks/useRegisterMutation';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/shared/InputPassword';
import { Button } from '@/components/ui/button';
import { mapApiError } from '@/lib/apiErrorMapper';
import { Error } from '@/components/shared/Error';
import { useEffect } from 'react';

interface RegistrationFormProps {
  onSuccess: () => void;
}

export const RegistrationForm = ({ onSuccess }: RegistrationFormProps) => {
  const registerMutation = useRegisterMutation();

  const form = useForm<z.infer<typeof RegisterRequestSchema>>({
    resolver: zodResolver(RegisterRequestSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      passwordConfirm: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = (values: z.infer<typeof RegisterRequestSchema>) => {
    registerMutation.mutate(values);
  };

  useEffect(() => {
    if (registerMutation.isSuccess) {
      onSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerMutation.isSuccess]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full"
        noValidate
      >
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
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Полное имя</FormLabel>
              <FormControl>
                <Input {...field} placeholder="ФИО" />
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
                <InputPassword {...field} placeholder="Введите пароль" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Подтверждение пароля</FormLabel>
              <FormControl>
                <InputPassword {...field} placeholder="Повторите пароль" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {registerMutation.isError && (
          <Error description={mapApiError(registerMutation.error)} />
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </form>
    </Form>
  );
};

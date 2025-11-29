import { useState } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../ui/input-group';
import { Eye, EyeOff } from 'lucide-react';

interface InputPasswordProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const InputPassword = (props: InputPasswordProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <InputGroup>
      <InputGroupInput
        {...props}
        type={visible ? 'text' : 'password'}
        placeholder="Пароль"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          onClick={() => setVisible((p) => !p)}
          size="icon-xs"
          title={visible ? 'Скрыть пароль' : 'Показать пароль'}
          aria-label={visible ? 'Show password' : 'Hide password'}
        >
          {visible ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

import { useState } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../ui/input-group';
import { Eye, EyeOff } from 'lucide-react';

export const InputPassword = ({
  value,
  'aria-describedby': ad,
  'aria-invalid': ai,
  id,
  name,
  onBlur,
  onChange,
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  const [visible, setVisible] = useState(false);

  return (
    <InputGroup>
      <InputGroupInput
        value={value}
        aria-describedby={ad}
        aria-invalid={ai}
        id={id}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
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

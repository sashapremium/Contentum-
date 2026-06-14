// Тестовая страница для проверки динамической системы форм в изоляции от бэкенда
import { exampleForm } from '@/features/forms/exampleForm';
import { FormContainer } from '@/features/forms/components/FormContainer';

export default function TestFormsPage() {
  return (
    <div className="p-8">
      <FormContainer
        formStep={exampleForm}
        chatId="test-chat-id"
        onSubmit={(values) => {
          console.log('Submitted test form values', values);
        }}
      />
    </div>
  );
}

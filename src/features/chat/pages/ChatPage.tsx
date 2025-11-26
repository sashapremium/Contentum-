import { useParams } from 'react-router-dom';

export default function ChatPage() {
  const { chatId } = useParams();
  return <div className="p-4 text-xl">Chat Page – Chat ID: {chatId}</div>;
}

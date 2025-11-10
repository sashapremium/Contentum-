import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import InputBar from '../components/InputBar';
import { mainSteps, extraSteps } from '../data/promtSteps';
import '../App.css';

function ChatPage({ user, onLogout }) {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('user_chats');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentChat, setCurrentChat] = useState(null);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [extended, setExtended] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = extended ? [...mainSteps, ...extraSteps] : mainSteps;
  const currentStep = steps[stepIndex];
  const isFinished = stepIndex >= steps.length;

  useEffect(() => {
    localStorage.setItem('user_chats', JSON.stringify(chats));
  }, [chats]);

  const handleNewChat = () => {
    const startMsg = { from: 'bot', text: 'Давайте начнем. ' + mainSteps[0].prompt };
    const newChat = {
      title: `Диалог #${chats.length + 1}`,
      messages: [startMsg],
      answers: {},
    };
    const updated = [...chats, newChat];
    setChats(updated);
    setCurrentChat(newChat);
    setStepIndex(0);
    setAnswers({});
  };

  const handleImageUpload = (file) => {
    if (!currentChat) return;
    const imageMessage = {
      from: 'user',
      text: `📷 Изображение: ${file.name}`,
    };

    const updated = {
      ...currentChat,
      messages: [...currentChat.messages, imageMessage],
    };

    setChats(chats.map((c) => (c === currentChat ? updated : c)));
    setCurrentChat(updated);
  };

  // Отправка сообщения
  const handleSend = () => {
    if (!input.trim() || !currentChat) return;

    const field = currentStep?.field;
    const updatedAnswers = { ...answers, [field]: input };
    setAnswers(updatedAnswers);

    const userMsg = { from: 'user', text: input };
    const nextPrompt = steps[stepIndex + 1]?.prompt;

    let botMsg;
    if (nextPrompt) {
      botMsg = { from: 'bot', text: nextPrompt };
    } else {
      startGeneration(updatedAnswers);
    }

    const newTitle = field === 'event_name' ? input : currentChat.title;

    const updatedChat = {
      ...currentChat,
      title: newTitle,
      messages: [...currentChat.messages, userMsg, botMsg],
      answers: updatedAnswers,
    };

    setChats(chats.map((c) => (c.title === currentChat.title ? updatedChat : c)));
    setCurrentChat(updatedChat);
    setInput('');
    setStepIndex(stepIndex + 1);
  };

  //Имитация генерации контента
  const startGeneration = (answers) => {
    setIsGenerating(true);

    //  бот пишет точки по очереди
    let dots = 0;
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      const text = 'Начинаю создавать' + '.'.repeat(dots);
      setCurrentChat((prev) => ({
        ...prev,
        messages: [...prev.messages.slice(0, -1), { from: 'bot', text }],
      }));
    }, 500);

    // Через 3 секунды “готово”
    setTimeout(() => {
      clearInterval(interval);
      const summary = Object.entries(answers)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');

      const resultMsg = {
        from: 'bot',
        text: 'Генерация завершена!',
      };

      setCurrentChat((prev) => ({
        ...prev,
        messages: [...prev.messages, resultMsg],
      }));
      setIsGenerating(false);
    }, 3000);
  };

  const handleDeleteChat = (title) => {
    const filtered = chats.filter((chat) => chat.title !== title);
    setChats(filtered);
    if (currentChat?.title === title) setCurrentChat(null);
  };

  return (
    <div className="app-layout">
      <Sidebar
        chats={chats}
        onSelectChat={setCurrentChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        currentChat={currentChat}
        user={user}
      />

      <div className="chat-area">
        <nav className="navbar">
          <h1 className="nav-title">Contentum</h1>
          <div>
            <button className="logout-btn" onClick={onLogout}>
              Выйти
            </button>
          </div>
        </nav>

        {currentChat ? (
          <>
            <ChatWindow messages={currentChat.messages} />
            {!isFinished && (
              <InputBar
                value={input}
                onChange={setInput}
                onSend={handleSend}
                onImageUpload={handleImageUpload}
              />
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>Выберите диалог или начните новый</p>
            <button onClick={handleNewChat} className="create-first-btn">
              Начать диалог
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;

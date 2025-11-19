import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import InputBar from '../components/InputBar';
import { useNavigate } from 'react-router';
import { mainSteps, extraSteps } from '../data/promtSteps';
import {
  fetchChats,
  createChat,
  deleteChat,
  fetchChatMessages,
  sendMessageToChat,
} from '../api/chatService';
import { logoutUser } from '../api/authService';

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [extended, setExtended] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = extended ? [...mainSteps, ...extraSteps] : mainSteps;
  const currentStep = steps[stepIndex];
  const isFinished = stepIndex >= steps.length;

  const bottomRef = useRef(null);
  const navigate = useNavigate();

  // Автопрокрутка
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat]);

  // Первый запрос чатов
  useEffect(() => {
    loadChats();
  }, []);

  async function loadChats() {
    const res = await fetchChats();
    const list = res?.results || res?.data || [];
    setChats(list);
  }

  //---------------------------------------
  // Выбор чата
  //---------------------------------------
  async function handleSelectChat(chat) {
    setCurrentChat({ ...chat, messages: [] });

    const res = await fetchChatMessages(chat.id);
    const msgs = res?.results || res?.data || [];

    setCurrentChat((prev) => ({
      ...prev,
      messages: msgs,
    }));

    setStepIndex(0);
    setAnswers({});
  }

  //---------------------------------------
  // Новый чат
  async function handleNewChat() {
    const res = await createChat();

    console.log('CHAT CREATE RESPONSE:', res);

    if (!res?.data) return;

    const newChat = res.data;

    // ВАЖНО: после создания — загрузить системное сообщение
    const msgsRes = await fetchChatMessages(newChat.id);
    const msgs = msgsRes?.results || msgsRes?.data || [];

    // Устанавливаем новый чат с сообщениями
    const fullChat = {
      ...newChat,
      messages: msgs,
    };

    setChats((prev) => [...prev, fullChat]);
    setCurrentChat(fullChat);

    setStepIndex(0);
    setAnswers({});
  }

  //---------------------------------------
  // Удаление чата
  //---------------------------------------
  async function handleDeleteChat(title) {
    const found = chats.find((c) => c.title === title);
    if (!found) return;

    await deleteChat(found.id);

    setChats((prev) => prev.filter((c) => c.id !== found.id));

    if (currentChat?.id === found.id) {
      setCurrentChat(null);
    }
  }

  // Отправка сообщения
  async function handleSend() {
    if (!input.trim() || !currentChat) return;

    const field = currentStep?.field;
    const updatedAnswers = { ...answers, [field]: input };
    setAnswers(updatedAnswers);

    // 1. Отправка на сервер
    await sendMessageToChat(currentChat.id, input);

    // 2. Загрузка обновлённого списка сообщений
    const res = await fetchChatMessages(currentChat.id);
    const msgs = res?.results || res?.data || [];

    setCurrentChat((prev) => ({ ...prev, messages: msgs }));

    // 3. Переход на следующий шаг
    if (stepIndex + 1 < steps.length) {
      setStepIndex(stepIndex + 1);
    } else {
      startGeneration(updatedAnswers);
    }

    setInput('');
  }

  // Генерация (анимация)
  function startGeneration(answers) {
    setIsGenerating(true);

    let dots = 0;
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;

      setCurrentChat((prev) => ({
        ...prev,
        messages: [
          ...prev.messages.filter((m) => !m.temp),
          { from: 'bot', text: 'Создаю медиа' + '.'.repeat(dots), temp: true },
        ],
      }));
    }, 400);

    setTimeout(() => {
      clearInterval(interval);

      setCurrentChat((prev) => ({
        ...prev,
        messages: [...prev.messages.filter((m) => !m.temp), { from: 'bot', text: 'Готово 🔥' }],
      }));

      setIsGenerating(false);
    }, 3000);
  }

  // Загрузка изображения
  async function handleImageUpload(file) {
    if (!currentChat) return;

    await sendMessageToChat(currentChat.id, `📷 ${file.name}`);

    const res = await fetchChatMessages(currentChat.id);
    const msgs = res?.results || res?.data || [];

    setCurrentChat((prev) => ({ ...prev, messages: msgs }));
  }

  // Логаут
  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // Рендер
  return (
    <div className="app-layout">
      <Sidebar
        chats={chats}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        currentChat={currentChat}
        user={{ name: 'User' }}
      />

      <div className="chat-area">
        <nav className="navbar">
          <h1 className="nav-title">Contentum</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Выйти
          </button>
        </nav>

        {currentChat ? (
          <>
            <ChatWindow messages={currentChat.messages || []} bottomRef={bottomRef} />

            {!isFinished && !isGenerating && (
              <InputBar
                value={input}
                onChange={setInput}
                onSend={handleSend}
                onImageUpload={handleImageUpload}
              />
            )}

            {isGenerating && (
              <div className="empty-state">
                <p>Генерация...</p>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>Выберите чат или создайте новый</p>
            <button onClick={handleNewChat} className="create-first-btn">
              Новый чат
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;

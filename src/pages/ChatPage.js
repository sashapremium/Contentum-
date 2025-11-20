import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import InputBar from '../components/InputBar';
import { useNavigate } from 'react-router';
import {
  fetchChats,
  createChat,
  deleteChat,
  fetchChatMessages,
  sendMessageToChat,
} from '../api/chatService';
import { downloadImage } from '../api/imageService';
import { logoutUser } from '../api/authService';

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [id, setId] = useState('');

  const bottomRef = useRef(null);
  const navigate = useNavigate();

  // console.log(`${new Date().toUTCString()} CHAT STATE\n`, {
  //   currentChat,
  //   chats,
  // });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat]);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (!isGenerating) return;

    const intervalId = setInterval(async () => {
      const res = await fetchChatMessages(currentChat.id);
      const msgs = res?.results || res?.data || [];
      const lastMessage = msgs.at(-1);
      console.log('msgs2', lastMessage);
      setCurrentChat((prev) => ({ ...prev, messages: msgs }));

      if (lastMessage.content.startsWith('✅ Генерация завершена!')) {
        setIsGenerating(false);
        setIsReady(true);

        const links = lastMessage.content.split('\n');
        const downloadLink = links.at(-1);
        console.log('downloadLink', downloadLink, links);
        const imageId = downloadLink.split('/').at(5);
        console.log('imageId', imageId);
        setId(imageId);
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isGenerating, currentChat?.id]);

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
    const localInput = input;

    // 0. Отображение сообщения пользователя на фронте
    const initialMessages = [
      ...currentChat.messages,
      { id: 'local', content: localInput, messageType: 'USER' },
    ];

    setInput('');
    setCurrentChat((prev) => ({ ...prev, messages: initialMessages }));

    // 1. Отправка на сервер
    const sendMessageRes = await sendMessageToChat(currentChat.id, input);
    console.log('sendMessageRes', sendMessageRes);
    if (sendMessageRes.message.startsWith('Flow завершён')) {
      setIsGenerating(true);
    } else {
      // 2. Загрузка обновлённого списка сообщений
      const res = await fetchChatMessages(currentChat.id);
      const msgs = res?.results || res?.data || [];

      setCurrentChat((prev) => ({ ...prev, messages: msgs }));

      const lastMessage = msgs.at(-1);
      console.log('msgs2', lastMessage);
    }
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

  const handleDownloadImage = async () => {
    const res = await downloadImage(id);
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
            <div ref={bottomRef} className="chat-window">
              <ChatWindow messages={currentChat.messages || []} />
            </div>
            {!isGenerating && !isReady && (
              <InputBar
                value={input}
                onChange={setInput}
                onSend={handleSend}
                onImageUpload={handleImageUpload}
              />
            )}

            {isGenerating && !isReady && (
              <div className="empty-state">
                <p>Генерация...</p>
              </div>
            )}

            {!isGenerating && isReady && (
              <button className="option-btn" onClick={handleDownloadImage}>
                Открыть изображение
              </button>
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

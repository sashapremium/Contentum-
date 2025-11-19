import { API_URL } from './config';

// -----------------------------
// Получить все чаты
// -----------------------------
export async function fetchChats() {
  const token = localStorage.getItem('access_token');

  const res = await fetch(`${API_URL}/chats/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
}

// -----------------------------
// Создать новый чат
// -----------------------------
export async function createChat(title = 'Новый чат') {
  const token = localStorage.getItem('access_token');

  const res = await fetch(`${API_URL}/chats/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  return await res.json();
}

// -----------------------------
// Удалить чат
// (в твоём бэке — это deactivate)
// -----------------------------
export async function deleteChat(chatId) {
  const token = localStorage.getItem('access_token');

  const res = await fetch(`${API_URL}/chats/${chatId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.text();
}

// -----------------------------
// Получить сообщения чата
// /api/chats/{id}/messages/
// -----------------------------
export async function fetchChatMessages(chatId) {
  const token = localStorage.getItem('access_token');

  const res = await fetch(`${API_URL}/chats/${chatId}/messages/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
}

// -----------------------------
// Отправить сообщение
// POST /api/messages/
// -----------------------------
export async function sendMessageToChat(chatId, text) {
  const token = localStorage.getItem('access_token');

  const payload = {
    chat: chatId,
    content: text,
    messageType: 'USER',
  };

  const res = await fetch(`${API_URL}/messages/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
}

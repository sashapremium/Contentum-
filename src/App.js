import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

import LoginScreen from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './components/LoginPage';

// Компонент для защиты маршрутов
function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('fake_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('fake_user');
    localStorage.removeItem('user_chats');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Страница входа */}
        <Route path="/login" element={<LoginPage />} />

        {/* Страница регистрации */}
        <Route path="/register" element={<RegisterPage onRegister={setUser} />} />

        {/* Главная страница (чат) */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <ChatPage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Перенаправление для неизвестных маршрутов */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

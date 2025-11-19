import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './pages/ProtectedRoute';
import './App.css';

function App() {
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  return (
    <Router>
      <Routes>
        {/* Страница входа */}
        <Route path="/login" element={<LoginPage />} />

        {/* Страница регистрации */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Главная страница (требует авторизации) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* Любой неизвестный маршрут → на главную */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

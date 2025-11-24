import React, { useState } from 'react';
import { loginUser } from '../api/authService';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = await loginUser({ email, password });

    if (data.access) {
      // Записали токены
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      navigate('/');
    } else {
      setError(data.detail || 'Ошибка входа');
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-box">
        <h1>Вход</h1>
        <form onSubmit={handleLogin}>
          <input
            id="loginEmail"
            name="loginEmail"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            id="loginPassword"
            name="loginPassword"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit">Войти</button>
        </form>

        <p>
          Нет аккаунта? <Link to="/register">Регистрация</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

import React, { useState } from 'react';
import { registerUser } from '../api/authService';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await registerUser(form);

    if (data.status === 'success') {
      navigate('/login');
    } else {
      setError(data.detail || data.message || 'Ошибка регистрации');
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-box">
        <h1>Регистрация</h1>

        <form onSubmit={handleSubmit}>
          <input
            id="registerName"
            name="registerName"
            type="text"
            placeholder="Имя"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            id="registerEmail"
            name="registerEmail"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            name="registerPassword"
            id="registerPassword"
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            name="registerPasswordConfirm"
            id="registerPasswordConfirm"
            type="password"
            placeholder="Подтвердите пароль"
            value={form.passwordConfirm}
            onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value })}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit">Создать аккаунт</button>
        </form>

        <p>
          Уже зарегистрированы? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

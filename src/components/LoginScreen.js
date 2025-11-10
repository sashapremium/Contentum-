import React from 'react';
import '../styles/LoginScreen.css';

function LoginScreen({ onLogin }) {
  const handleFakeLogin = () => {
    const fakeUser = {
      name: 'Александра',
      email: 'alexandra@example.com',
      avatar: 'https://i.pravatar.cc/80?img=5',
    };
    localStorage.setItem('fake_user', JSON.stringify(fakeUser));
    onLogin(fakeUser);
  };

  return (
    <div className="login-screen">
      <div className="login-box">
        <h1>Contentor</h1>
        <p>Войдите, чтобы начать работу</p>
        <button className="login-btn" onClick={handleFakeLogin}>
          Войти, как Александра
        </button>
      </div>
    </div>
  );
}

export default LoginScreen;

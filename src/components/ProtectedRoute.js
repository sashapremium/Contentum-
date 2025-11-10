import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { refreshToken } from '../api/authService';

function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        setAuth(true);
      } else {
        const refreshed = await refreshToken();
        setAuth(!!refreshed);
      }
    };
    checkAuth();
  }, []);

  if (auth === null) return <div>Загрузка...</div>;
  return auth ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;

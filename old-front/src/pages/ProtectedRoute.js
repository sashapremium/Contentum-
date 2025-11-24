import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { refreshToken } from '../api/authService';

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);
  useEffect(() => {
    async function validate() {
      const access = localStorage.getItem('access_token');
      if (access) {
        setIsAuth(true);
        return;
      }

      const refreshed = await refreshToken();
      setIsAuth(!!refreshed);
    }

    validate();
  }, []);

  if (isAuth === null) return <div>Загрузка...</div>;

  return isAuth ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;

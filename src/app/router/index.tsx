import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LoginPage from '@/features/auth/pages/LoginPage';
import HomePage from '@/features/home/pages/HomePage';
import ChatPage from '@/features/chat/pages/ChatPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),

    children: [
      {
        index: true,
        element: <div className="text-lg">Welcome! Select a chat.</div>,
      },
      {
        path: 'chat/:chatId',
        element: <ChatPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

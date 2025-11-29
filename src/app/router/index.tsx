import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LoginPage from '@/features/auth/pages/LoginPage';
import HomePage from '@/features/home/pages/HomePage';
import ChatPage from '@/features/chat/pages/ChatPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import NotFoundPage from '../pages/NotFoundPage';
import ErrorPage from '../pages/ErrorPage';
import { CreateNewChat } from '@/features/home/components/CreateNewChat';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,

    children: [
      {
        index: true,
        element: <CreateNewChat />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'chat/:chatId',
        element: <ChatPage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

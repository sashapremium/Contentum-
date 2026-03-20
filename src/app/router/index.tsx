import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LoginPage from '@/features/auth/pages/LoginPage';
import HomePage from '@/features/home/pages/HomePage';
import ChatPage from '@/features/chat/pages/ChatPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import NotFoundPage from '../pages/NotFoundPage';
import ErrorPage from '../pages/ErrorPage';
import TestFormsPage from '../pages/TestForms';
import {
  GALLERY,
  PHOTO_CREATE,
  POST_CREATE,
  POST_DETAIL,
  THEATRE,
} from './routes';
import { GalleryPage } from '@/features/gallery/pages';
import { PhotoCreatePage } from '@/features/photo/pages/create';
import { TheatrePage } from '@/features/theatre/pages';
import { ChatCreatePage } from '@/features/chat/pages/create';

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
        path: POST_CREATE,
        element: <ChatCreatePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: POST_DETAIL,
        element: <ChatPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: PHOTO_CREATE,
        element: <PhotoCreatePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: GALLERY,
        element: <GalleryPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: THEATRE,
        element: <TheatrePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'testForms',
        element: <TestFormsPage />,
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

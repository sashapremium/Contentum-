// Router на базе react-router v6.
// Защищённые роуты вложены под "/" и обёрнуты в ProtectedRoute.
// Каждый роут имеет errorElement - страницу ошибки при сбое рендеринга.
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LoginPage from '@/features/auth/pages/LoginPage';
import HomePage from '@/features/home/pages/HomePage'; // корневой layout-компонент с навигацией, оборачивает все защищённые роуты
import ChatPage from '@/features/chat/pages/ChatPage';
import { MetricsPage } from '@/features/chat/pages/MetricsPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'; // перенаправляет на /login при отсутствии токена
import NotFoundPage from '../pages/NotFoundPage';
import ErrorPage from '../pages/ErrorPage';
import TestFormsPage from '../pages/TestForms'; // только для разработки
import {
  THEATRE_EVENT_CREATE,
  THEATRE_EVENT_DETAIL,
  GALLERY,
  PHOTO_CREATE,
  PHOTO_DETAIL,
  POST_CREATE,
  POST_DETAIL,
  POST_METRICS,
  THEATRE,
  THEATRE_CREATE,
  THEATRE_TEMPLATE_CREATE,
  THEATRE_TEMPLATE_DETAIL,
} from './routes';
import { GalleryPage } from '@/features/gallery/pages';
import { SessionCreatePage } from '@/features/photo/pages/create';
import { TheatrePage } from '@/features/theatre/pages';
import { ChatCreatePage } from '@/features/chat/pages/create';
import { EntryPage } from '../pages';
import { PhotoDetailPage } from '@/features/photo/pages/detail';
import { TemplateCreatePage } from '@/features/template/pages/create';
import { TemplateDetailPage } from '@/features/template/pages/detail';
import { TheatreCreatePage } from '@/features/theatre/pages/create';
import { EventCreatePage } from '@/features/events/pages/create';
import { EventDetailPage } from '@/features/events/pages/detail';

// Дерево роутов: публичные (/login, *) и защищённые (всё под "/")
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
        element: <EntryPage />,
        errorElement: <ErrorPage />,
      },
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
        path: POST_METRICS,
        element: <MetricsPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: PHOTO_CREATE,
        element: <SessionCreatePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: PHOTO_DETAIL,
        element: <PhotoDetailPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: GALLERY,
        element: <GalleryPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: THEATRE,
        children: [
          {
            index: true,
            element: <TheatrePage />,
            errorElement: <ErrorPage />,
          },
          {
            path: THEATRE_CREATE,
            element: <TheatreCreatePage />,
            errorElement: <ErrorPage />,
          },
          {
            path: THEATRE_TEMPLATE_CREATE,
            element: <TemplateCreatePage />,
            errorElement: <ErrorPage />,
          },
          {
            path: THEATRE_TEMPLATE_DETAIL,
            element: <TemplateDetailPage />,
            errorElement: <ErrorPage />,
          },
          {
            path: THEATRE_EVENT_CREATE,
            element: <EventCreatePage />,
            errorElement: <ErrorPage />,
          },
          {
            path: THEATRE_EVENT_DETAIL,
            element: <EventDetailPage />,
            errorElement: <ErrorPage />,
          },
        ],
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

// Root компонент роутера, монтируется в main.tsx
export function AppRouter() {
  return <RouterProvider router={router} />;
}

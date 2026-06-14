// Корневая страница для всех авторизованных роутов. Оборачивает Outlet в HomeLayout.

import { Outlet } from 'react-router-dom';
import { HomeLayout } from '../components/layout/HomeLayout';

export default function HomePage() {
  return (
    <HomeLayout>
      <Outlet />
    </HomeLayout>
  );
}

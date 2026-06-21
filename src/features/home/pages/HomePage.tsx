// Корневая страница для всех авторизованных роутов

import { Outlet } from 'react-router-dom';
import { HomeLayout } from '../components/layout/HomeLayout';

export default function HomePage() {
  return (
    <HomeLayout>
      <Outlet />
    </HomeLayout>
  );
}

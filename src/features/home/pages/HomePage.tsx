import { Outlet } from 'react-router-dom';
import { HomeLayout } from '../components/HomeLayout';

export default function HomePage() {
  return (
    <HomeLayout>
      <Outlet />
    </HomeLayout>
  );
}

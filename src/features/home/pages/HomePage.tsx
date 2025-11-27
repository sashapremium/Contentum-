import { Outlet } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="flex h-full">
      <aside className="w-64 border-r p-4">
        <div className="text-xl font-bold">Sidebar (Chat List)</div>
        <div className="mt-2 text-sm">This sidebar is always visible</div>
      </aside>

      <main className="flex-1 p-4">
        <div className="text-lg font-semibold mb-4">
          Home Layout — Visible on all chat pages
        </div>

        <Outlet />
      </main>
    </div>
  );
}

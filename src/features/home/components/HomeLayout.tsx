import type { ReactNode } from 'react';

export const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Sidebar</h2>
          <p className="text-sm text-muted-foreground">
            Здесь будет список чатов
          </p>
        </div>

        <nav className="flex flex-col gap-2 p-4 text-sm">
          <div className="p-2 rounded hover:bg-accent cursor-pointer">
            Чат 1
          </div>
          <div className="p-2 rounded hover:bg-accent cursor-pointer">
            Чат 2
          </div>
          <div className="p-2 rounded hover:bg-accent cursor-pointer">
            Чат 3
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b p-4 flex items-center justify-between bg-background">
          <h1 className="text-lg font-semibold">Заголовок</h1>

          <div className="flex items-center gap-3 text-sm">
            <button className="text-muted-foreground hover:text-foreground">
              Настройки
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              Выйти
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

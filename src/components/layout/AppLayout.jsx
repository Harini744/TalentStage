import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';
import ApiKeyDrawer from './ApiKeyDrawer';

/** Authenticated shell: sidebar (rail on desktop, drawer on mobile) + header + routed page. */
export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div className="min-h-screen bg-ink flex">
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 border-r border-line">
        <Sidebar />
      </aside>

      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex bg-ink/80 glass" onMouseDown={(e) => e.target === e.currentTarget && closeMobileNav()}>
          <div className="w-64 h-full border-r border-line animate-slide-up">
            <Sidebar onNavigate={closeMobileNav} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <HeaderBar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 pb-10">
          <Outlet />
        </main>
      </div>

      <ApiKeyDrawer />
    </div>
  );
}

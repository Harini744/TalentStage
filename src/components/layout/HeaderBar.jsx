import { useLocation } from 'react-router-dom';
import { LogOut, Menu, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAiSettings } from '@/context/AiSettingsContext';
import { getPageTitle } from '@/config/navigation';
import Button from '@/components/ui/Button';

export default function HeaderBar({ onMenuClick }) {
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const { openDrawer, apiKey } = useAiSettings();

  return (
    <header className="sticky top-0 z-40 bg-ink/80 glass border-b border-line px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button type="button" onClick={onMenuClick} aria-label="Open menu" className="md:hidden text-muted hover:text-fg">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-serif font-semibold tracking-wide">{getPageTitle(pathname)}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={openDrawer}
          className="flex items-center gap-2 px-3 py-1.5 bg-card border border-line hover:border-gold-500/50 rounded-lg text-sm text-gold-500 transition-all font-mono"
        >
          <Settings className="w-4 h-4" />
          <span>AI Key</span>
          <span className={`w-1.5 h-1.5 rounded-full ${apiKey ? 'bg-emerald-400' : 'bg-faint'}`} />
        </button>

        <Button variant="danger" onClick={signOut} className="hidden sm:inline-flex !text-sm">
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
      </div>
    </header>
  );
}

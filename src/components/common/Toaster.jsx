import { Sparkles, X } from 'lucide-react';

export default function Toaster({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="card border-l-4 border-l-gold-500 px-4 py-3 shadow-2xl flex items-center justify-between gap-4 pointer-events-auto animate-slide-up"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-500 shrink-0" />
            <span className="text-sm font-medium">{t.message}</span>
          </div>
          <button type="button" onClick={() => onDismiss(t.id)} aria-label="Dismiss" className="text-muted hover:text-fg">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

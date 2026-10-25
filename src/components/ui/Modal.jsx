import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

const SIZES = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };

/** Accessible-enough modal: closes on Escape and on backdrop click. */
export default function Modal({ open, onClose, title, size = 'md', children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn('card p-6 w-full space-y-4 max-h-[90vh] overflow-y-auto', SIZES[size])}
      >
        <div className="flex justify-between items-center border-b border-line pb-2">
          <h3 className="text-base font-serif font-bold text-gold-500">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted hover:text-fg">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

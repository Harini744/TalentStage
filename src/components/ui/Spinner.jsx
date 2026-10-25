import { Loader2 } from 'lucide-react';

export function Spinner({ className = 'w-5 h-5' }) {
  return <Loader2 className={`animate-spin text-gold-500 ${className}`} />;
}

export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-muted">
      <Spinner className="w-7 h-7" />
      <span className="text-xs font-mono">{label}</span>
    </div>
  );
}

export function FullScreenLoader() {
  return (
    <div className="min-h-screen bg-ink">
      <PageLoader />
    </div>
  );
}

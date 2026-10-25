import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/format';

/** Shows the user's photo, or their initials when they have none (no external placeholder service). */
export default function Avatar({ src, name, className = 'w-10 h-10' }) {
  if (src) {
    return <img src={src} alt={name ?? ''} className={cn('rounded-full object-cover shrink-0', className)} />;
  }
  return (
    <div
      aria-label={name}
      className={cn(
        'rounded-full shrink-0 bg-raised border border-line flex items-center justify-center font-serif font-semibold text-gold-500 text-xs',
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}

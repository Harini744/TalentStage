import { cn } from '@/utils/cn';

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('card p-8 text-center max-w-md mx-auto w-full', className)}>
      {Icon && <Icon className="w-8 h-8 text-faint mx-auto mb-2" />}
      {title && <h3 className="text-sm font-serif text-fg">{title}</h3>}
      {description && <p className="text-xs text-muted mt-1">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

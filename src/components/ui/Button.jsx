import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * variant: primary | secondary | outline | ghost | success | danger
 * size:    md (default) | sm
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  loading = false,
  disabled,
  type = 'button',
  className,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn('btn', `btn-${variant}`, size === 'sm' && 'btn-sm', block && 'btn-block', className)}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  );
}

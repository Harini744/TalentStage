import { cn } from '@/utils/cn';

/** tone: gold | success | danger | muted */
export default function Badge({ tone = 'gold', className, children }) {
  return <span className={cn('badge', `badge-${tone}`, className)}>{children}</span>;
}

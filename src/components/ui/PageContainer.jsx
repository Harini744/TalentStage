import { cn } from '@/utils/cn';

const WIDTHS = { md: 'max-w-3xl', lg: 'max-w-4xl', xl: 'max-w-5xl', '2xl': 'max-w-6xl' };

/** Standard page wrapper: centred column with consistent padding and spacing. */
export default function PageContainer({ width = 'xl', className, children }) {
  return <div className={cn('mx-auto p-6 space-y-6 animate-slide-up', WIDTHS[width], className)}>{children}</div>;
}

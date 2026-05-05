import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'outline' | 'secondary' | 'accent'
}

export function Badge({ className, variant = 'secondary', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-mono font-medium',
        variant === 'outline' && 'border border-accent text-accent bg-transparent',
        variant === 'secondary' && 'bg-surface text-text-muted',
        variant === 'accent' && 'bg-accent text-bg',
        className,
      )}
      {...props}
    />
  )
}

import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  asChild?: boolean
}

export function Button({ className, variant = 'primary', size = 'md', href, children, ...props }: ButtonProps) {
  const base = cn(
    'inline-flex items-center justify-center font-mono font-medium transition-colors rounded-md border',
    size === 'sm' && 'px-3 py-1.5 text-xs',
    size === 'md' && 'px-4 py-2 text-sm',
    size === 'lg' && 'px-6 py-3 text-sm',
    variant === 'primary' && 'bg-accent text-bg border-accent hover:bg-accent-dim hover:border-accent-dim',
    variant === 'secondary' && 'bg-transparent text-text border-surface hover:border-accent hover:text-accent',
    variant === 'ghost' && 'bg-transparent text-text-muted border-transparent hover:text-accent',
    className,
  )

  if (href) {
    const isExternal = href.startsWith('http')
    return (
      <Link
        href={href}
        className={base}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </Link>
    )
  }

  return <button className={base} {...props}>{children}</button>
}

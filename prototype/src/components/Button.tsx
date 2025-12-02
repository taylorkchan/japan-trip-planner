import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-active focus:ring-primary/50',
    secondary: 'bg-white border border-border-default text-text-primary hover:bg-surface-hover active:bg-surface-subtle focus:ring-border-focus',
    ghost: 'text-text-primary hover:bg-surface-hover active:bg-surface-subtle focus:ring-border-focus',
    danger: 'bg-feedback-error text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500/50'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-base h-10',
    lg: 'px-6 py-3 text-lg h-12'
  }

  const isDisabled = disabled || isLoading

  return (
    <motion.button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {children}
    </motion.button>
  )
}
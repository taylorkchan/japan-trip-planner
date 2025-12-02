import React from 'react'
import { cn } from '../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Input({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={cn(
          'w-full rounded-lg border px-3 py-2 text-base transition-colors',
          'bg-white text-text-primary placeholder:text-text-placeholder',
          'border-border-default hover:border-border-strong',
          'focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus/25',
          'disabled:bg-surface-subtle disabled:text-text-disabled disabled:cursor-not-allowed',
          error && 'border-feedback-error focus:border-feedback-error focus:ring-feedback-error/25',
          className
        )}
        {...props}
      />

      {error && (
        <p className="text-sm text-feedback-error">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-sm text-text-secondary">
          {helperText}
        </p>
      )}
    </div>
  )
}
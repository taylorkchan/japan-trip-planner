import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { cardHover } from '../lib/motion'

interface CardProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  hover?: boolean
}

export function Card({ children, onClick, className, hover = true }: CardProps) {
  const Component = onClick ? motion.button : motion.div

  return (
    <Component
      className={cn(
        'bg-white rounded-lg border border-border-default shadow-elevation-1',
        'transition-all duration-200',
        onClick && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-2',
        className
      )}
      onClick={onClick}
      {...(hover && onClick ? cardHover : {})}
    >
      {children}
    </Component>
  )
}
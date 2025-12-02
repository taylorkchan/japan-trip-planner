import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { modalBackdrop, modalContent } from '../lib/motion'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-modal">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/48"
            {...modalBackdrop}
            onClick={onClose}
          />

          {/* Modal content */}
          <div className="flex items-center justify-center min-h-full p-4">
            <motion.div
              className={`relative bg-white rounded-xl shadow-elevation-4 w-full ${sizeClasses[size]}`}
              {...modalContent}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-border-default">
                  <h2 className="text-h3-md font-semibold text-text-primary">
                    {title}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="p-2"
                  >
                    <X className="w-4 h-4" />
                    <span className="sr-only">Close modal</span>
                  </Button>
                </div>
              )}

              {/* Body */}
              <div className={title ? 'p-6' : 'p-6'}>
                {children}
              </div>

              {/* Close button for modals without title */}
              {!title && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2"
                >
                  <X className="w-4 h-4" />
                  <span className="sr-only">Close modal</span>
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
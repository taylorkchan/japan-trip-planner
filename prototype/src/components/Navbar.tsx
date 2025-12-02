import React from 'react'
import { motion } from 'framer-motion'
import { Map, Calendar, Camera, LayoutList, Settings } from 'lucide-react'
import type { ViewType } from '../lib/types'
import { cn } from '../lib/utils'

interface NavbarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

export function Navbar({ currentView, onViewChange }: NavbarProps) {
  const navItems = [
    { id: 'preferences' as ViewType, label: 'Plan Trip', icon: Settings },
    { id: 'itinerary' as ViewType, label: 'Itinerary', icon: LayoutList },
    { id: 'gallery' as ViewType, label: 'Gallery', icon: Camera },
    { id: 'map' as ViewType, label: 'Map', icon: Map },
    { id: 'timeline' as ViewType, label: 'Timeline', icon: Calendar },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-sticky bg-white/95 backdrop-blur-sm border-b border-border-default">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🗾</span>
            </div>
            <span className="font-bold text-xl text-text-primary">
              Japan Trip Planner
            </span>
          </div>

          {/* Navigation items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              const isDisabled = item.id !== 'preferences' && currentView === 'preferences'

              return (
                <button
                  key={item.id}
                  onClick={() => !isDisabled && onViewChange(item.id)}
                  disabled={isDisabled}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-2',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : isDisabled
                      ? 'text-text-disabled cursor-not-allowed'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>

                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-primary/10 rounded-lg"
                      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Mobile navigation */}
          <div className="md:hidden">
            <select
              value={currentView}
              onChange={(e) => onViewChange(e.target.value as ViewType)}
              className="bg-white border border-border-default rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-border-focus"
            >
              {navItems.map((item) => (
                <option key={item.id} value={item.id} disabled={item.id !== 'preferences' && currentView === 'preferences'}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  )
}
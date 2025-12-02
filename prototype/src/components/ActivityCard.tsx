import React from 'react'
import { motion } from 'framer-motion'
import { Star, Clock, MapPin, X } from 'lucide-react'
import { Card } from './Card'
import { Button } from './Button'
import type { Activity } from '../lib/types'
import { formatCurrency, formatDuration, getActivityColor } from '../lib/utils'

interface ActivityCardProps {
  activity: Activity
  onEdit?: (activity: Activity) => void
  onRemove?: (activityId: string) => void
  onImageClick?: (activity: Activity) => void
  draggable?: boolean
}

export function ActivityCard({
  activity,
  onEdit,
  onRemove,
  onImageClick,
  draggable = false
}: ActivityCardProps) {
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onImageClick?.(activity)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove?.(activity.id)
  }

  return (
    <Card
      onClick={() => onEdit?.(activity)}
      className="overflow-hidden group relative"
      hover={!!onEdit}
    >
      {/* Remove button */}
      {onRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-full p-1.5"
        >
          <X className="w-4 h-4 text-feedback-error" />
          <span className="sr-only">Remove activity</span>
        </Button>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] bg-surface-subtle overflow-hidden">
        <img
          src={activity.images[0]}
          alt={activity.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
          loading="lazy"
          onClick={handleImageClick}
        />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getActivityColor(activity.category)}`}>
            {activity.category}
          </span>
        </div>

        {/* Price badge */}
        {activity.price > 0 && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1">
            <span className="text-sm font-semibold text-text-primary">
              {formatCurrency(activity.price)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-text-primary text-lg line-clamp-1">
            {activity.title}
          </h3>
          <p className="text-text-secondary text-sm mt-1 line-clamp-2">
            {activity.description}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{activity.rating}</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(activity.duration)}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{activity.location.name}</span>
        </div>

        {/* Tips preview */}
        {activity.tips.length > 0 && (
          <div className="pt-2 border-t border-border-default">
            <p className="text-xs text-text-secondary italic">
              💡 {activity.tips[0]}
            </p>
          </div>
        )}
      </div>

      {/* Drag handle for reordering */}
      {draggable && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-1 h-8 bg-border-strong rounded-full cursor-grab active:cursor-grabbing" />
        </div>
      )}
    </Card>
  )
}
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Plus, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from './Card'
import { Button } from './Button'
import { ActivityCard } from './ActivityCard'
import type { ItineraryData, Activity } from '../lib/types'
import { activityCatalog } from '../lib/data'
import { formatDuration, getActivityColor } from '../lib/utils'
import { staggerContainer, staggerChild } from '../lib/motion'

interface ScheduleTimelineViewProps {
  itinerary: ItineraryData
  onItineraryUpdate: (itinerary: ItineraryData) => void
}

export function ScheduleTimelineView({ itinerary, onItineraryUpdate }: ScheduleTimelineViewProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const [showActivityCatalog, setShowActivityCatalog] = useState(false)

  const generateTimelineForDay = (dayActivities: Activity[]) => {
    let currentTime = 9 * 60 // Start at 9:00 AM (in minutes)

    return dayActivities.map((activity, index) => {
      const startTime = currentTime
      const endTime = currentTime + activity.duration
      const timeSlot = {
        activity,
        startTime: formatMinutesToTime(startTime),
        endTime: formatMinutesToTime(endTime),
        index
      }

      // Add travel time between activities (15 minutes)
      currentTime = endTime + (index < dayActivities.length - 1 ? 15 : 0)

      return timeSlot
    })
  }

  const formatMinutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours

    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
  }

  const handleAddActivityToDay = (activity: Activity, dayNumber: number) => {
    const updatedItinerary = {
      ...itinerary,
      days: itinerary.days.map(day =>
        day.day === dayNumber
          ? { ...day, activities: [...day.activities, activity] }
          : day
      )
    }

    onItineraryUpdate(updatedItinerary)
  }

  const handleRemoveActivity = (activityId: string, dayNumber: number) => {
    const updatedItinerary = {
      ...itinerary,
      days: itinerary.days.map(day =>
        day.day === dayNumber
          ? { ...day, activities: day.activities.filter(a => a.id !== activityId) }
          : day
      )
    }

    onItineraryUpdate(updatedItinerary)
  }

  return (
    <div className="min-h-screen bg-surface-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={staggerChild} className="text-center space-y-4">
            <h1 className="text-h1-lg font-bold text-text-primary">
              Schedule Timeline
            </h1>
            <p className="text-lg text-text-secondary">
              View your daily schedules and optimize your time
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Timeline */}
            <motion.div variants={staggerChild} className="lg:col-span-3 space-y-6">
              {itinerary.days.map((day, dayIndex) => {
                const timeline = generateTimelineForDay(day.activities)
                const totalDuration = day.activities.reduce((total, activity) => total + activity.duration, 0)
                const isExpanded = expandedDay === day.day

                return (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: dayIndex * 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      {/* Day Header */}
                      <button
                        onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                        className="w-full p-6 text-left hover:bg-surface-hover transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-h2-md font-semibold text-text-primary">
                              Day {day.day}
                            </h2>
                            <p className="text-text-secondary mt-1">
                              {new Intl.DateTimeFormat('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                              }).format(day.date)}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right text-sm">
                              <div className="text-text-secondary">
                                {day.activities.length} activities
                              </div>
                              <div className="text-text-primary font-medium">
                                {formatDuration(totalDuration)}
                              </div>
                            </div>

                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-5 h-5 text-text-secondary" />
                            </motion.div>
                          </div>
                        </div>
                      </button>

                      {/* Timeline Content */}
                      <motion.div
                        initial={false}
                        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          {day.activities.length === 0 ? (
                            <div className="text-center py-8 text-text-secondary">
                              <Clock className="w-8 h-8 mx-auto mb-3 opacity-50" />
                              <p>No activities planned</p>
                              <p className="text-sm">Drag activities from the catalog to start planning</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {/* Timeline visualization */}
                              <div className="bg-surface-subtle rounded-lg p-4">
                                <h3 className="font-medium text-text-primary mb-3">
                                  Daily Schedule
                                </h3>
                                <div className="space-y-3">
                                  {timeline.map((slot, index) => (
                                    <div key={slot.activity.id} className="flex items-center gap-4">
                                      {/* Time */}
                                      <div className="text-sm text-text-secondary min-w-0 flex-shrink-0 w-24">
                                        {slot.startTime}
                                      </div>

                                      {/* Activity */}
                                      <div className="flex-1 flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${getActivityColor(slot.activity.category).split(' ')[0]}`} />
                                        <span className="font-medium text-text-primary truncate">
                                          {slot.activity.title}
                                        </span>
                                        <span className="text-sm text-text-secondary">
                                          ({formatDuration(slot.activity.duration)})
                                        </span>
                                      </div>

                                      {/* Remove button */}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveActivity(slot.activity.id, day.day)}
                                        className="opacity-0 group-hover:opacity-100 text-feedback-error"
                                      >
                                        ×
                                      </Button>
                                    </div>
                                  ))}

                                  {/* End time */}
                                  {timeline.length > 0 && (
                                    <div className="flex items-center gap-4 pt-2 border-t border-border-default">
                                      <div className="text-sm text-text-secondary w-24">
                                        {timeline[timeline.length - 1].endTime}
                                      </div>
                                      <div className="text-sm text-text-secondary italic">
                                        Day complete
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Activity cards */}
                              <div className="grid md:grid-cols-2 gap-4">
                                {day.activities.map((activity) => (
                                  <ActivityCard
                                    key={activity.id}
                                    activity={activity}
                                    onRemove={(activityId) => handleRemoveActivity(activityId, day.day)}
                                    draggable
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Activity Catalog Sidebar */}
            <motion.div variants={staggerChild} className="lg:col-span-1 space-y-6">
              <Card className="p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Plus className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-text-primary">Activity Catalog</h3>
                </div>

                <p className="text-sm text-text-secondary mb-6">
                  Browse activities by category and add them to your days.
                </p>

                <div className="space-y-6">
                  {Object.entries(activityCatalog).map(([category, activities]) => {
                    if (activities.length === 0) return null

                    return (
                      <div key={category}>
                        <h4 className="font-medium text-text-primary mb-3 capitalize">
                          {category}
                        </h4>
                        <div className="space-y-3">
                          {activities.slice(0, 3).map((activity) => (
                            <div
                              key={activity.id}
                              className="group relative p-3 rounded-lg border border-border-default hover:border-border-strong transition-colors cursor-pointer"
                            >
                              <div className="flex gap-3">
                                <img
                                  src={activity.images[0]}
                                  alt={activity.title}
                                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-sm text-text-primary truncate">
                                    {activity.title}
                                  </h5>
                                  <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                                    {activity.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2 text-xs text-text-secondary">
                                    <span>{formatDuration(activity.duration)}</span>
                                    <span>•</span>
                                    <span>⭐ {activity.rating}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Add to day buttons */}
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex flex-col gap-1">
                                  {itinerary.days.slice(0, 3).map((day) => (
                                    <Button
                                      key={day.day}
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => handleAddActivityToDay(activity, day.day)}
                                      className="text-xs px-2 py-1 h-6 bg-white/90 backdrop-blur-sm"
                                    >
                                      Day {day.day}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {activities.length > 3 && (
                          <button className="text-xs text-primary hover:text-primary-hover mt-2">
                            View all {activities.length} {category} activities
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
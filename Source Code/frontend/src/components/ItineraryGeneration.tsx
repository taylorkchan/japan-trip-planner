import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Camera, Clock, Plus, Save, Undo, AlertCircle, Check } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from './Button'
import { Card } from './Card'
import { Modal } from './Modal'
import { ActivityCard } from './ActivityCard'
import type { TripPreferences, ItineraryData, Activity, ViewType } from '../lib/types'
import { generateMockItinerary, activityCatalog } from '../lib/data'
import { formatDate, formatCurrency, calculateTripDuration } from '../lib/utils'
import { staggerContainer, staggerChild } from '../lib/motion'

interface ItineraryGenerationProps {
  preferences: TripPreferences | null
  onItineraryGenerated: (itinerary: ItineraryData) => void
  onViewChange: (view: ViewType) => void
}

// Sortable Activity Card Component
function SortableActivityCard({
  activity,
  dayNumber,
  onRemove,
  onImageClick
}: {
  activity: Activity
  dayNumber: number
  onRemove: (activityId: string, dayNumber: number) => void
  onImageClick?: (activity: Activity) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: `${dayNumber}-${activity.id}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ActivityCard
        activity={activity}
        onRemove={(activityId) => onRemove(activityId, dayNumber)}
        onImageClick={onImageClick}
        draggable
      />
    </div>
  )
}

export function ItineraryGeneration({ preferences, onItineraryGenerated, onViewChange }: ItineraryGenerationProps) {
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null)
  const [isGenerating, setIsGenerating] = useState(true)
  const [showActivityCatalog, setShowActivityCatalog] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false)
  const [activityToRemove, setActivityToRemove] = useState<{id: string, day: number, name: string} | null>(null)
  const [itineraryHistory, setItineraryHistory] = useState<ItineraryData[]>([])
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  // Setup drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (!preferences) return

    const generateItinerary = async () => {
      setIsGenerating(true)
      // Simulate generation time
      await new Promise(resolve => setTimeout(resolve, 3000))

      const newItinerary = generateMockItinerary(preferences)
      setItinerary(newItinerary)
      setItineraryHistory([newItinerary])
      setIsGenerating(false)
      onItineraryGenerated(newItinerary)
    }

    generateItinerary()
  }, [preferences])

  // Auto-save effect
  useEffect(() => {
    if (!itinerary) return

    const autoSave = async () => {
      setAutoSaveStatus('saving')
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAutoSaveStatus('saved')
      setTimeout(() => setAutoSaveStatus('idle'), 2000)
    }

    const timer = setTimeout(autoSave, 500)
    return () => clearTimeout(timer)
  }, [itinerary])

  const saveToHistory = (newItinerary: ItineraryData) => {
    setItineraryHistory(prev => [...prev.slice(-9), newItinerary])
  }

  const handleAddActivity = (activity: Activity, dayNumber: number) => {
    if (!itinerary) return

    const updatedItinerary = {
      ...itinerary,
      days: itinerary.days.map(day =>
        day.day === dayNumber
          ? { ...day, activities: [...day.activities, activity] }
          : day
      )
    }

    saveToHistory(itinerary)
    setItinerary(updatedItinerary)
    onItineraryGenerated(updatedItinerary)
    setShowActivityCatalog(false)
    setSelectedDay(null)
  }

  const handleRemoveActivityConfirm = (activityId: string, dayNumber: number) => {
    if (!itinerary) return

    const activity = itinerary.days
      .find(day => day.day === dayNumber)
      ?.activities.find(a => a.id === activityId)

    if (activity) {
      setActivityToRemove({ id: activityId, day: dayNumber, name: activity.title })
      setShowRemoveConfirmation(true)
    }
  }

  const handleRemoveActivity = () => {
    if (!itinerary || !activityToRemove) return

    saveToHistory(itinerary)

    const updatedItinerary = {
      ...itinerary,
      days: itinerary.days.map(day =>
        day.day === activityToRemove.day
          ? { ...day, activities: day.activities.filter(a => a.id !== activityToRemove.id) }
          : day
      )
    }

    setItinerary(updatedItinerary)
    onItineraryGenerated(updatedItinerary)
    setShowRemoveConfirmation(false)
    setActivityToRemove(null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !itinerary) return

    const [activeDayStr, activeIdStr] = active.id.toString().split('-')
    const [overDayStr, overIdStr] = over.id.toString().split('-')

    const activeDay = parseInt(activeDayStr)
    const overDay = parseInt(overDayStr)

    if (activeDay === overDay) {
      // Same day reordering
      const dayData = itinerary.days.find(day => day.day === activeDay)
      if (!dayData) return

      const oldIndex = dayData.activities.findIndex(a => a.id === activeIdStr)
      const newIndex = dayData.activities.findIndex(a => a.id === overIdStr)

      if (oldIndex !== newIndex) {
        saveToHistory(itinerary)
        const updatedActivities = arrayMove(dayData.activities, oldIndex, newIndex)

        const updatedItinerary = {
          ...itinerary,
          days: itinerary.days.map(day =>
            day.day === activeDay
              ? { ...day, activities: updatedActivities }
              : day
          )
        }

        setItinerary(updatedItinerary)
        onItineraryGenerated(updatedItinerary)
      }
    } else {
      // Move between days
      const sourceDayData = itinerary.days.find(day => day.day === activeDay)
      const targetDayData = itinerary.days.find(day => day.day === overDay)

      if (!sourceDayData || !targetDayData) return

      const activityToMove = sourceDayData.activities.find(a => a.id === activeIdStr)
      if (!activityToMove) return

      saveToHistory(itinerary)

      const updatedItinerary = {
        ...itinerary,
        days: itinerary.days.map(day => {
          if (day.day === activeDay) {
            return { ...day, activities: day.activities.filter(a => a.id !== activeIdStr) }
          } else if (day.day === overDay) {
            return { ...day, activities: [...day.activities, activityToMove] }
          }
          return day
        })
      }

      setItinerary(updatedItinerary)
      onItineraryGenerated(updatedItinerary)
    }
  }

  const handleUndo = () => {
    if (itineraryHistory.length > 1) {
      const previousItinerary = itineraryHistory[itineraryHistory.length - 2]
      setItinerary(previousItinerary)
      setItineraryHistory(prev => prev.slice(0, -1))
      onItineraryGenerated(previousItinerary)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    // Could save to local storage or send to backend
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Calendar className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <div>
            <h2 className="text-h2-md font-semibold text-text-primary mb-2">
              Creating Your Perfect Itinerary
            </h2>
            <p className="text-text-secondary">
              Analyzing your preferences and finding the best activities...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!itinerary) return null

  const tripDuration = calculateTripDuration(itinerary.preferences.startDate, itinerary.preferences.endDate)

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
              Your Japan Itinerary
            </h1>
            <p className="text-lg text-text-secondary">
              {formatDate(itinerary.preferences.startDate)} - {formatDate(itinerary.preferences.endDate)} • {tripDuration} days
            </p>
          </motion.div>

          {/* Action bar */}
          <motion.div
            variants={staggerChild}
            className="flex flex-wrap gap-4 items-center justify-between bg-white rounded-lg p-4 border border-border-default"
          >
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => onViewChange('gallery')}
                className="gap-2"
              >
                <Camera className="w-4 h-4" />
                View Gallery
              </Button>
              <Button
                variant="secondary"
                onClick={() => onViewChange('map')}
                className="gap-2"
              >
                <MapPin className="w-4 h-4" />
                Map View
              </Button>
              <Button
                variant="secondary"
                onClick={() => onViewChange('timeline')}
                className="gap-2"
              >
                <Clock className="w-4 h-4" />
                Timeline
              </Button>
            </div>

            <div className="flex gap-2 items-center">
              {/* Auto-save status */}
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                {autoSaveStatus === 'saving' && (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Save className="w-4 h-4" />
                    </motion.div>
                    <span>Saving...</span>
                  </>
                )}
                {autoSaveStatus === 'saved' && (
                  <>
                    <Check className="w-4 h-4 text-feedback-success" />
                    <span>Saved</span>
                  </>
                )}
                <span>
                  Estimated cost: <span className="font-semibold">{formatCurrency(itinerary.totalEstimatedCost)}</span>
                </span>
              </div>

              {/* Undo button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={itineraryHistory.length <= 1}
                className="gap-2"
              >
                <Undo className="w-4 h-4" />
                Undo
              </Button>

              <Button
                onClick={handleSave}
                isLoading={isSaving}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Save Itinerary
              </Button>
            </div>
          </motion.div>

          {/* Daily itineraries */}
          <motion.div variants={staggerChild} className="space-y-8">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <AnimatePresence>
                {itinerary.days.map((day) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: day.day * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-h2-md font-semibold">
                            Day {day.day}
                          </h2>
                          <p className="text-text-secondary">
                            {formatDate(day.date)}
                          </p>
                        </div>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedDay(day.day)
                            setShowActivityCatalog(true)
                          }}
                          className="gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Activity
                        </Button>
                      </div>

                      {day.activities.length === 0 ? (
                        <div className="text-center py-12 text-text-secondary">
                          <Calendar className="w-8 h-8 mx-auto mb-3 opacity-50" />
                          <p>No activities planned for this day</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedDay(day.day)
                              setShowActivityCatalog(true)
                            }}
                            className="mt-2"
                          >
                            Add your first activity
                          </Button>
                        </div>
                      ) : (
                        <SortableContext
                          items={day.activities.map(activity => `${day.day}-${activity.id}`)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {day.activities.map((activity) => (
                              <SortableActivityCard
                                key={activity.id}
                                activity={activity}
                                dayNumber={day.day}
                                onRemove={handleRemoveActivityConfirm}
                                onImageClick={(activity) => {
                                  // Could open activity details modal
                                }}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </DndContext>
          </motion.div>
        </motion.div>
      </div>

      {/* Activity Catalog Modal */}
      <Modal
        isOpen={showActivityCatalog}
        onClose={() => {
          setShowActivityCatalog(false)
          setSelectedDay(null)
        }}
        title="Add Activity"
        size="xl"
      >
        <div className="space-y-6">
          <p className="text-text-secondary">
            Choose activities to add to Day {selectedDay}
          </p>

          {Object.entries(activityCatalog).map(([category, activities]) => {
            if (activities.length === 0) return null

            return (
              <div key={category}>
                <h3 className="text-lg font-semibold text-text-primary mb-4 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="relative">
                      <ActivityCard
                        activity={activity}
                      />
                      <Button
                        size="sm"
                        onClick={() => selectedDay && handleAddActivity(activity, selectedDay)}
                        className="absolute top-2 right-2"
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Modal>

      {/* Confirmation Dialog for Activity Removal */}
      <Modal
        isOpen={showRemoveConfirmation}
        onClose={() => {
          setShowRemoveConfirmation(false)
          setActivityToRemove(null)
        }}
        title="Remove Activity"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-feedback-error/10 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-feedback-error" />
            </div>
            <div>
              <p className="font-medium text-text-primary">
                Remove "{activityToRemove?.name}" from your itinerary?
              </p>
              <p className="text-sm text-text-secondary mt-1">
                This action can be undone using the undo button.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowRemoveConfirmation(false)
                setActivityToRemove(null)
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRemoveActivity}
              className="flex-1 bg-feedback-error hover:bg-feedback-error/90"
            >
              Remove
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
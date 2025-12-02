import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Camera, Clock, Plus, Save } from 'lucide-react'
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

export function ItineraryGeneration({ preferences, onItineraryGenerated, onViewChange }: ItineraryGenerationProps) {
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null)
  const [isGenerating, setIsGenerating] = useState(true)
  const [showActivityCatalog, setShowActivityCatalog] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!preferences) return

    const generateItinerary = async () => {
      setIsGenerating(true)
      // Simulate generation time
      await new Promise(resolve => setTimeout(resolve, 3000))

      const newItinerary = generateMockItinerary(preferences)
      setItinerary(newItinerary)
      setIsGenerating(false)
      onItineraryGenerated(newItinerary)
    }

    generateItinerary()
  }, [preferences, onItineraryGenerated])

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

    setItinerary(updatedItinerary)
    onItineraryGenerated(updatedItinerary)
    setShowActivityCatalog(false)
    setSelectedDay(null)
  }

  const handleRemoveActivity = (activityId: string, dayNumber: number) => {
    if (!itinerary) return

    const updatedItinerary = {
      ...itinerary,
      days: itinerary.days.map(day =>
        day.day === dayNumber
          ? { ...day, activities: day.activities.filter(a => a.id !== activityId) }
          : day
      )
    }

    setItinerary(updatedItinerary)
    onItineraryGenerated(updatedItinerary)
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
              <span className="text-sm text-text-secondary">
                Estimated cost: <span className="font-semibold">{formatCurrency(itinerary.totalEstimatedCost)}</span>
              </span>
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
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {day.activities.map((activity) => (
                          <ActivityCard
                            key={activity.id}
                            activity={activity}
                            onRemove={(activityId) => handleRemoveActivity(activityId, day.day)}
                            onImageClick={(activity) => {
                              // Could open activity details modal
                            }}
                            draggable
                          />
                        ))}
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
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
    </div>
  )
}
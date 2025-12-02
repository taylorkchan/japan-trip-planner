import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, CheckSquare, ArrowRight } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { Card } from './Card'
import type { TripPreferences, ActivityType } from '../lib/types'
import { staggerContainer, staggerChild } from '../lib/motion'

interface TripPreferencesFormProps {
  onSubmit: (preferences: TripPreferences) => void
}

const activityOptions: { id: ActivityType; label: string; description: string }[] = [
  { id: 'temples', label: 'Temples & Shrines', description: 'Traditional Buddhist temples and Shinto shrines' },
  { id: 'food', label: 'Food Experiences', description: 'Local cuisine, markets, and dining experiences' },
  { id: 'culture', label: 'Cultural Activities', description: 'Tea ceremonies, traditional arts, and workshops' },
  { id: 'nature', label: 'Nature & Parks', description: 'Gardens, bamboo groves, and natural scenery' },
  { id: 'shopping', label: 'Shopping Districts', description: 'Fashion, electronics, and souvenir shopping' },
  { id: 'nightlife', label: 'Nightlife & Entertainment', description: 'Bars, clubs, and evening entertainment' },
  { id: 'museums', label: 'Museums & Galleries', description: 'Art museums, cultural centers, and exhibitions' },
  { id: 'entertainment', label: 'Entertainment Shows', description: 'Traditional performances and modern shows' },
]

export function TripPreferencesForm({ onSubmit }: TripPreferencesFormProps) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    travelers: 2,
    activities: [] as ActivityType[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleActivityToggle = (activityId: ActivityType) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activityId)
        ? prev.activities.filter(id => id !== activityId)
        : [...prev.activities, activityId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 2000))

    const preferences: TripPreferences = {
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      travelers: formData.travelers,
      activities: formData.activities
    }

    onSubmit(preferences)
    setIsSubmitting(false)
  }

  const isFormValid = formData.startDate && formData.endDate && formData.activities.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={staggerChild} className="text-center space-y-4">
            <h1 className="text-display-md font-bold text-text-primary">
              Plan Your Perfect Japan Trip
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Tell us about your travel preferences and we'll create a personalized itinerary
              filled with amazing experiences across Japan.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={staggerChild}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <Card className="p-8">
              {/* Trip Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="text-h2-md font-semibold">Trip Details</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    type="date"
                    label="Start Date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />

                  <Input
                    type="date"
                    label="End Date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    min={formData.startDate}
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Number of Travelers
                    </label>
                    <select
                      value={formData.travelers}
                      onChange={(e) => setFormData(prev => ({ ...prev, travelers: parseInt(e.target.value) }))}
                      className="w-full rounded-lg border border-border-default px-3 py-2 bg-white focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus/25"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'traveler' : 'travelers'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Activity Preferences */}
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <CheckSquare className="w-5 h-5 text-primary" />
                  <h2 className="text-h2-md font-semibold">What interests you?</h2>
                </div>

                <p className="text-text-secondary">
                  Select all activities that appeal to you. We'll use these to customize your itinerary.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {activityOptions.map((option) => {
                    const isSelected = formData.activities.includes(option.id)

                    return (
                      <motion.button
                        key={option.id}
                        type="button"
                        onClick={() => handleActivityToggle(option.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all hover:scale-105 ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border-default hover:border-border-strong'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                            isSelected ? 'border-primary bg-primary' : 'border-border-default'
                          }`}>
                            {isSelected && (
                              <CheckSquare className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{option.label}</h3>
                            <p className="text-sm text-text-secondary">{option.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                {formData.activities.length === 0 && (
                  <p className="text-sm text-feedback-warning">
                    Please select at least one activity to continue.
                  </p>
                )}
              </div>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                disabled={!isFormValid}
                isLoading={isSubmitting}
                className="px-8"
              >
                {isSubmitting ? 'Creating Your Itinerary...' : (
                  <>
                    Plan My Trip
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}
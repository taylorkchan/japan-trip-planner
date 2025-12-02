import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, CheckSquare, ArrowRight, DollarSign, Clock, Accessibility } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { Card } from './Card'
import type { TripPreferences, ActivityType } from '../lib/types'
import { staggerContainer, staggerChild } from '../lib/motion'
import { useTripPlanningStore, useFormValidation } from '../lib/store'
import { tripApi, type CreateTripRequest } from '../lib/api'

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

const budgetOptions = [
  { value: 'budget' as const, label: 'Budget', description: 'Under ¥10,000/day • Hostels, street food, public transport' },
  { value: 'mid-range' as const, label: 'Mid-Range', description: '¥10,000-25,000/day • Hotels, restaurants, mix of activities' },
  { value: 'luxury' as const, label: 'Luxury', description: '¥25,000+/day • Premium hotels, fine dining, private experiences' },
]

const tripPaceOptions = [
  { value: 'relaxed' as const, label: 'Relaxed', description: '1-2 activities per day • Plenty of rest time' },
  { value: 'moderate' as const, label: 'Moderate', description: '2-3 activities per day • Balanced schedule' },
  { value: 'packed' as const, label: 'Packed', description: '3+ activities per day • Make the most of your time' },
]

const accessibilityOptions = [
  'Wheelchair accessibility',
  'Mobility assistance',
  'Visual impairment support',
  'Hearing impairment support',
  'Dietary restrictions',
  'Medical facilities nearby'
]

// Japan seasons and holidays for date picker context
const getJapanSeasonInfo = (date: string) => {
  if (!date) return null

  const month = new Date(date).getMonth() + 1

  if (month >= 3 && month <= 5) {
    return { season: 'Spring', highlight: 'Cherry Blossom Season 🌸', class: 'text-pink-600' }
  } else if (month >= 6 && month <= 8) {
    return { season: 'Summer', highlight: 'Festival Season 🎆', class: 'text-blue-600' }
  } else if (month >= 9 && month <= 11) {
    return { season: 'Autumn', highlight: 'Autumn Leaves 🍁', class: 'text-orange-600' }
  } else {
    return { season: 'Winter', highlight: 'Illuminations & Hot Springs ❄️', class: 'text-indigo-600' }
  }
}

export function TripPreferencesForm({ onSubmit }: TripPreferencesFormProps) {
  const { tripPreferences: preferences, setTripPreferences, updatePreference } = useTripPlanningStore()
  const { errors, isValid, clearError } = useFormValidation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with existing preferences or defaults
  const [formData, setFormData] = useState({
    startDate: preferences?.startDate && preferences.startDate instanceof Date ? preferences.startDate.toISOString().split('T')[0] : '',
    endDate: preferences?.endDate && preferences.endDate instanceof Date ? preferences.endDate.toISOString().split('T')[0] : '',
    adults: preferences?.adults ?? 2,
    children: preferences?.children ?? 0,
    infants: preferences?.infants ?? 0,
    activities: preferences?.activities ?? [],
    budgetRange: preferences?.budgetRange ?? 'mid-range' as const,
    tripPace: preferences?.tripPace ?? 'moderate' as const,
    accessibilityNeeds: preferences?.accessibilityNeeds ?? []
  })

  // Update Zustand store when form data changes
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)

      // Validate that dates are valid
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        const updatedPreferences: TripPreferences = {
          startDate,
          endDate,
          adults: formData.adults,
          children: formData.children,
          infants: formData.infants,
          activities: formData.activities,
          budgetRange: formData.budgetRange,
          tripPace: formData.tripPace,
          accessibilityNeeds: formData.accessibilityNeeds
        }
        setTripPreferences(updatedPreferences)
      }
    }
  }, [formData, setTripPreferences])

  const handleActivityToggle = (activityId: ActivityType) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activityId)
        ? prev.activities.filter(id => id !== activityId)
        : [...prev.activities, activityId]
    }))
    clearError('activities')
  }

  const handleAccessibilityToggle = (need: string) => {
    setFormData(prev => ({
      ...prev,
      accessibilityNeeds: prev.accessibilityNeeds.includes(need)
        ? prev.accessibilityNeeds.filter(n => n !== need)
        : [...prev.accessibilityNeeds, need]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid || Object.keys(errors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)

      // Additional validation before creating preferences
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error('Invalid date values')
        return
      }

      const finalPreferences: TripPreferences = {
        startDate,
        endDate,
        adults: formData.adults,
        children: formData.children,
        infants: formData.infants,
        activities: formData.activities,
        budgetRange: formData.budgetRange,
        tripPace: formData.tripPace,
        accessibilityNeeds: formData.accessibilityNeeds
      }

      // Create trip request
      const tripRequest: CreateTripRequest = {
        title: `Japan Trip ${new Date(formData.startDate).getFullYear()}`,
        description: `Trip for ${formData.adults + formData.children + formData.infants} travelers`,
        preferences: finalPreferences
      }

      // Call backend API to create trip
      const createdTrip = await tripApi.createTrip(tripRequest)
      console.log('Trip created successfully:', createdTrip)

      // Update local preferences store
      setTripPreferences(finalPreferences)

      // Continue to next step
      onSubmit(finalPreferences)

    } catch (error) {
      console.error('Failed to create trip:', error)
      // For demo purposes, continue even if backend is not available
      const fallbackStartDate = new Date(formData.startDate)
      const fallbackEndDate = new Date(formData.endDate)

      if (!isNaN(fallbackStartDate.getTime()) && !isNaN(fallbackEndDate.getTime())) {
        const finalPreferences: TripPreferences = {
          startDate: fallbackStartDate,
          endDate: fallbackEndDate,
          adults: formData.adults,
          children: formData.children,
          infants: formData.infants,
          activities: formData.activities,
          budgetRange: formData.budgetRange,
          tripPace: formData.tripPace,
          accessibilityNeeds: formData.accessibilityNeeds
        }
        onSubmit(finalPreferences)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.startDate && formData.endDate && formData.activities.length > 0 && formData.adults > 0
  const totalTravelers = formData.adults + formData.children + formData.infants
  const startSeasonInfo = getJapanSeasonInfo(formData.startDate)
  const endSeasonInfo = getJapanSeasonInfo(formData.endDate)

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
            {/* Trip Details */}
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="text-h2-md font-semibold">Trip Details</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Input
                      type="date"
                      label="Start Date"
                      value={formData.startDate}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, startDate: e.target.value }))
                        clearError('startDate')
                      }}
                      required
                      error={errors.startDate}
                    />
                    {startSeasonInfo && (
                      <p className={`text-sm ${startSeasonInfo.class}`}>
                        {startSeasonInfo.highlight}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Input
                      type="date"
                      label="End Date"
                      value={formData.endDate}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, endDate: e.target.value }))
                        clearError('endDate')
                      }}
                      min={formData.startDate}
                      required
                      error={errors.endDate}
                    />
                    {endSeasonInfo && endSeasonInfo.season !== startSeasonInfo?.season && (
                      <p className={`text-sm ${endSeasonInfo.class}`}>
                        {endSeasonInfo.highlight}
                      </p>
                    )}
                  </div>
                </div>

                {/* Group Size */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-medium text-text-primary">Group Size</h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Adults (18+)
                      </label>
                      <select
                        value={formData.adults}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, adults: parseInt(e.target.value) }))
                          clearError('adults')
                        }}
                        className="w-full rounded-lg border border-border-default px-3 py-2 bg-white focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus/25"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <option key={num} value={num}>
                            {num} adult{num !== 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                      {errors.adults && (
                        <p className="text-sm text-feedback-error mt-1">{errors.adults}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Children (3-17)
                      </label>
                      <select
                        value={formData.children}
                        onChange={(e) => setFormData(prev => ({ ...prev, children: parseInt(e.target.value) }))}
                        className="w-full rounded-lg border border-border-default px-3 py-2 bg-white focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus/25"
                      >
                        {[0, 1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'child' : 'children'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Infants (0-2)
                      </label>
                      <select
                        value={formData.infants}
                        onChange={(e) => setFormData(prev => ({ ...prev, infants: parseInt(e.target.value) }))}
                        className="w-full rounded-lg border border-border-default px-3 py-2 bg-white focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus/25"
                      >
                        {[0, 1, 2, 3].map(num => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'infant' : 'infants'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <p className="text-sm text-text-secondary">
                    Total travelers: {totalTravelers}
                  </p>
                </div>
              </div>
            </Card>

            {/* Budget & Pace */}
            <Card className="p-8">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Budget Range */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-medium text-text-primary">Budget Range</h3>
                    </div>

                    <div className="space-y-3">
                      {budgetOptions.map((option) => {
                        const isSelected = formData.budgetRange === option.value

                        return (
                          <motion.button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, budgetRange: option.value }))}
                            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/10'
                                : 'border-border-default hover:border-border-strong'
                            }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1 ${
                                isSelected ? 'border-primary' : 'border-border-default'
                              }`}>
                                {isSelected && (
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">{option.label}</h4>
                                <p className="text-sm text-text-secondary">{option.description}</p>
                              </div>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Trip Pace */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-medium text-text-primary">Trip Pace</h3>
                    </div>

                    <div className="space-y-3">
                      {tripPaceOptions.map((option) => {
                        const isSelected = formData.tripPace === option.value

                        return (
                          <motion.button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, tripPace: option.value }))}
                            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/10'
                                : 'border-border-default hover:border-border-strong'
                            }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1 ${
                                isSelected ? 'border-primary' : 'border-border-default'
                              }`}>
                                {isSelected && (
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">{option.label}</h4>
                                <p className="text-sm text-text-secondary">{option.description}</p>
                              </div>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
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

                {errors.activities && (
                  <p className="text-sm text-feedback-error">
                    {errors.activities}
                  </p>
                )}
              </div>
            </Card>

            {/* Accessibility Needs */}
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Accessibility className="w-5 h-5 text-primary" />
                  <h2 className="text-h2-md font-semibold">Accessibility Needs (Optional)</h2>
                </div>

                <p className="text-text-secondary">
                  Let us know if you have any accessibility requirements so we can recommend suitable activities and venues.
                </p>

                <div className="grid md:grid-cols-2 gap-3">
                  {accessibilityOptions.map((need) => {
                    const isSelected = formData.accessibilityNeeds.includes(need)

                    return (
                      <motion.button
                        key={need}
                        type="button"
                        onClick={() => handleAccessibilityToggle(need)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border-default hover:border-border-strong'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'border-primary bg-primary' : 'border-border-default'
                          }`}>
                            {isSelected && (
                              <CheckSquare className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>
                          <span className="text-sm font-medium">{need}</span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                disabled={!isFormValid || Object.keys(errors).length > 0}
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

            {/* Form Progress */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-sm text-text-secondary bg-white px-4 py-2 rounded-full border">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>Step 1 of 5: Preferences</span>
              </div>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}
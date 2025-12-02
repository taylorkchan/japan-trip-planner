import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, MapPin, Star, Clock, Heart } from 'lucide-react'
import { Card } from './Card'
import { Button } from './Button'
import { Modal } from './Modal'
import type { ItineraryData, Activity } from '../lib/types'
import { formatDuration, getActivityColor } from '../lib/utils'
import { staggerContainer, staggerChild } from '../lib/motion'
import { useTripPlanningStore } from '../lib/store'

interface VisualAttractionGalleryProps {
  itinerary: ItineraryData
}

export function VisualAttractionGallery({ itinerary }: VisualAttractionGalleryProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { toggleBookmark, isBookmarked } = useTripPlanningStore()

  // Get all activities from all days
  const allActivities = itinerary.days.flatMap(day => day.activities)

  const openActivityModal = (activity: Activity) => {
    setSelectedActivity(activity)
    setCurrentImageIndex(0)
  }

  const closeModal = () => {
    setSelectedActivity(null)
    setCurrentImageIndex(0)
  }

  const handleBookmarkToggle = (e: React.MouseEvent, activityId: string) => {
    e.stopPropagation()
    toggleBookmark(activityId)
  }

  const nextImage = () => {
    if (selectedActivity) {
      setCurrentImageIndex((prev) =>
        prev === selectedActivity.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (selectedActivity) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedActivity.images.length - 1 : prev - 1
      )
    }
  }

  if (allActivities.length === 0) {
    return (
      <div className="min-h-screen bg-surface-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-surface-subtle rounded-full mx-auto flex items-center justify-center">
            <span className="text-2xl">📸</span>
          </div>
          <h2 className="text-h2-md font-semibold text-text-primary">
            No Activities Yet
          </h2>
          <p className="text-text-secondary">
            Add some activities to your itinerary to see them in the gallery.
          </p>
        </div>
      </div>
    )
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
              Visual Gallery
            </h1>
            <p className="text-lg text-text-secondary">
              Explore the beauty and culture of your planned destinations
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            variants={staggerChild}
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {allActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  onClick={() => openActivityModal(activity)}
                  className="overflow-hidden group cursor-pointer"
                >
                  <div className="relative aspect-square">
                    <img
                      src={activity.images[0]}
                      alt={activity.imageAltTexts?.[0] || `${activity.title} - Main view showing this popular ${activity.category} attraction`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getActivityColor(activity.category)}`}>
                        {activity.category}
                      </span>
                    </div>

                    {/* Bookmark button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleBookmarkToggle(e, activity.id)}
                      className="absolute top-3 right-3 opacity-80 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-full p-2"
                      aria-label={isBookmarked(activity.id) ? `Remove ${activity.title} from bookmarks` : `Add ${activity.title} to bookmarks`}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isBookmarked(activity.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-600 hover:text-red-500'
                        }`}
                      />
                    </Button>

                    {/* Image count indicator */}
                    {activity.images.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
                        +{activity.images.length - 1}
                      </div>
                    )}

                    {/* Quick info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {activity.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{activity.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(activity.duration)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Activity Detail Modal */}
      <Modal
        isOpen={!!selectedActivity}
        onClose={closeModal}
        size="xl"
      >
        {selectedActivity && (
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="relative aspect-[4/3] bg-surface-subtle rounded-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={selectedActivity.images[currentImageIndex]}
                  alt={selectedActivity.imageAltTexts?.[currentImageIndex] || `${selectedActivity.title} - View ${currentImageIndex + 1} of this ${selectedActivity.category} attraction`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Navigation buttons */}
              {selectedActivity.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {selectedActivity.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-white scale-125'
                            : 'bg-white/60 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Activity Details */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-h2-md font-bold text-text-primary">
                    {selectedActivity.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-secondary">
                      {selectedActivity.location.name}
                    </span>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getActivityColor(selectedActivity.category)}`}>
                  {selectedActivity.category}
                </span>
              </div>

              <p className="text-text-secondary leading-relaxed">
                {selectedActivity.description}
              </p>

              {/* Activity Stats */}
              <div className="flex items-center gap-6 py-4 border-t border-b border-border-default">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{selectedActivity.rating}</span>
                  <span className="text-text-secondary text-sm">rating</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-text-secondary" />
                  <span className="font-semibold">{formatDuration(selectedActivity.duration)}</span>
                  <span className="text-text-secondary text-sm">duration</span>
                </div>

                {selectedActivity.price > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary text-sm">from</span>
                    <span className="font-semibold text-primary">
                      ¥{selectedActivity.price.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Cultural Significance */}
              {selectedActivity.culturalSignificance && (
                <div>
                  <h3 className="font-semibold text-text-primary mb-3">
                    🏛️ Cultural Significance
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {selectedActivity.culturalSignificance}
                  </p>
                </div>
              )}

              {/* Historical Context */}
              {selectedActivity.historicalContext && (
                <div>
                  <h3 className="font-semibold text-text-primary mb-3">
                    📜 Historical Context
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {selectedActivity.historicalContext}
                  </p>
                </div>
              )}

              {/* Accessibility Information */}
              {selectedActivity.accessibilityInfo && (
                <div>
                  <h3 className="font-semibold text-text-primary mb-3">
                    ♿ Accessibility Information
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {selectedActivity.accessibilityInfo}
                  </p>
                </div>
              )}

              {/* Best Visit Seasons */}
              {selectedActivity.bestVisitSeasons && selectedActivity.bestVisitSeasons.length > 0 && (
                <div>
                  <h3 className="font-semibold text-text-primary mb-3">
                    🌸 Best Times to Visit
                  </h3>
                  <ul className="space-y-1">
                    {selectedActivity.bestVisitSeasons.map((season, index) => (
                      <li key={index} className="text-text-secondary text-sm">
                        • {season}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tips */}
              {selectedActivity.tips.length > 0 && (
                <div>
                  <h3 className="font-semibold text-text-primary mb-3">
                    💡 Helpful Tips
                  </h3>
                  <ul className="space-y-2">
                    {selectedActivity.tips.map((tip, index) => (
                      <li key={index} className="text-text-secondary text-sm">
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
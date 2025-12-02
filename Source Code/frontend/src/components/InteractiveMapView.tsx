import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Map, Navigation, Car, Train, MapPin, Star, Clock } from 'lucide-react'
import { Card } from './Card'
import { Button } from './Button'
import { Modal } from './Modal'
import type { ItineraryData, Activity } from '../lib/types'
import { formatDuration } from '../lib/utils'
import { staggerContainer, staggerChild } from '../lib/motion'

interface InteractiveMapViewProps {
  itinerary: ItineraryData
}

export function InteractiveMapView({ itinerary }: InteractiveMapViewProps) {
  const [transportMode, setTransportMode] = useState<'driving' | 'transit'>('transit')
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [selectedDay, setSelectedDay] = useState<number>(1)

  // Get all activities from all days
  const allActivities = itinerary.days.flatMap(day => day.activities)
  const currentDayActivities = itinerary.days.find(day => day.day === selectedDay)?.activities || []

  // Function to calculate positions based on actual coordinates
  const getPositionFromCoordinates = (lat: number, lng: number) => {
    // Simple mapping for Tokyo area (35.65-35.75 lat, 139.65-139.80 lng)
    const x = ((lng - 139.65) / (139.80 - 139.65)) * 100
    const y = 100 - ((lat - 35.65) / (35.75 - 35.65)) * 100
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) }
  }

  if (allActivities.length === 0) {
    return (
      <div className="min-h-screen bg-surface-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-surface-subtle rounded-full mx-auto flex items-center justify-center">
            <Map className="w-8 h-8 text-text-secondary" />
          </div>
          <h2 className="text-h2-md font-semibold text-text-primary">
            No Activities to Map
          </h2>
          <p className="text-text-secondary">
            Add some activities to your itinerary to see them on the map.
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
            <h1 className="text-h1-lg font-bold text-text-primary">Interactive Map</h1>
            <p className="text-lg text-text-secondary">
              Visualize your itinerary and optimize your routes
            </p>
          </motion.div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Controls */}
            <motion.div variants={staggerChild} className="space-y-6">
              {/* Day selector */}
              <Card className="p-4">
                <h3 className="font-semibold text-text-primary mb-3">Select Day</h3>
                <div className="grid grid-cols-2 gap-2">
                  {itinerary.days.map(day => (
                    <button
                      key={day.day}
                      onClick={() => setSelectedDay(day.day)}
                      className={`p-3 rounded-lg text-left transition-colors ${
                        selectedDay === day.day
                          ? 'bg-primary/10 border-2 border-primary text-primary'
                          : 'bg-surface-hover hover:bg-surface-subtle'
                      }`}
                    >
                      <div className="font-medium">Day {day.day}</div>
                      <div className="text-sm opacity-70">{day.activities.length} activities</div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Transport Mode Toggle */}
              <Card className="p-4">
                <h3 className="font-semibold text-text-primary mb-3">Transport Mode</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setTransportMode('transit')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      transportMode === 'transit'
                        ? 'bg-primary/10 border-2 border-primary text-primary'
                        : 'bg-surface-hover hover:bg-surface-subtle'
                    }`}
                  >
                    <Train className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Public Transit</div>
                      <div className="text-sm opacity-70">Trains & buses</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setTransportMode('driving')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      transportMode === 'driving'
                        ? 'bg-primary/10 border-2 border-primary text-primary'
                        : 'bg-surface-hover hover:bg-surface-subtle'
                    }`}
                  >
                    <Car className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Driving</div>
                      <div className="text-sm opacity-70">Car or taxi</div>
                    </div>
                  </button>
                </div>
              </Card>

              {/* Route Summary */}
              {currentDayActivities.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold text-text-primary mb-3">Route Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Total stops:</span>
                      <span className="font-medium">{currentDayActivities.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Estimated travel:</span>
                      <span className="font-medium">
                        {Math.floor(Math.random() * 30) + 10} min
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Activity time:</span>
                      <span className="font-medium">
                        {formatDuration(currentDayActivities.reduce((total, activity) => total + activity.duration, 0))}
                      </span>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>

            {/* Map Area */}
            <motion.div variants={staggerChild} className="lg:col-span-3">
              <Card className="aspect-[4/3] lg:aspect-auto lg:h-[600px] overflow-hidden relative">
                {/* OpenStreetMap Embedded Map */}
                <div className="absolute inset-0">
                  <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=139.6503%2C35.6762%2C139.7967%2C35.7148&layer=mapnik&marker=35.6955%2C139.7235"
                    className="w-full h-full border-0"
                    title="Tokyo Map"
                    allowFullScreen
                  />
                </div>

                {/* Activity pins overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {currentDayActivities.map((activity, index) => {
                    const position = getPositionFromCoordinates(
                      activity.location.coordinates.lat,
                      activity.location.coordinates.lng
                    )

                    return (
                      <motion.button
                        key={activity.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.2 }}
                        onClick={() => setSelectedActivity(activity)}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group pointer-events-auto"
                        style={{ left: `${position.x}%`, top: `${position.y}%` }}
                      >
                        <div className="relative">
                          <div className="w-8 h-8 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
                            {index + 1}
                          </div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="bg-white rounded-lg shadow-lg p-3 text-left whitespace-nowrap border">
                              <div className="font-medium text-text-primary text-sm">
                                {activity.title}
                              </div>
                              <div className="text-xs text-text-secondary">
                                {formatDuration(activity.duration)} • ⭐ {activity.rating}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Map controls */}
                <div className="absolute top-4 right-4">
                  <Button variant="secondary" size="sm" className="bg-white shadow-lg">
                    <Navigation className="w-4 h-4" />
                  </Button>
                </div>

                <div className="absolute bottom-4 right-4 flex flex-col space-y-1">
                  <Button variant="secondary" size="sm" className="bg-white shadow-lg px-3">
                    +
                  </Button>
                  <Button variant="secondary" size="sm" className="bg-white shadow-lg px-3">
                    −
                  </Button>
                </div>

                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-primary rounded-full"></div>
                    <span>Activity location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-primary opacity-60"></div>
                    <span>Transit route</span>
                  </div>
                </div>

                {/* No activities message */}
                {currentDayActivities.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-center text-text-secondary bg-white/90">
                    <div>
                      <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No activities planned for Day {selectedDay}</p>
                      <p className="text-sm">Add activities to see them on the map</p>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Activity Details Modal */}
      <Modal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        title={selectedActivity?.title || ''}
        size="lg"
      >
        {selectedActivity && (
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={selectedActivity.images[0]}
                alt={selectedActivity.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <p className="text-text-secondary">{selectedActivity.description}</p>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{selectedActivity.rating}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-text-secondary" />
                  <span className="font-semibold">{formatDuration(selectedActivity.duration)}</span>
                </div>

                {selectedActivity.price > 0 && (
                  <div className="text-primary font-semibold">
                    ¥{selectedActivity.price.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
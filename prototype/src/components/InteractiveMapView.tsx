import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Map, Navigation, Car, Train, MapPin, Star, Clock, ToggleLeft, ToggleRight } from 'lucide-react'
import { Card } from './Card'
import { Button } from './Button'
import { Modal } from './Modal'
import type { ItineraryData, Activity, Location } from '../lib/types'
import { formatDuration, getActivityColor } from '../lib/utils'
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

  // Mock map data - in a real app, this would integrate with Google Maps or similar
  const mapCenter = { lat: 35.6762, lng: 139.6503 } // Tokyo center

  const generateRoute = (activities: Activity[]) => {
    // Mock route generation
    return activities.map((activity, index) => ({
      from: index === 0 ? mapCenter : activities[index - 1].location.coordinates,
      to: activity.location.coordinates,
      duration: Math.floor(Math.random() * 30) + 10, // Random 10-40 minute travel time
      mode: transportMode
    }))
  }

  const currentRoutes = generateRoute(currentDayActivities)

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
            <h1 className="text-h1-lg font-bold text-text-primary">
              Interactive Map
            </h1>
            <p className="text-lg text-text-secondary">
              Visualize your itinerary and optimize your routes
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Controls Sidebar */}
            <motion.div variants={staggerChild} className="lg:col-span-1 space-y-6">
              {/* Day Selector */}
              <Card className="p-4">
                <h3 className="font-semibold text-text-primary mb-3">Select Day</h3>
                <div className="space-y-2">
                  {itinerary.days.map((day) => (
                    <button
                      key={day.day}
                      onClick={() => setSelectedDay(day.day)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedDay === day.day
                          ? 'bg-primary text-white'
                          : 'bg-surface-hover hover:bg-surface-subtle text-text-primary'
                      }`}
                    >
                      <div className="font-medium">Day {day.day}</div>
                      <div className="text-sm opacity-80">
                        {day.activities.length} activities
                      </div>
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
                        {formatDuration(currentRoutes.reduce((total, route) => total + route.duration, 0))}
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
                {/* Mock Map Display */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                  {/* Map placeholder with activity pins */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Background pattern to simulate map */}
                    <div className="absolute inset-0 opacity-10">
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 400 400"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <pattern
                            id="grid"
                            width="40"
                            height="40"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 40 0 L 0 0 0 40"
                              fill="none"
                              stroke="#000"
                              strokeWidth="1"
                            />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                      </svg>
                    </div>

                    {/* Activity pins scattered across the map */}
                    {currentDayActivities.map((activity, index) => {
                      // Generate pseudo-random positions for demo
                      const positions = [
                        { x: '20%', y: '30%' },
                        { x: '45%', y: '25%' },
                        { x: '70%', y: '40%' },
                        { x: '35%', y: '60%' },
                        { x: '60%', y: '70%' },
                        { x: '80%', y: '55%' },
                      ]
                      const position = positions[index % positions.length]

                      return (
                        <motion.button
                          key={activity.id}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.2 }}
                          onClick={() => setSelectedActivity(activity)}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                          style={{ left: position.x, top: position.y }}
                        >
                          <div className="relative">
                            {/* Pin */}
                            <div className="w-8 h-8 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
                              {index + 1}
                            </div>

                            {/* Activity preview on hover */}
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

                    {/* Route lines */}
                    {currentRoutes.length > 1 && (
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        {currentRoutes.slice(0, -1).map((_, index) => {
                          const positions = [
                            { x: 20, y: 30 },
                            { x: 45, y: 25 },
                            { x: 70, y: 40 },
                            { x: 35, y: 60 },
                            { x: 60, y: 70 },
                          ]
                          const start = positions[index % positions.length]
                          const end = positions[(index + 1) % positions.length]

                          return (
                            <motion.line
                              key={index}
                              x1={start.x}
                              y1={start.y}
                              x2={end.x}
                              y2={end.y}
                              stroke="#F45500"
                              strokeWidth="0.5"
                              strokeDasharray="2 2"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1, delay: index * 0.3 }}
                            />
                          )
                        })}
                      </svg>
                    )}

                    {/* Map controls */}
                    <div className="absolute top-4 right-4 space-y-2">
                      <Button variant="secondary" size="sm" className="bg-white shadow-lg">
                        <Navigation className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Zoom controls */}
                    <div className="absolute bottom-4 right-4 flex flex-col space-y-1">
                      <Button variant="secondary" size="sm" className="bg-white shadow-lg px-3">
                        +
                      </Button>
                      <Button variant="secondary" size="sm" className="bg-white shadow-lg px-3">
                        −
                      </Button>
                    </div>

                    {/* Map legend */}
                    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-primary rounded-full"></div>
                        <span>Activity location</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-0.5 bg-primary opacity-60"></div>
                        <span>{transportMode === 'transit' ? 'Transit route' : 'Driving route'}</span>
                      </div>
                    </div>

                    {/* No activities message */}
                    {currentDayActivities.length === 0 && (
                      <div className="text-center text-text-secondary">
                        <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No activities planned for Day {selectedDay}</p>
                        <p className="text-sm">Add activities to see them on the map</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Activity Details Modal */}
      <Modal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        title="Activity Details"
        size="lg"
      >
        {selectedActivity && (
          <div className="space-y-6">
            {/* Activity image */}
            <div className="aspect-[4/3] bg-surface-subtle rounded-lg overflow-hidden">
              <img
                src={selectedActivity.images[0]}
                alt={selectedActivity.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Activity info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-h3-md font-bold text-text-primary">
                    {selectedActivity.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-text-secondary">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedActivity.location.address}</span>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getActivityColor(selectedActivity.category)}`}>
                  {selectedActivity.category}
                </span>
              </div>

              <p className="text-text-secondary">
                {selectedActivity.description}
              </p>

              <div className="flex items-center gap-6 pt-4 border-t border-border-default">
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
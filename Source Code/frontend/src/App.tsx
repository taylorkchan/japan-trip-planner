import { motion } from 'framer-motion'
import { TripPreferencesForm } from './components/TripPreferencesForm'
import { ItineraryGeneration } from './components/ItineraryGeneration'
import { VisualAttractionGallery } from './components/VisualAttractionGallery'
import { InteractiveMapView } from './components/InteractiveMapView'
import { ScheduleTimelineView } from './components/ScheduleTimelineView'
import { Navbar } from './components/Navbar'
import type { TripPreferences, ItineraryData } from './lib/types'
import { useTripPlanningStore } from './lib/store'

function App() {
  const {
    currentView,
    setCurrentView,
    tripPreferences,
    setTripPreferences,
    itineraryData,
    setItineraryData
  } = useTripPlanningStore()

  const handlePreferencesSubmit = (preferences: TripPreferences) => {
    setTripPreferences(preferences)
    setCurrentView('itinerary')
  }

  const handleItineraryGenerated = (itinerary: ItineraryData) => {
    setItineraryData(itinerary)
  }

  const switchView = (view: typeof currentView) => {
    setCurrentView(view)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentView={currentView} onViewChange={switchView} />

      <main className="pt-16">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        >
          {currentView === 'preferences' && (
            <TripPreferencesForm onSubmit={handlePreferencesSubmit} />
          )}

          {currentView === 'itinerary' && (
            <ItineraryGeneration
              preferences={tripPreferences}
              onItineraryGenerated={handleItineraryGenerated}
              onViewChange={switchView}
            />
          )}

          {currentView === 'gallery' && itineraryData && (
            <VisualAttractionGallery itinerary={itineraryData} />
          )}

          {currentView === 'map' && itineraryData && (
            <InteractiveMapView itinerary={itineraryData} />
          )}

          {currentView === 'timeline' && itineraryData && (
            <ScheduleTimelineView
              itinerary={itineraryData}
              onItineraryUpdate={setItineraryData}
            />
          )}
        </motion.div>
      </main>
    </div>
  )
}

export default App
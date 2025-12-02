import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TripPreferences, ItineraryData, ActivityType } from './types'

interface TripPlanningState {
  // Trip Preferences
  tripPreferences: TripPreferences | null
  setTripPreferences: (preferences: TripPreferences) => void
  updatePreference: <K extends keyof TripPreferences>(
    key: K,
    value: TripPreferences[K]
  ) => void

  // Form Validation State
  formErrors: Record<string, string>
  setFormError: (field: string, error: string) => void
  clearFormError: (field: string) => void
  clearAllFormErrors: () => void

  // Itinerary Data
  itineraryData: ItineraryData | null
  setItineraryData: (itinerary: ItineraryData) => void

  // Bookmarks
  bookmarkedActivities: string[]
  toggleBookmark: (activityId: string) => void
  isBookmarked: (activityId: string) => boolean

  // UI State
  currentView: 'preferences' | 'itinerary' | 'gallery' | 'map' | 'timeline'
  setCurrentView: (view: TripPlanningState['currentView']) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

// Helper to validate trip preferences
const validateTripPreferences = (preferences: Partial<TripPreferences>) => {
  const errors: Record<string, string> = {}

  if (!preferences.startDate) {
    errors.startDate = 'Start date is required'
  }

  if (!preferences.endDate) {
    errors.endDate = 'End date is required'
  }

  if (preferences.startDate && preferences.endDate) {
    const start = new Date(preferences.startDate)
    const end = new Date(preferences.endDate)
    if (start >= end) {
      errors.endDate = 'End date must be after start date'
    }
  }

  if (!preferences.adults || preferences.adults < 1) {
    errors.adults = 'At least one adult is required'
  }

  if (!preferences.activities || preferences.activities.length === 0) {
    errors.activities = 'Please select at least one activity'
  }

  return errors
}

export const useTripPlanningStore = create<TripPlanningState>()(
  persist(
    (set, get) => ({
      // Initial state
      tripPreferences: null,
      formErrors: {},
      itineraryData: null,
      bookmarkedActivities: [],
      currentView: 'preferences',
      isLoading: false,

      // Actions
      setTripPreferences: (preferences) => {
        const errors = validateTripPreferences(preferences)
        set({
          tripPreferences: preferences,
          formErrors: errors
        })
      },

      updatePreference: (key, value) => {
        const currentPrefs = get().tripPreferences || {} as Partial<TripPreferences>
        const updatedPrefs = { ...currentPrefs, [key]: value } as TripPreferences
        const errors = validateTripPreferences(updatedPrefs)

        set({
          tripPreferences: updatedPrefs,
          formErrors: errors
        })
      },

      setFormError: (field, error) => {
        set((state) => ({
          formErrors: { ...state.formErrors, [field]: error }
        }))
      },

      clearFormError: (field) => {
        set((state) => {
          const { [field]: removed, ...rest } = state.formErrors
          return { formErrors: rest }
        })
      },

      clearAllFormErrors: () => {
        set({ formErrors: {} })
      },

      setItineraryData: (itinerary) => {
        set({ itineraryData: itinerary })
      },

      toggleBookmark: (activityId) => {
        set((state) => {
          const isCurrentlyBookmarked = state.bookmarkedActivities.includes(activityId)
          return {
            bookmarkedActivities: isCurrentlyBookmarked
              ? state.bookmarkedActivities.filter(id => id !== activityId)
              : [...state.bookmarkedActivities, activityId]
          }
        })
      },

      isBookmarked: (activityId) => {
        return get().bookmarkedActivities.includes(activityId)
      },

      setCurrentView: (view) => {
        set({ currentView: view })
      },

      setIsLoading: (loading) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'japan-trip-planner-storage',
      partialize: (state) => ({
        tripPreferences: state.tripPreferences,
        currentView: state.currentView,
        bookmarkedActivities: state.bookmarkedActivities
      }),
    }
  )
)

// Helper hooks for specific data
export const useTripPreferences = () => {
  const store = useTripPlanningStore()
  return {
    preferences: store.tripPreferences,
    setPreferences: store.setTripPreferences,
    updatePreference: store.updatePreference,
  }
}

export const useFormValidation = () => {
  const store = useTripPlanningStore()
  return {
    errors: store.formErrors,
    setError: store.setFormError,
    clearError: store.clearFormError,
    clearAllErrors: store.clearAllFormErrors,
    isValid: Object.keys(store.formErrors).length === 0
  }
}
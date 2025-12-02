// Core data types for the Japan Trip Planner

export interface TripPreferences {
  startDate: Date
  endDate: Date
  adults: number
  children: number
  infants: number
  activities: ActivityType[]
  budgetRange: 'budget' | 'mid-range' | 'luxury'
  tripPace: 'relaxed' | 'moderate' | 'packed'
  accessibilityNeeds: string[]
}

export type ActivityType =
  | 'temples'
  | 'food'
  | 'nightlife'
  | 'shopping'
  | 'nature'
  | 'culture'
  | 'museums'
  | 'entertainment'

export interface Activity {
  id: string
  title: string
  description: string
  category: ActivityType
  location: Location
  duration: number // in minutes
  images: string[]
  rating: number
  price: number
  tips: string[]
  culturalSignificance?: string
  historicalContext?: string
  accessibilityInfo?: string
  imageAltTexts?: string[]
  bestVisitSeasons?: string[]
  isBookmarked?: boolean
}

export interface Location {
  name: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  prefecture: string
  city: string
}

export interface DayItinerary {
  day: number
  date: Date
  activities: Activity[]
  transportRoutes?: TransportRoute[]
}

export interface ItineraryData {
  id: string
  tripDuration: number
  preferences: TripPreferences
  days: DayItinerary[]
  totalEstimatedCost: number
}

export interface TransportRoute {
  from: Location
  to: Location
  mode: 'walking' | 'train' | 'bus' | 'taxi'
  duration: number // in minutes
  cost: number
  instructions: string[]
}

export interface ActivityCatalog {
  temples: Activity[]
  food: Activity[]
  nightlife: Activity[]
  shopping: Activity[]
  nature: Activity[]
  culture: Activity[]
  museums: Activity[]
  entertainment: Activity[]
}

// UI State Types
export type ViewType = 'preferences' | 'itinerary' | 'gallery' | 'map' | 'timeline'

export interface ActivityCardProps {
  activity: Activity
  onEdit?: (activity: Activity) => void
  onRemove?: (activityId: string) => void
  onImageClick?: (activity: Activity) => void
  draggable?: boolean
}

export interface MapPin {
  id: string
  activity: Activity
  coordinates: {
    lat: number
    lng: number
  }
}

// Component Props
export interface TripPreferencesFormProps {
  onSubmit: (preferences: TripPreferences) => void
}

export interface ItineraryGenerationProps {
  preferences: TripPreferences | null
  onItineraryGenerated: (itinerary: ItineraryData) => void
  onViewChange: (view: ViewType) => void
}

export interface VisualAttractionGalleryProps {
  itinerary: ItineraryData
}

export interface InteractiveMapViewProps {
  itinerary: ItineraryData
}

export interface ScheduleTimelineViewProps {
  itinerary: ItineraryData
  onItineraryUpdate: (itinerary: ItineraryData) => void
}

export interface NavbarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}
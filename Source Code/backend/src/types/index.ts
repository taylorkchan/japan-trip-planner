// Shared types between frontend and backend
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

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  preferences?: Record<string, any>
  created_at: Date
  updated_at: Date
}

export interface Trip {
  id: string
  user_id: string
  title: string
  description?: string
  start_date: Date
  end_date: Date
  group_size: number
  adults: number
  children: number
  infants: number
  budget_range: 'budget' | 'mid-range' | 'luxury'
  trip_pace: 'relaxed' | 'moderate' | 'packed'
  preferences: Record<string, any>
  status: 'draft' | 'published' | 'archived'
  created_at: Date
  updated_at: Date
}

export interface Attraction {
  id: string
  name: string
  name_japanese?: string
  description: string
  category: ActivityType
  subcategory?: string
  location_name: string
  prefecture: string
  latitude: number
  longitude: number
  address?: string
  phone?: string
  website?: string
  opening_hours?: Record<string, any>
  admission_fee?: Record<string, any>
  duration_minutes?: number
  best_visit_time?: string
  accessibility_features?: Record<string, any>
  seasonal_info?: Record<string, any>
  cultural_significance?: string
  visitor_tips?: string
  photo_credits?: string[]
  rating?: number
  review_count: number
  popularity_score: number
  created_at: Date
  updated_at: Date
}

export interface TripActivity {
  id: string
  trip_id: string
  attraction_id: string
  day_number: number
  start_time?: string
  estimated_duration?: number
  notes?: string
  sort_order: number
  is_custom: boolean
  custom_name?: string
  custom_description?: string
  status: 'planned' | 'visited' | 'skipped'
  created_at: Date
  updated_at: Date
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface CreateTripRequest {
  preferences: TripPreferences
  title?: string
  description?: string
}

export interface CreateTripResponse {
  trip: Trip
}

// Service interfaces for abstraction layer
export interface TripService {
  createTrip(userId: string, data: CreateTripRequest): Promise<Trip>
  getUserTrips(userId: string): Promise<Trip[]>
  getTripById(tripId: string, userId: string): Promise<Trip | null>
  updateTrip(tripId: string, userId: string, data: Partial<Trip>): Promise<Trip>
  deleteTrip(tripId: string, userId: string): Promise<void>
}

export interface AttractionService {
  getAttractions(filters?: {
    categories?: ActivityType[]
    prefecture?: string
    budgetRange?: string
  }): Promise<Attraction[]>
  getAttractionById(id: string): Promise<Attraction | null>
  searchAttractions(query: string): Promise<Attraction[]>
}

export interface UserService {
  createUser(email: string, fullName?: string): Promise<User>
  getUserById(id: string): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  updateUser(id: string, data: Partial<User>): Promise<User>
  deleteUser(id: string): Promise<void>
}
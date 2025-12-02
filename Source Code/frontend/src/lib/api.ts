import axios, { AxiosResponse } from 'axios'
import type { TripPreferences } from './types'

// API Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001'
const DEMO_USER_ID = 'demo-user'

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': DEMO_USER_ID // For demo purposes, using a fixed user ID
  }
})

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  details?: any
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

export interface CreateTripRequest {
  title?: string
  description?: string
  preferences: TripPreferences
}

// Trip API Functions
export const tripApi = {
  // Create a new trip
  async createTrip(data: CreateTripRequest): Promise<Trip> {
    try {
      const response: AxiosResponse<ApiResponse<Trip>> = await api.post('/trips', data)

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to create trip')
      }

      return {
        ...response.data.data,
        start_date: new Date(response.data.data.start_date),
        end_date: new Date(response.data.data.end_date),
        created_at: new Date(response.data.data.created_at),
        updated_at: new Date(response.data.data.updated_at)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message
        throw new Error(`Failed to create trip: ${errorMessage}`)
      }
      throw error
    }
  },

  // Get user's trips
  async getUserTrips(): Promise<Trip[]> {
    try {
      const response: AxiosResponse<ApiResponse<Trip[]>> = await api.get('/trips')

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to fetch trips')
      }

      return response.data.data.map(trip => ({
        ...trip,
        start_date: new Date(trip.start_date),
        end_date: new Date(trip.end_date),
        created_at: new Date(trip.created_at),
        updated_at: new Date(trip.updated_at)
      }))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message
        throw new Error(`Failed to fetch trips: ${errorMessage}`)
      }
      throw error
    }
  },

  // Get specific trip
  async getTripById(tripId: string): Promise<Trip> {
    try {
      const response: AxiosResponse<ApiResponse<Trip>> = await api.get(`/trips/${tripId}`)

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to fetch trip')
      }

      return {
        ...response.data.data,
        start_date: new Date(response.data.data.start_date),
        end_date: new Date(response.data.data.end_date),
        created_at: new Date(response.data.data.created_at),
        updated_at: new Date(response.data.data.updated_at)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message
        throw new Error(`Failed to fetch trip: ${errorMessage}`)
      }
      throw error
    }
  },

  // Update trip
  async updateTrip(tripId: string, data: Partial<Trip>): Promise<Trip> {
    try {
      const response: AxiosResponse<ApiResponse<Trip>> = await api.put(`/trips/${tripId}`, data)

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to update trip')
      }

      return {
        ...response.data.data,
        start_date: new Date(response.data.data.start_date),
        end_date: new Date(response.data.data.end_date),
        created_at: new Date(response.data.data.created_at),
        updated_at: new Date(response.data.data.updated_at)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message
        throw new Error(`Failed to update trip: ${errorMessage}`)
      }
      throw error
    }
  },

  // Delete trip
  async deleteTrip(tripId: string): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<never>> = await api.delete(`/trips/${tripId}`)

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete trip')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message
        throw new Error(`Failed to delete trip: ${errorMessage}`)
      }
      throw error
    }
  }
}

// Attraction API (for future implementation)
export const attractionApi = {
  async getAttractions(filters?: {
    categories?: string[]
    prefecture?: string
    budgetRange?: string
  }) {
    try {
      const params = new URLSearchParams()
      if (filters?.categories?.length) {
        params.append('categories', filters.categories.join(','))
      }
      if (filters?.prefecture) {
        params.append('prefecture', filters.prefecture)
      }
      if (filters?.budgetRange) {
        params.append('budgetRange', filters.budgetRange)
      }

      const response = await api.get(`/attractions?${params.toString()}`)

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch attractions')
      }

      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message
        throw new Error(`Failed to fetch attractions: ${errorMessage}`)
      }
      throw error
    }
  },

  async searchAttractions(query: string) {
    try {
      const response = await api.get(`/attractions/search?q=${encodeURIComponent(query)}`)

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to search attractions')
      }

      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message
        throw new Error(`Failed to search attractions: ${errorMessage}`)
      }
      throw error
    }
  }
}

// Health check function
export const healthCheck = async (): Promise<{ status: string; backend_mode: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`)
    return response.data
  } catch (error) {
    throw new Error('Backend is not available')
  }
}
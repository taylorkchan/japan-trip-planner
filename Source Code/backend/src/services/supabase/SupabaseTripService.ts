import { TripService, Trip, CreateTripRequest } from '../../types'
import { SupabaseService } from './SupabaseClient'

export class SupabaseTripService implements TripService {
  private supabase = SupabaseService.getInstance()

  async createTrip(userId: string, data: CreateTripRequest): Promise<Trip> {
    const tripData = {
      user_id: userId,
      title: data.title || `Japan Trip ${new Date(data.preferences.startDate).getFullYear()}`,
      description: data.description || '',
      start_date: data.preferences.startDate,
      end_date: data.preferences.endDate,
      group_size: data.preferences.adults + data.preferences.children + data.preferences.infants,
      adults: data.preferences.adults,
      children: data.preferences.children,
      infants: data.preferences.infants,
      budget_range: data.preferences.budgetRange,
      trip_pace: data.preferences.tripPace,
      preferences: {
        activities: data.preferences.activities,
        accessibilityNeeds: data.preferences.accessibilityNeeds
      },
      status: 'draft' as const
    }

    const { data: trip, error } = await this.supabase
      .from('trips')
      .insert([tripData])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create trip: ${error.message}`)
    }

    return this.mapSupabaseTrip(trip)
  }

  async getUserTrips(userId: string): Promise<Trip[]> {
    const { data: trips, error } = await this.supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch user trips: ${error.message}`)
    }

    return trips?.map(trip => this.mapSupabaseTrip(trip)) || []
  }

  async getTripById(tripId: string, userId: string): Promise<Trip | null> {
    const { data: trip, error } = await this.supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null
      }
      throw new Error(`Failed to fetch trip: ${error.message}`)
    }

    return trip ? this.mapSupabaseTrip(trip) : null
  }

  async updateTrip(tripId: string, userId: string, data: Partial<Trip>): Promise<Trip> {
    const { data: trip, error } = await this.supabase
      .from('trips')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', tripId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update trip: ${error.message}`)
    }

    return this.mapSupabaseTrip(trip)
  }

  async deleteTrip(tripId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('trips')
      .delete()
      .eq('id', tripId)
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Failed to delete trip: ${error.message}`)
    }
  }

  private mapSupabaseTrip(trip: any): Trip {
    return {
      id: trip.id,
      user_id: trip.user_id,
      title: trip.title,
      description: trip.description,
      start_date: new Date(trip.start_date),
      end_date: new Date(trip.end_date),
      group_size: trip.group_size,
      adults: trip.adults,
      children: trip.children,
      infants: trip.infants,
      budget_range: trip.budget_range,
      trip_pace: trip.trip_pace,
      preferences: trip.preferences || {},
      status: trip.status,
      created_at: new Date(trip.created_at),
      updated_at: new Date(trip.updated_at)
    }
  }
}
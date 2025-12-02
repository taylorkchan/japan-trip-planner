import { TripService, Trip, CreateTripRequest } from '../../types'
import { DatabaseService } from './PrismaClient'

export class CustomTripService implements TripService {
  private prisma = DatabaseService.getInstance()

  async createTrip(userId: string, data: CreateTripRequest): Promise<Trip> {
    const tripData = {
      userId,
      title: data.title || `Japan Trip ${new Date(data.preferences.startDate).getFullYear()}`,
      description: data.description || '',
      startDate: data.preferences.startDate,
      endDate: data.preferences.endDate,
      groupSize: data.preferences.adults + data.preferences.children + data.preferences.infants,
      adults: data.preferences.adults,
      children: data.preferences.children,
      infants: data.preferences.infants,
      budgetRange: data.preferences.budgetRange,
      tripPace: data.preferences.tripPace,
      preferences: JSON.stringify({
        activities: data.preferences.activities,
        accessibilityNeeds: data.preferences.accessibilityNeeds
      }),
      status: 'draft' as const
    }

    const trip = await this.prisma.trip.create({
      data: tripData
    })

    return this.mapPrismaTrip(trip)
  }

  async getUserTrips(userId: string): Promise<Trip[]> {
    const trips = await this.prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return trips.map(trip => this.mapPrismaTrip(trip))
  }

  async getTripById(tripId: string, userId: string): Promise<Trip | null> {
    const trip = await this.prisma.trip.findFirst({
      where: {
        id: tripId,
        userId
      }
    })

    return trip ? this.mapPrismaTrip(trip) : null
  }

  async updateTrip(tripId: string, userId: string, data: Partial<Trip>): Promise<Trip> {
    const trip = await this.prisma.trip.update({
      where: { id: tripId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })

    return this.mapPrismaTrip(trip)
  }

  async deleteTrip(tripId: string, userId: string): Promise<void> {
    await this.prisma.trip.delete({
      where: {
        id: tripId,
        userId
      }
    })
  }

  private mapPrismaTrip(trip: any): Trip {
    return {
      id: trip.id,
      user_id: trip.userId,
      title: trip.title,
      description: trip.description,
      start_date: trip.startDate,
      end_date: trip.endDate,
      group_size: trip.groupSize,
      adults: trip.adults,
      children: trip.children,
      infants: trip.infants,
      budget_range: trip.budgetRange,
      trip_pace: trip.tripPace,
      preferences: trip.preferences ? JSON.parse(trip.preferences) : {},
      status: trip.status,
      created_at: trip.createdAt,
      updated_at: trip.updatedAt
    }
  }
}
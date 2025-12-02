import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { ServiceFactory } from '../services/ServiceFactory'
import { ApiResponse, CreateTripRequest } from '../types'

const router = Router()
const tripService = ServiceFactory.getTripService()

// Validation schemas
const CreateTripSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  preferences: z.object({
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z.string().transform((str) => new Date(str)),
    adults: z.number().min(1).max(8),
    children: z.number().min(0).max(4),
    infants: z.number().min(0).max(3),
    activities: z.array(z.enum([
      'temples', 'food', 'nightlife', 'shopping',
      'nature', 'culture', 'museums', 'entertainment'
    ])).min(1),
    budgetRange: z.enum(['budget', 'mid-range', 'luxury']),
    tripPace: z.enum(['relaxed', 'moderate', 'packed']),
    accessibilityNeeds: z.array(z.string()).default([])
  })
})

// POST /api/trips/generate - Generate a new trip
router.post('/generate', async (req: Request, res: Response) => {
  try {
    console.log('Received trip generation request:', req.body)

    // Simple trip generation response that matches frontend expectations
    const { startDate, endDate, travelGroup, budget, pace, interests } = req.body

    // Mock generated trip data
    const generatedTrip = {
      id: 'trip_' + Date.now(),
      title: 'Your Japan Adventure',
      description: `A wonderful ${Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}-day trip through Japan`,
      startDate,
      endDate,
      preferences: {
        travelGroup,
        budget,
        pace,
        interests
      },
      days: [
        {
          date: startDate,
          activities: [
            {
              id: 'act_1',
              name: 'Arrival and Tokyo Exploration',
              description: 'Settle in and explore the vibrant streets of Tokyo',
              time: '10:00',
              duration: 180,
              location: { lat: 35.6762, lng: 139.6503 }
            }
          ]
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    res.json({
      success: true,
      data: generatedTrip,
      message: 'Trip generated successfully'
    })

  } catch (error) {
    console.error('Error generating trip:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to generate trip'
    })
  }
})

// POST /api/trips - Create a new trip
router.post('/', async (req: Request, res: Response) => {
  try {
    const validation = CreateTripSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validation.error.issues
      } as ApiResponse<never>)
    }

    // For now, we'll use a mock user ID since authentication isn't implemented yet
    const userId = req.headers['x-user-id'] as string || 'demo-user'

    const tripData: CreateTripRequest = validation.data
    const trip = await tripService.createTrip(userId, tripData)

    res.status(201).json({
      success: true,
      data: trip,
      message: 'Trip created successfully'
    } as ApiResponse<typeof trip>)

  } catch (error) {
    console.error('Error creating trip:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create trip'
    } as ApiResponse<never>)
  }
})

// GET /api/trips - Get user's trips
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'demo-user'
    const trips = await tripService.getUserTrips(userId)

    res.json({
      success: true,
      data: trips
    } as ApiResponse<typeof trips>)

  } catch (error) {
    console.error('Error fetching trips:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trips'
    } as ApiResponse<never>)
  }
})

// GET /api/trips/:id - Get specific trip
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'demo-user'
    const tripId = req.params.id

    const trip = await tripService.getTripById(tripId, userId)

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      } as ApiResponse<never>)
    }

    res.json({
      success: true,
      data: trip
    } as ApiResponse<typeof trip>)

  } catch (error) {
    console.error('Error fetching trip:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trip'
    } as ApiResponse<never>)
  }
})

// PUT /api/trips/:id - Update trip
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'demo-user'
    const tripId = req.params.id

    const trip = await tripService.updateTrip(tripId, userId, req.body)

    res.json({
      success: true,
      data: trip,
      message: 'Trip updated successfully'
    } as ApiResponse<typeof trip>)

  } catch (error) {
    console.error('Error updating trip:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update trip'
    } as ApiResponse<never>)
  }
})

// DELETE /api/trips/:id - Delete trip
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'demo-user'
    const tripId = req.params.id

    await tripService.deleteTrip(tripId, userId)

    res.json({
      success: true,
      message: 'Trip deleted successfully'
    } as ApiResponse<never>)

  } catch (error) {
    console.error('Error deleting trip:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete trip'
    } as ApiResponse<never>)
  }
})

export default router
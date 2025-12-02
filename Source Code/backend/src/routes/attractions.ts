import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { ServiceFactory } from '../services/ServiceFactory'
import { ApiResponse } from '../types'

const router = Router()
const attractionService = ServiceFactory.getAttractionService()

// Validation schemas
const GetAttractionsQuerySchema = z.object({
  categories: z.string().optional().transform((str) =>
    str ? str.split(',') as any : undefined
  ),
  prefecture: z.string().optional(),
  budgetRange: z.string().optional()
})

const SearchAttractionsQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  limit: z.string().optional().transform((str) => str ? parseInt(str) : 20)
})

// GET /api/attractions - Get attractions with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const validation = GetAttractionsQuerySchema.safeParse(req.query)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: validation.error.issues
      } as ApiResponse<never>)
    }

    const { categories, prefecture, budgetRange } = validation.data
    const attractions = await attractionService.getAttractions({
      categories,
      prefecture,
      budgetRange
    })

    res.json({
      success: true,
      data: attractions
    } as ApiResponse<typeof attractions>)

  } catch (error) {
    console.error('Error fetching attractions:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch attractions'
    } as ApiResponse<never>)
  }
})

// GET /api/attractions/search - Search attractions
router.get('/search', async (req: Request, res: Response) => {
  try {
    const validation = SearchAttractionsQuerySchema.safeParse(req.query)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid search parameters',
        details: validation.error.issues
      } as ApiResponse<never>)
    }

    const { q } = validation.data
    const attractions = await attractionService.searchAttractions(q)

    res.json({
      success: true,
      data: attractions
    } as ApiResponse<typeof attractions>)

  } catch (error) {
    console.error('Error searching attractions:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to search attractions'
    } as ApiResponse<never>)
  }
})

// GET /api/attractions/:id - Get specific attraction
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const attractionId = req.params.id
    const attraction = await attractionService.getAttractionById(attractionId)

    if (!attraction) {
      return res.status(404).json({
        success: false,
        error: 'Attraction not found'
      } as ApiResponse<never>)
    }

    res.json({
      success: true,
      data: attraction
    } as ApiResponse<typeof attraction>)

  } catch (error) {
    console.error('Error fetching attraction:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch attraction'
    } as ApiResponse<never>)
  }
})

export default router
import { AttractionService, Attraction, ActivityType } from '../../types'
import { DatabaseService } from './PrismaClient'

export class CustomAttractionService implements AttractionService {
  private prisma = DatabaseService.getInstance()

  async getAttractions(filters?: {
    categories?: ActivityType[]
    prefecture?: string
    budgetRange?: string
  }): Promise<Attraction[]> {
    const where: any = {}

    if (filters?.categories && filters.categories.length > 0) {
      where.category = { in: filters.categories }
    }

    if (filters?.prefecture) {
      where.prefecture = filters.prefecture
    }

    const attractions = await this.prisma.attraction.findMany({
      where,
      orderBy: { popularityScore: 'desc' },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    return attractions.map(attraction => this.mapPrismaAttraction(attraction))
  }

  async getAttractionById(id: string): Promise<Attraction | null> {
    const attraction = await this.prisma.attraction.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    return attraction ? this.mapPrismaAttraction(attraction) : null
  }

  async searchAttractions(query: string): Promise<Attraction[]> {
    const attractions = await this.prisma.attraction.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { locationName: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: { popularityScore: 'desc' },
      take: 20,
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    return attractions.map(attraction => this.mapPrismaAttraction(attraction))
  }

  private mapPrismaAttraction(attraction: any): Attraction {
    return {
      id: attraction.id,
      name: attraction.name,
      name_japanese: attraction.nameJapanese,
      description: attraction.description,
      category: attraction.category as ActivityType,
      subcategory: attraction.subcategory,
      location_name: attraction.locationName,
      prefecture: attraction.prefecture,
      latitude: parseFloat(attraction.latitude.toString()),
      longitude: parseFloat(attraction.longitude.toString()),
      address: attraction.address,
      phone: attraction.phone,
      website: attraction.website,
      opening_hours: attraction.openingHours,
      admission_fee: attraction.admissionFee,
      duration_minutes: attraction.durationMinutes,
      best_visit_time: attraction.bestVisitTime,
      accessibility_features: attraction.accessibilityFeatures || {},
      seasonal_info: attraction.seasonalInfo || {},
      cultural_significance: attraction.culturalSignificance,
      visitor_tips: attraction.visitorTips,
      photo_credits: attraction.photoCredits || [],
      rating: attraction.rating ? parseFloat(attraction.rating.toString()) : undefined,
      review_count: attraction.reviewCount || 0,
      popularity_score: attraction.popularityScore || 0,
      created_at: attraction.createdAt,
      updated_at: attraction.updatedAt
    }
  }
}
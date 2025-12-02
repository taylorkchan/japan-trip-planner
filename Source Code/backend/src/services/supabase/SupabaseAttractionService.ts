import { AttractionService, Attraction, ActivityType } from '../../types'
import { SupabaseService } from './SupabaseClient'

export class SupabaseAttractionService implements AttractionService {
  private supabase = SupabaseService.getInstance()

  async getAttractions(filters?: {
    categories?: ActivityType[]
    prefecture?: string
    budgetRange?: string
  }): Promise<Attraction[]> {
    let query = this.supabase
      .from('attractions')
      .select('*')

    if (filters?.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories)
    }

    if (filters?.prefecture) {
      query = query.eq('prefecture', filters.prefecture)
    }

    query = query.order('popularity_score', { ascending: false })

    const { data: attractions, error } = await query

    if (error) {
      throw new Error(`Failed to fetch attractions: ${error.message}`)
    }

    return attractions?.map(attraction => this.mapSupabaseAttraction(attraction)) || []
  }

  async getAttractionById(id: string): Promise<Attraction | null> {
    const { data: attraction, error } = await this.supabase
      .from('attractions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null
      }
      throw new Error(`Failed to fetch attraction: ${error.message}`)
    }

    return attraction ? this.mapSupabaseAttraction(attraction) : null
  }

  async searchAttractions(query: string): Promise<Attraction[]> {
    const { data: attractions, error } = await this.supabase
      .from('attractions')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,location_name.ilike.%${query}%`)
      .order('popularity_score', { ascending: false })
      .limit(20)

    if (error) {
      throw new Error(`Failed to search attractions: ${error.message}`)
    }

    return attractions?.map(attraction => this.mapSupabaseAttraction(attraction)) || []
  }

  private mapSupabaseAttraction(attraction: any): Attraction {
    return {
      id: attraction.id,
      name: attraction.name,
      name_japanese: attraction.name_japanese,
      description: attraction.description,
      category: attraction.category,
      subcategory: attraction.subcategory,
      location_name: attraction.location_name,
      prefecture: attraction.prefecture,
      latitude: attraction.latitude,
      longitude: attraction.longitude,
      address: attraction.address,
      phone: attraction.phone,
      website: attraction.website,
      opening_hours: attraction.opening_hours,
      admission_fee: attraction.admission_fee,
      duration_minutes: attraction.duration_minutes,
      best_visit_time: attraction.best_visit_time,
      accessibility_features: attraction.accessibility_features || {},
      seasonal_info: attraction.seasonal_info || {},
      cultural_significance: attraction.cultural_significance,
      visitor_tips: attraction.visitor_tips,
      photo_credits: attraction.photo_credits || [],
      rating: attraction.rating,
      review_count: attraction.review_count || 0,
      popularity_score: attraction.popularity_score || 0,
      created_at: new Date(attraction.created_at),
      updated_at: new Date(attraction.updated_at)
    }
  }
}
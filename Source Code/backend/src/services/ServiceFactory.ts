import { TripService, UserService, AttractionService } from '../types'
import { SupabaseTripService } from './supabase/SupabaseTripService'
import { SupabaseUserService } from './supabase/SupabaseUserService'
import { SupabaseAttractionService } from './supabase/SupabaseAttractionService'
import { CustomTripService } from './custom/CustomTripService'
import { CustomUserService } from './custom/CustomUserService'
import { CustomAttractionService } from './custom/CustomAttractionService'

export class ServiceFactory {
  private static useSupabase: boolean = process.env.USE_SUPABASE === 'true'

  static getTripService(): TripService {
    if (this.useSupabase) {
      return new SupabaseTripService()
    }
    return new CustomTripService()
  }

  static getUserService(): UserService {
    if (this.useSupabase) {
      return new SupabaseUserService()
    }
    return new CustomUserService()
  }

  static getAttractionService(): AttractionService {
    if (this.useSupabase) {
      return new SupabaseAttractionService()
    }
    return new CustomAttractionService()
  }

  static isUsingSupabase(): boolean {
    return this.useSupabase
  }

  // Method to switch backend mode (useful for testing)
  static setBackendMode(useSupabase: boolean) {
    this.useSupabase = useSupabase
  }
}
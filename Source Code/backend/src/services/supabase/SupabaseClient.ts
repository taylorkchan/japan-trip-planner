import { createClient, SupabaseClient } from '@supabase/supabase-js'

export class SupabaseService {
  private static instance: SupabaseClient | null = null

  static getInstance(): SupabaseClient {
    if (!this.instance) {
      const supabaseUrl = process.env.SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables')
      }

      this.instance = createClient(supabaseUrl, supabaseKey)
    }

    return this.instance
  }

  static getServiceClient(): SupabaseClient {
    const supabaseUrl = process.env.SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase service role environment variables')
    }

    return createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
}
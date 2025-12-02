import { UserService, User } from '../../types'
import { SupabaseService } from './SupabaseClient'

export class SupabaseUserService implements UserService {
  private supabase = SupabaseService.getInstance()

  async createUser(email: string, fullName?: string): Promise<User> {
    const userData = {
      email,
      full_name: fullName,
      preferences: {}
    }

    const { data: user, error } = await this.supabase
      .from('users')
      .insert([userData])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`)
    }

    return this.mapSupabaseUser(user)
  }

  async getUserById(id: string): Promise<User | null> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null
      }
      throw new Error(`Failed to fetch user: ${error.message}`)
    }

    return user ? this.mapSupabaseUser(user) : null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null
      }
      throw new Error(`Failed to fetch user: ${error.message}`)
    }

    return user ? this.mapSupabaseUser(user) : null
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const { data: user, error } = await this.supabase
      .from('users')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`)
    }

    return this.mapSupabaseUser(user)
  }

  async deleteUser(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`)
    }
  }

  private mapSupabaseUser(user: any): User {
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      preferences: user.preferences || {},
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at)
    }
  }
}
import { UserService, User } from '../../types'
import { DatabaseService } from './PrismaClient'

export class CustomUserService implements UserService {
  private prisma = DatabaseService.getInstance()

  async createUser(email: string, fullName?: string): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email,
        fullName,
        preferences: {}
      }
    })

    return this.mapPrismaUser(user)
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    })

    return user ? this.mapPrismaUser(user) : null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    })

    return user ? this.mapPrismaUser(user) : null
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })

    return this.mapPrismaUser(user)
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    })
  }

  private mapPrismaUser(user: any): User {
    return {
      id: user.id,
      email: user.email,
      full_name: user.fullName,
      avatar_url: user.avatarUrl,
      preferences: user.preferences || {},
      created_at: user.createdAt,
      updated_at: user.updatedAt
    }
  }
}
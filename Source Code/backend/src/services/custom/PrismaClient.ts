import { PrismaClient } from '@prisma/client'

export class DatabaseService {
  private static instance: PrismaClient | null = null

  static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : ['warn', 'error'],
      })
    }

    return this.instance
  }

  static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.$disconnect()
      this.instance = null
    }
  }
}
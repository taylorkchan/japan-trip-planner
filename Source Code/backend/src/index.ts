import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import dotenv from 'dotenv'

// Import routes
import tripRoutes from './routes/trips'
import attractionRoutes from './routes/attractions'
import { ServiceFactory } from './services/ServiceFactory'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(compression())
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'))

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: true
}))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    backend_mode: ServiceFactory.isUsingSupabase() ? 'supabase' : 'custom',
    environment: process.env.NODE_ENV || 'development'
  })
})

// API routes
app.use('/api/trips', tripRoutes)
app.use('/api/attractions', attractionRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  })
})

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  })
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...')

  // Close database connections if using custom backend
  if (!ServiceFactory.isUsingSupabase()) {
    const { DatabaseService } = await import('./services/custom/PrismaClient')
    await DatabaseService.disconnect()
  }

  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...')

  if (!ServiceFactory.isUsingSupabase()) {
    const { DatabaseService } = await import('./services/custom/PrismaClient')
    await DatabaseService.disconnect()
  }

  process.exit(0)
})

app.listen(PORT, () => {
  console.log(`🚀 Japan Trip Planner Backend running on port ${PORT}`)
  console.log(`🔧 Backend mode: ${ServiceFactory.isUsingSupabase() ? 'Supabase' : 'Custom'}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📖 Health check: http://localhost:${PORT}/health`)
})
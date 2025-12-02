# Japan Trip Planner MVP

A full-stack application for planning personalized trips to Japan with interactive features and real-time itinerary management.

## Features

- **Trip Planning**: Customize preferences for dates, budget, pace, and activities
- **Interactive Map**: OpenStreetMap integration with activity pins and route planning
- **Drag & Drop Itinerary**: Reorder activities within and between days
- **Auto-save**: Real-time saving with visual feedback
- **Undo/Redo**: 10-level history for changes
- **Activity Management**: Add, remove, and customize activities
- **Visual Gallery**: Browse attraction images and details
- **Timeline View**: Chronological itinerary overview

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for development
- Tailwind CSS for styling
- Framer Motion for animations
- @dnd-kit for drag and drop
- Zustand for state management

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite database
- Zod for validation

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```
Server runs on http://localhost:3001

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```
Application runs on http://localhost:5175

### Database Setup

The SQLite database is automatically initialized. No additional setup required.

## API Endpoints

- `GET /health` - Health check
- `POST /api/trips` - Create new trip
- `GET /api/trips` - Get user trips
- `GET /api/trips/:id` - Get specific trip

## Environment Configuration

Backend `.env` file:
```
USE_SUPABASE=false
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5175
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=demo_jwt_secret_key_for_development_only
```

## Project Structure

```
Source Code/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── routes/   # API route handlers
│   │   ├── services/ # Business logic
│   │   └── types/    # TypeScript definitions
│   ├── prisma/       # Database schema and migrations
│   └── package.json
└── frontend/         # React application
    ├── src/
    │   ├── components/ # React components
    │   ├── lib/       # Utilities and data
    │   └── App.tsx
    └── package.json
```

## Development Notes

- Frontend uses port 5175 (not 5174 to avoid conflicts)
- Backend uses port 3001
- Database file: `backend/prisma/dev.db`
- CORS configured for development
- Auto-restart enabled for both servers

## Testing

The application has been tested with:
- Trip creation and retrieval
- Interactive map functionality
- Image loading from Unsplash
- Drag and drop interactions
- Database persistence

## Production Deployment

For production:
1. Set `NODE_ENV=production`
2. Configure production database URL
3. Update CORS_ORIGIN for production domain
4. Build frontend: `npm run build`
5. Use process manager (PM2) for backend
import type { Activity, ActivityCatalog, ItineraryData, DayItinerary, TripPreferences } from './types'
import { generateActivityId, getUnsplashImage, calculateTripDuration } from './utils'

// Mock data for activities in Japan
export const mockActivities: Activity[] = [
  {
    id: 'temple-1',
    title: 'Senso-ji Temple',
    description: 'Tokyo\'s oldest temple, featuring traditional architecture and bustling market streets.',
    category: 'temples',
    location: {
      name: 'Senso-ji Temple',
      address: '2-3-1 Asakusa, Taito City, Tokyo',
      coordinates: { lat: 35.7148, lng: 139.7967 },
      prefecture: 'Tokyo',
      city: 'Asakusa'
    },
    duration: 120,
    images: [
      getUnsplashImage('senso-ji temple tokyo'),
      getUnsplashImage('asakusa temple japan'),
      getUnsplashImage('japanese temple traditional architecture'),
    ],
    rating: 4.6,
    price: 0,
    tips: ['Visit early morning to avoid crowds', 'Try traditional snacks at Nakamise Street']
  },
  {
    id: 'temple-2',
    title: 'Kiyomizu-dera Temple',
    description: 'Famous wooden temple in Kyoto offering panoramic city views and seasonal beauty.',
    category: 'temples',
    location: {
      name: 'Kiyomizu-dera Temple',
      address: '1-294 Kiyomizu, Higashiyama Ward, Kyoto',
      coordinates: { lat: 34.9948, lng: 135.7850 },
      prefecture: 'Kyoto',
      city: 'Kyoto'
    },
    duration: 90,
    images: [
      getUnsplashImage('kiyomizu-dera temple kyoto'),
      getUnsplashImage('wooden temple japan'),
      getUnsplashImage('kyoto temple view'),
    ],
    rating: 4.7,
    price: 400,
    tips: ['Best visited during cherry blossom season', 'Wear comfortable walking shoes']
  },
  {
    id: 'food-1',
    title: 'Tsukiji Outer Market Food Tour',
    description: 'Experience fresh sushi, street food, and traditional Japanese breakfast dishes.',
    category: 'food',
    location: {
      name: 'Tsukiji Outer Market',
      address: 'Tsukiji, Chuo City, Tokyo',
      coordinates: { lat: 35.6654, lng: 139.7707 },
      prefecture: 'Tokyo',
      city: 'Tsukiji'
    },
    duration: 180,
    images: [
      getUnsplashImage('tsukiji market sushi'),
      getUnsplashImage('japanese street food'),
      getUnsplashImage('fresh fish market tokyo'),
    ],
    rating: 4.8,
    price: 3500,
    tips: ['Arrive early for freshest fish', 'Bring cash as many vendors don\'t accept cards']
  },
  {
    id: 'food-2',
    title: 'Kaiseki Dining Experience',
    description: 'Traditional multi-course Japanese haute cuisine showcasing seasonal ingredients.',
    category: 'food',
    location: {
      name: 'Kikunoi Restaurant',
      address: '459 Shimogawara-cho, Higashiyama Ward, Kyoto',
      coordinates: { lat: 34.9987, lng: 135.7802 },
      prefecture: 'Kyoto',
      city: 'Kyoto'
    },
    duration: 150,
    images: [
      getUnsplashImage('kaiseki japanese cuisine'),
      getUnsplashImage('traditional japanese dining'),
      getUnsplashImage('japanese fine dining'),
    ],
    rating: 4.9,
    price: 15000,
    tips: ['Reservations required well in advance', 'Dress code applies']
  },
  {
    id: 'shopping-1',
    title: 'Shibuya Crossing & Shopping',
    description: 'Iconic crossing and surrounding shopping districts with fashion, electronics, and souvenirs.',
    category: 'shopping',
    location: {
      name: 'Shibuya Crossing',
      address: 'Shibuya City, Tokyo',
      coordinates: { lat: 35.6598, lng: 139.7006 },
      prefecture: 'Tokyo',
      city: 'Shibuya'
    },
    duration: 240,
    images: [
      getUnsplashImage('shibuya crossing tokyo'),
      getUnsplashImage('tokyo shopping district'),
      getUnsplashImage('japanese street fashion'),
    ],
    rating: 4.5,
    price: 5000,
    tips: ['Visit during evening for best atmosphere', 'Watch crossing from Starbucks overlook']
  },
  {
    id: 'nature-1',
    title: 'Arashiyama Bamboo Grove',
    description: 'Walk through towering bamboo stalks creating a natural green tunnel.',
    category: 'nature',
    location: {
      name: 'Arashiyama Bamboo Grove',
      address: 'Arashiyama, Ukyo Ward, Kyoto',
      coordinates: { lat: 35.0170, lng: 135.6761 },
      prefecture: 'Kyoto',
      city: 'Arashiyama'
    },
    duration: 60,
    images: [
      getUnsplashImage('arashiyama bamboo forest'),
      getUnsplashImage('bamboo grove kyoto'),
      getUnsplashImage('japanese bamboo forest'),
    ],
    rating: 4.4,
    price: 0,
    tips: ['Early morning visits are less crowded', 'Combine with nearby Tenryu-ji Temple']
  },
  {
    id: 'culture-1',
    title: 'Tea Ceremony Experience',
    description: 'Learn the art of Japanese tea ceremony in a traditional tatami room.',
    category: 'culture',
    location: {
      name: 'Urasenke Foundation',
      address: 'Omotesenke, Kamigyo Ward, Kyoto',
      coordinates: { lat: 35.0308, lng: 135.7625 },
      prefecture: 'Kyoto',
      city: 'Kyoto'
    },
    duration: 90,
    images: [
      getUnsplashImage('japanese tea ceremony'),
      getUnsplashImage('traditional tea ceremony'),
      getUnsplashImage('matcha tea japan'),
    ],
    rating: 4.7,
    price: 2500,
    tips: ['Wear comfortable clothes for sitting seiza', 'Learn basic etiquette beforehand']
  },
  {
    id: 'nightlife-1',
    title: 'Golden Gai Bar Hopping',
    description: 'Tiny bars in narrow alleys offering unique atmospheres and local drinks.',
    category: 'nightlife',
    location: {
      name: 'Golden Gai',
      address: '1 Kabukicho, Shinjuku City, Tokyo',
      coordinates: { lat: 35.6938, lng: 139.7034 },
      prefecture: 'Tokyo',
      city: 'Shinjuku'
    },
    duration: 180,
    images: [
      getUnsplashImage('golden gai tokyo bars'),
      getUnsplashImage('tokyo nightlife'),
      getUnsplashImage('japanese izakaya'),
    ],
    rating: 4.3,
    price: 4000,
    tips: ['Some bars charge cover fees', 'Cash only in most establishments']
  }
]

// Organize activities by category
export const activityCatalog: ActivityCatalog = {
  temples: mockActivities.filter(a => a.category === 'temples'),
  food: mockActivities.filter(a => a.category === 'food'),
  nightlife: mockActivities.filter(a => a.category === 'nightlife'),
  shopping: mockActivities.filter(a => a.category === 'shopping'),
  nature: mockActivities.filter(a => a.category === 'nature'),
  culture: mockActivities.filter(a => a.category === 'culture'),
  museums: [],
  entertainment: []
}

// Generate mock itinerary based on preferences
export function generateMockItinerary(preferences: TripPreferences): ItineraryData {
  const tripDuration = calculateTripDuration(preferences.startDate, preferences.endDate)
  const availableActivities = mockActivities.filter(activity =>
    preferences.activities.includes(activity.category)
  )

  const days: DayItinerary[] = []
  const activitiesPerDay = Math.min(4, Math.ceil(availableActivities.length / tripDuration))

  for (let day = 1; day <= tripDuration; day++) {
    const dayActivities = availableActivities
      .slice((day - 1) * activitiesPerDay, day * activitiesPerDay)
      .slice(0, activitiesPerDay)

    const currentDate = new Date(preferences.startDate)
    currentDate.setDate(currentDate.getDate() + day - 1)

    days.push({
      day,
      date: currentDate,
      activities: dayActivities
    })
  }

  const totalCost = days.reduce((total, day) =>
    total + day.activities.reduce((dayTotal, activity) =>
      dayTotal + (activity.price * preferences.travelers), 0
    ), 0
  )

  return {
    id: generateActivityId(),
    tripDuration,
    preferences,
    days,
    totalEstimatedCost: totalCost
  }
}

// Additional mock activities for activity catalog
export const additionalActivities: Activity[] = [
  {
    id: 'museums-1',
    title: 'Tokyo National Museum',
    description: 'Japan\'s largest collection of cultural artifacts and art treasures.',
    category: 'museums',
    location: {
      name: 'Tokyo National Museum',
      address: '13-9 Uenokoen, Taito City, Tokyo',
      coordinates: { lat: 35.7188, lng: 139.7766 },
      prefecture: 'Tokyo',
      city: 'Ueno'
    },
    duration: 120,
    images: [
      getUnsplashImage('tokyo national museum'),
      getUnsplashImage('japanese art museum'),
      getUnsplashImage('cultural artifacts japan'),
    ],
    rating: 4.4,
    price: 1000,
    tips: ['Audio guides available in multiple languages', 'Free entry on International Museum Day']
  },
  {
    id: 'entertainment-1',
    title: 'Robot Restaurant Show',
    description: 'Spectacular robot show with lights, music, and dancing in Shinjuku.',
    category: 'entertainment',
    location: {
      name: 'Robot Restaurant',
      address: '1-7-1 Kabukicho, Shinjuku City, Tokyo',
      coordinates: { lat: 35.6950, lng: 139.7050 },
      prefecture: 'Tokyo',
      city: 'Shinjuku'
    },
    duration: 90,
    images: [
      getUnsplashImage('robot restaurant tokyo'),
      getUnsplashImage('tokyo entertainment show'),
      getUnsplashImage('colorful lights tokyo'),
    ],
    rating: 4.2,
    price: 8000,
    tips: ['Book tickets in advance', 'Arrive 30 minutes early']
  }
]

// Add additional activities to catalog
activityCatalog.museums.push(...additionalActivities.filter(a => a.category === 'museums'))
activityCatalog.entertainment.push(...additionalActivities.filter(a => a.category === 'entertainment'))
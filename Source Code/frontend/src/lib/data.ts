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
    tips: ['Visit early morning to avoid crowds', 'Try traditional snacks at Nakamise Street'],
    culturalSignificance: 'Senso-ji Temple is dedicated to Kannon (Guan Yin), the bodhisattva of compassion. Founded in 628 AD, it represents Tokyo\'s spiritual heart and showcases traditional Buddhist practices in a modern city.',
    historicalContext: 'Established in 628 AD by two fishermen who found a golden statue of Kannon in the Sumida River. Despite being destroyed in WWII, it was rebuilt as a symbol of rebirth and peace. The temple has welcomed visitors for over 1,400 years.',
    accessibilityInfo: 'Wheelchair accessible main hall with ramps. Audio guides available in multiple languages. Large print prayer books provided. Assistance available at information desk.',
    imageAltTexts: [
      'Traditional Japanese temple with red pagoda and temple buildings surrounded by crowds of visitors',
      'Traditional shopping street Nakamise-dori leading to Senso-ji Temple with red lanterns and souvenir shops',
      'Close-up view of traditional Japanese temple architecture showing intricate wooden details and curved rooflines'
    ],
    bestVisitSeasons: ['Spring for cherry blossoms', 'Fall for autumn colors', 'Winter for illuminations']
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
    tips: ['Best visited during cherry blossom season', 'Wear comfortable walking shoes'],
    culturalSignificance: 'UNESCO World Heritage site representing the pinnacle of Japanese wooden architecture. Famous for its main hall built without using a single nail, symbolizing the harmony between human craftsmanship and natural materials.',
    historicalContext: 'Founded in 778 AD during the early Heian period. The current structures were built in 1633 without using a single nail, showcasing traditional Japanese carpentry techniques. The temple offers prayers for love and success.',
    accessibilityInfo: 'Steep walking paths - wheelchair assistance recommended. Rest areas available throughout the climb. Audio descriptions available for visually impaired visitors.',
    imageAltTexts: [
      'Wooden temple hall jutting out over a hillside with wooden beams supporting a platform overlooking Kyoto cityscape',
      'Traditional Japanese temple with curved rooflines set among green trees on a hillside',
      'Panoramic view from temple platform showing Kyoto city spread below with traditional and modern buildings'
    ],
    bestVisitSeasons: ['Spring for cherry blossoms', 'Fall for maple leaves', 'Winter for snow views']
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
    tips: ['Arrive early for freshest fish', 'Bring cash as many vendors don\'t accept cards'],
    culturalSignificance: 'Heart of Tokyo\'s food culture where traditional wholesale practices meet culinary innovation. Represents the Japanese values of freshness, quality, and respect for ingredients.',
    historicalContext: 'The outer market has served Tokyo since 1935, originally supporting the inner wholesale market. Though the inner market moved to Toyosu, the outer market continues its 80+ year tradition of serving the finest Japanese cuisine.',
    accessibilityInfo: 'Crowded narrow alleys - wheelchair access limited. Assistance available at main entrances. Many food stalls have picture menus for language assistance.',
    imageAltTexts: [
      'Fresh sushi and sashimi displayed at market stall with chef preparing fish behind counter',
      'Crowded street food market with vendors selling traditional Japanese dishes and snacks',
      'Fresh seafood market display with various types of fish and marine products on ice'
    ],
    bestVisitSeasons: ['Year-round', 'Winter for best tuna', 'Spring for seasonal specialties']
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

  const totalTravelers = preferences.adults + preferences.children + preferences.infants
  const totalCost = days.reduce((total, day) =>
    total + day.activities.reduce((dayTotal, activity) =>
      dayTotal + (activity.price * totalTravelers), 0
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
import type { ActivityType } from './types'

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: Date | string): string {
  // Handle both Date objects and date strings
  const dateObj = date instanceof Date ? date : new Date(date)

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to formatDate:', date)
    return 'Invalid Date'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(dateObj)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  return `${hours}h ${remainingMinutes}m`
}

export function getActivityIcon(category: ActivityType): string {
  const iconMap: Record<ActivityType, string> = {
    temples: 'Shrine',
    food: 'UtensilsCrossed',
    nightlife: 'Music',
    shopping: 'ShoppingBag',
    nature: 'TreePine',
    culture: 'Palette',
    museums: 'Building',
    entertainment: 'Ticket'
  }
  return iconMap[category]
}

export function getActivityColor(category: ActivityType): string {
  const colorMap: Record<ActivityType, string> = {
    temples: 'bg-purple-100 text-purple-700',
    food: 'bg-orange-100 text-orange-700',
    nightlife: 'bg-pink-100 text-pink-700',
    shopping: 'bg-blue-100 text-blue-700',
    nature: 'bg-green-100 text-green-700',
    culture: 'bg-indigo-100 text-indigo-700',
    museums: 'bg-yellow-100 text-yellow-700',
    entertainment: 'bg-red-100 text-red-700'
  }
  return colorMap[category]
}

export function calculateTripDuration(startDate: Date | string, endDate: Date | string): number {
  // Handle both string and Date inputs
  const start = startDate instanceof Date ? startDate : new Date(startDate)
  const end = endDate instanceof Date ? endDate : new Date(endDate)

  // Validate that we have valid dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 0
  }

  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function generateActivityId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function getUnsplashImage(query: string, width = 800, height = 600): string {
  // Use a mapping of queries to specific images for better reliability
  const imageMap: { [key: string]: string } = {
    // Temple images
    'senso-ji temple tokyo': 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=600&fit=crop',
    'asakusa temple japan': 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=600&fit=crop',
    'japanese temple traditional architecture': 'https://images.unsplash.com/photo-1604608672516-f0a4a33b6b15?w=800&h=600&fit=crop',
    'kiyomizu-dera temple kyoto': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop',
    'wooden temple japan': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
    'kyoto temple view': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&h=600&fit=crop',

    // Food images
    'tsukiji market sushi': 'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=800&h=600&fit=crop',
    'japanese street food': 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=800&h=600&fit=crop',
    'fresh fish market tokyo': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    'kaiseki japanese cuisine': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    'traditional japanese dining': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
    'japanese fine dining': 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&h=600&fit=crop',

    // Nature images
    'arashiyama bamboo forest': 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&h=600&fit=crop',
    'bamboo grove kyoto': 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&h=600&fit=crop',
    'japanese bamboo forest': 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=800&h=600&fit=crop',

    // Shopping and urban
    'shibuya crossing tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
    'tokyo shopping district': 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&h=600&fit=crop',
    'japanese street fashion': 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800&h=600&fit=crop',

    // Culture
    'japanese tea ceremony': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop',
    'traditional tea ceremony': 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&h=600&fit=crop',
    'matcha tea japan': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop',

    // Nightlife
    'golden gai tokyo bars': 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&h=600&fit=crop',
    'tokyo nightlife': 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=600&fit=crop',
    'japanese izakaya': 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=800&h=600&fit=crop',

    // Museums and entertainment
    'tokyo national museum': 'https://images.unsplash.com/photo-1594736797933-d0402ba786a6?w=800&h=600&fit=crop',
    'japanese art museum': 'https://images.unsplash.com/photo-1580121441575-41bcb5c6b47c?w=800&h=600&fit=crop',
    'cultural artifacts japan': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    'robot restaurant tokyo': 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&h=600&fit=crop',
    'tokyo entertainment show': 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=600&fit=crop',
    'colorful lights tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop'
  }

  // Return mapped image or fallback to a generic Japan image
  return imageMap[query] || `https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=${width}&h=${height}&fit=crop`
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}
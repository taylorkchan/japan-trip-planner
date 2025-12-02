import type { ActivityType } from './types'

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
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

export function calculateTripDuration(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function generateActivityId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function getUnsplashImage(query: string, width = 800, height = 600): string {
  const searchQuery = encodeURIComponent(query)
  return `https://source.unsplash.com/${width}x${height}/?${searchQuery}`
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
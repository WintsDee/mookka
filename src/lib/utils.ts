import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a localized string
 * @param date The date to format
 * @param formatStr Optional format string (defaults to 'dd/MM/yyyy')
 * @returns Formatted date string
 */
export function formatDate(date: Date, formatStr: string = 'dd/MM/yyyy'): string {
  try {
    return format(date, formatStr)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Date invalide'
  }
}

/**
 * Utility function for consistent overlay gradients
 * @param direction Direction of the gradient: 'to-top', 'to-bottom', 'to-right', 'to-left'
 * @param intensity Intensity level: 'light', 'medium', 'strong'
 * @returns Tailwind classes for a consistent overlay gradient
 */
export function overlayGradient(direction: 'to-top' | 'to-bottom' | 'to-right' | 'to-left' = 'to-top', 
                               intensity: 'light' | 'medium' | 'strong' = 'medium') {
  const directionMap = {
    'to-top': 'bg-gradient-to-t',
    'to-bottom': 'bg-gradient-to-b',
    'to-right': 'bg-gradient-to-r',
    'to-left': 'bg-gradient-to-l'
  }
  
  const intensityMap = {
    'light': {
      from: 'from-background/70',
      via: 'via-background/40',
      to: 'to-transparent'
    },
    'medium': {
      from: 'from-background/90',
      via: 'via-background/60',
      to: 'to-transparent'
    },
    'strong': {
      from: 'from-background',
      via: 'via-background/80',
      to: 'to-transparent'
    }
  }
  
  return cn(
    'absolute inset-0',
    directionMap[direction],
    intensityMap[intensity].from,
    intensityMap[intensity].via,
    intensityMap[intensity].to
  )
}

/**
 * Utility function for consistent text visibility enhancement
 * @param level Enhancement level: 'subtle', 'medium', 'strong'
 * @returns Tailwind classes for consistent text visibility
 */
export function enhanceTextVisibility(level: 'subtle' | 'medium' | 'strong' = 'medium') {
  switch (level) {
    case 'subtle':
      return 'drop-shadow-sm text-white/90'
    case 'medium':
      return 'drop-shadow-md text-white'
    case 'strong':
      return 'drop-shadow-lg text-white font-medium'
    default:
      return 'drop-shadow-md text-white'
  }
}

/**
 * Utility function for consistent floating UI element styling (like buttons, badges)
 * @param type Element type: 'button', 'badge', 'card'
 * @param prominence Prominence level: 'low', 'medium', 'high'
 * @returns Tailwind classes for consistent floating element styling
 */
export function floatingElement(type: 'button' | 'badge' | 'card' = 'button', 
                               prominence: 'low' | 'medium' | 'high' = 'medium') {
  const baseClasses = {
    'button': 'rounded-full transition-all duration-300 ease-in-out',
    'badge': 'rounded-md border transition-all duration-200',
    'card': 'rounded-lg border shadow-sm transition-all duration-300'
  }
  
  const prominenceMap = {
    'low': {
      'button': 'bg-black/40 hover:bg-black/50 backdrop-blur-sm shadow-sm',
      'badge': 'bg-black/20 border-white/20 text-white/80',
      'card': 'bg-black/30 backdrop-blur-sm border-white/10'
    },
    'medium': {
      'button': 'bg-black/60 hover:bg-black/70 backdrop-blur-sm shadow-md',
      'badge': 'bg-black/30 border-white/30 text-white/90',
      'card': 'bg-black/40 backdrop-blur-md border-white/20'
    },
    'high': {
      'button': 'bg-black/80 hover:bg-black/90 backdrop-blur-md shadow-lg',
      'badge': 'bg-black/40 border-white/40 text-white',
      'card': 'bg-black/50 backdrop-blur-lg border-white/30'
    }
  }
  
  return cn(
    baseClasses[type],
    prominenceMap[prominence][type]
  )
}


import { FilterableMedia } from './types';

/**
 * Filter media items by their rating
 */
export function filterByRating<T extends FilterableMedia>(
  mediaList: T[], 
  options: { 
    minRating?: number; 
    maxRating?: number; 
  } = {}
): T[] {
  if (!mediaList || !Array.isArray(mediaList)) return [];
  
  const { minRating = 0, maxRating = 10 } = options;
  
  return mediaList.filter(media => {
    // Skip items without a rating
    if (media.rating === undefined || media.rating === null) return true;
    
    const rating = typeof media.rating === 'string' ? parseFloat(media.rating) : media.rating;
    
    return rating >= minRating && rating <= maxRating;
  });
}

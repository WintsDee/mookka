
import { ContentFilterOptions, FilterableMedia } from './types';
import { filterByKeywords } from './keyword-filter';
import { filterByRating } from './rating-filter';
import { filterByAgeRestriction } from './age-restriction-filter';

/**
 * Apply multiple content filters at once
 */
export function filterByContent<T extends FilterableMedia>(
  mediaList: T[],
  options: ContentFilterOptions = {}
): T[] {
  if (!mediaList || !Array.isArray(mediaList)) return [];
  
  let filteredList = [...mediaList];
  
  // Apply age restriction filter if specified
  if (options.contentRating) {
    filteredList = filterByAgeRestriction(filteredList, options.contentRating);
  }
  
  // Apply rating filter if specified
  if (options.minRating !== undefined || options.maxRating !== undefined) {
    filteredList = filterByRating(filteredList, {
      minRating: options.minRating,
      maxRating: options.maxRating
    });
  }
  
  // Apply keyword filters if specified
  if (options.includeKeywords || options.excludeKeywords) {
    filteredList = filterByKeywords(filteredList, {
      includeKeywords: options.includeKeywords,
      excludeKeywords: options.excludeKeywords
    });
  }
  
  // Apply genre filters if specified
  if (options.includeGenres || options.excludeGenres) {
    filteredList = filteredList.filter(media => {
      const genres = media.genres || [];
      
      // Convert to lowercase array for consistent comparison
      const itemGenres = Array.isArray(genres) 
        ? genres.map(g => typeof g === 'string' ? g.toLowerCase() : String(g).toLowerCase())
        : String(genres).toLowerCase().split(',').map(g => g.trim());
      
      // If there are genres to include, media must have at least one
      if (options.includeGenres && options.includeGenres.length > 0) {
        const hasIncludedGenre = options.includeGenres.some(genre => 
          itemGenres.some(g => g.includes(genre.toLowerCase()))
        );
        
        if (!hasIncludedGenre) return false;
      }
      
      // If there are genres to exclude, media must not have any
      if (options.excludeGenres && options.excludeGenres.length > 0) {
        const hasExcludedGenre = options.excludeGenres.some(genre => 
          itemGenres.some(g => g.includes(genre.toLowerCase()))
        );
        
        if (hasExcludedGenre) return false;
      }
      
      return true;
    });
  }
  
  return filteredList;
}


/**
 * Content rating enum for filtering
 */
export type ContentRating = 'all' | 'teens' | 'adults' | 'strict';

/**
 * Interface for filterable media content
 */
export interface FilterableMedia {
  title?: string;
  description?: string;
  genres?: string[] | null;
  type?: string;
  rating?: number;
  [key: string]: any;
}

/**
 * Filter options for content filtering
 */
export interface ContentFilterOptions {
  contentRating?: ContentRating;
  includeExplicit?: boolean;
  minRating?: number;
  maxRating?: number;
  includeGenres?: string[];
  excludeGenres?: string[];
  includeKeywords?: string[];
  excludeKeywords?: string[];
}

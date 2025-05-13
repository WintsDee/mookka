
import { FilterableMedia } from './types';
import { filterByKeywords } from './keyword-filter';
import { contentKeywords } from './filter-keywords';

/**
 * Filter out adult content from media results
 */
export function filterAdultContent<T extends FilterableMedia>(mediaList: T[]): T[] {
  if (!mediaList || !Array.isArray(mediaList)) return [];
  
  return filterByKeywords(mediaList, {
    excludeKeywords: contentKeywords.adult
  });
}

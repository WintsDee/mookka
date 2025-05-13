
import { FilterableMedia } from './types';
import { extractTextContent } from './filter-keywords';

/**
 * Filter media items by included or excluded keywords
 */
export function filterByKeywords<T extends FilterableMedia>(
  mediaList: T[], 
  options: { 
    includeKeywords?: string[],
    excludeKeywords?: string[] 
  }
): T[] {
  if (!mediaList || !Array.isArray(mediaList)) return [];
  
  const { includeKeywords, excludeKeywords } = options;
  
  return mediaList.filter(media => {
    const contentText = extractTextContent(media);
    
    // If there are keywords to include, media must have at least one
    if (includeKeywords && includeKeywords.length > 0) {
      const hasIncludedKeyword = includeKeywords.some(keyword => 
        contentText.includes(keyword.toLowerCase())
      );
      
      if (!hasIncludedKeyword) return false;
    }
    
    // If there are keywords to exclude, media must not have any
    if (excludeKeywords && excludeKeywords.length > 0) {
      const hasExcludedKeyword = excludeKeywords.some(keyword => 
        contentText.includes(keyword.toLowerCase())
      );
      
      if (hasExcludedKeyword) return false;
    }
    
    return true;
  });
}

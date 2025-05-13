
import { ContentRating, FilterableMedia } from './types';
import { filterByKeywords } from './keyword-filter';
import { contentKeywords } from './filter-keywords';

/**
 * Filter media items based on age-appropriate content
 */
export function filterByAgeRestriction<T extends FilterableMedia>(
  mediaList: T[],
  contentRating: ContentRating = 'teens'
): T[] {
  if (!mediaList || !Array.isArray(mediaList)) return [];
  
  switch (contentRating) {
    case 'strict':
      // Filter out adult, violence, horror, drugs, profanity, disturbing content
      return filterByKeywords(mediaList, {
        excludeKeywords: [
          ...contentKeywords.adult,
          ...contentKeywords.violence,
          ...contentKeywords.horror,
          ...contentKeywords.drugs,
          ...contentKeywords.profanity,
          ...contentKeywords.disturbing,
          ...contentKeywords.selfHarm
        ]
      });
      
    case 'teens':
      // Filter out adult content and extreme violence
      return filterByKeywords(mediaList, {
        excludeKeywords: [
          ...contentKeywords.adult,
          ...contentKeywords.selfHarm
        ]
      });
      
    case 'adults':
      // Filter only adult content
      return filterByKeywords(mediaList, {
        excludeKeywords: contentKeywords.adult
      });
      
    case 'all':
    default:
      // No filtering
      return mediaList;
  }
}

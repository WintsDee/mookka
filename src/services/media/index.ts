
// Re-export all media service functions from their specialized modules
export { searchMedia, getMediaById } from './search/index';
export {
  addMediaToLibrary,
  getUserMediaLibrary,
  updateMediaStatus,
  removeMediaFromLibrary,
  updateMediaNotes
} from './operations';
export { 
  filterAdultContent,
  filterByRating,
  filterByAgeRestriction,
  filterByContent,
  filterByKeywords,
  contentKeywords,
  extractTextContent,
} from './filters';
// Re-export types with proper 'export type' syntax
export type { ContentRating, ContentFilterOptions, FilterableMedia } from './filters';
export { getSocialShareSettings, updateSocialShareSettings } from './social-service';

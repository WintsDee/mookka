
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
  filterByKeywords
} from './filters';
export { getSocialShareSettings, updateSocialShareSettings } from './social-service';

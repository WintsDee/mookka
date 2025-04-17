
// Re-export all media service functions from their specialized modules
export { searchMedia, getMediaById } from './search-service';
export { 
  addMediaToLibrary,
  getUserMediaLibrary,
  updateMediaStatus,
  removeMediaFromLibrary,
  updateMediaRating,
  getMediaRating,
  isMediaInLibrary
} from './library-service';
export { filterAdultContent } from './filters';
export { 
  formatLibraryMedia,
  formatBookSearchResult,
  formatFilmSearchResult,
  formatGameSearchResult,
  formatSerieSearchResult
} from './formatters';
export { getSocialShareSettings, updateSocialShareSettings } from './social-service';

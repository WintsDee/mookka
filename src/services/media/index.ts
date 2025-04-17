
// Re-export all media service functions from their specialized modules
export { searchMedia, getMediaById } from './search-service';

// Import et re-export les fonctions de la librairie
import {
  addMediaToLibrary,
  getUserMediaLibrary,
  updateMediaStatus,
  removeMediaFromLibrary,
  getMediaRating,
  isMediaInLibrary
} from './library-service';

// Import la fonction updateMediaRating depuis library-service.ts
import { updateMediaRating } from './library-service';

// Re-export les fonctions
export {
  addMediaToLibrary,
  getUserMediaLibrary,
  updateMediaStatus,
  removeMediaFromLibrary,
  updateMediaRating,
  getMediaRating,
  isMediaInLibrary
};

export { filterAdultContent } from './filters';
export { 
  formatLibraryMedia,
  formatBookSearchResult,
  formatFilmSearchResult,
  formatGameSearchResult,
  formatSerieSearchResult
} from './formatters';
export { getSocialShareSettings, updateSocialShareSettings } from './social-service';

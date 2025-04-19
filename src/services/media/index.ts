
// Re-export all media service functions from their specialized modules
export { searchMedia, getMediaById } from './search-service';
export {
  addMediaToLibrary,
  getUserMediaLibrary,
  updateMediaStatus,
  removeMediaFromLibrary
} from './operations';
export { filterAdultContent } from './filters';
export { getSocialShareSettings, updateSocialShareSettings } from './social-service';

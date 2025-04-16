
// Re-export all media service functions from their specialized modules
export { searchMedia, getMediaById } from './search-service';
export { addMediaToLibrary, getUserMediaLibrary, updateMediaStatus, removeMediaFromLibrary } from './library-service';
export { filterAdultContent } from './filters';

// Re-export social services
export * from './social';


// Re-export all media service functions from their specialized modules
export { searchMedia, getMediaById } from './search-service';
export { addMediaToLibrary, getUserMediaLibrary, updateMediaStatus, removeMediaFromLibrary } from './library-service';
export { filterAdultContent } from './filters';
export { getSocialShareSettings, updateSocialShareSettings } from './social-service';
export { fetchDiscoverySections, fetchTrendingMedia, fetchUpcomingMedia, fetchRecommendedMedia } from './discovery-service';
export type { DiscoverySection } from './discovery-service';

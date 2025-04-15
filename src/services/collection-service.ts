
// Central export file that re-exports all collection-related functionality

// User collections
export { 
  getMyCollections,
  getFollowedCollections,
  getCollectionsForMedia 
} from './collections/user-collections';

// Public collections
export { 
  getPublicCollections 
} from './collections/public-collections';

// Collection CRUD operations
export { 
  createCollection,
  updateCollection,
  deleteCollection 
} from './collections/collection-crud';

// Collection items operations
export { 
  addMediaToCollection,
  removeMediaFromCollection
} from './collections/collection-items';

// Collection retrieval
export {
  getCollectionById
} from './collections/collection-retrieval';

// Social features (follow/unfollow)
export { 
  followCollection,
  unfollowCollection 
} from './collections/collection-social';


import { User, Media } from ".";

export type CollectionType = 'thematic' | 'ranking' | 'selection';
export type CollectionVisibility = 'private' | 'public' | 'collaborative';
export type ContributorRole = 'editor' | 'viewer';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  type: CollectionType;
  visibility: CollectionVisibility;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  itemCount?: number;
  ownerUsername?: string;
  ownerAvatar?: string | null;
  items?: Media[];
  owner?: User;
}

export interface CollectionItem {
  id: string;
  collectionId: string;
  mediaId: string;
  position: number;
  addedAt: string;
  addedBy?: string;
  media?: Media;
}

export interface CollectionContributor {
  id: string;
  collectionId: string;
  userId: string;
  role: ContributorRole;
  addedAt: string;
  user?: User;
}

export interface CollectionFollower {
  id: string;
  collectionId: string;
  userId: string;
  followedAt: string;
  user?: User;
}

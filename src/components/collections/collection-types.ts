
import { Collection, CollectionType, CollectionVisibility } from "@/types/collection";

export interface CollectionData {
  id: string;
  name: string;
  description: string;
  cover_image: string;
  type: string;
  visibility: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  items_count?: { count: number }[];
  profile?: {
    username?: string;
    avatar_url?: string;
  };
}

export interface CollectionItemData {
  id: string;
  collection_id: string;
  media_id: string;
  position: number;
  added_at: string;
  added_by: string;
  media?: any;
}

export interface CollectionFollowerData {
  id: string;
  collection_id: string;
  user_id: string;
  followed_at: string;
}

export function mapCollectionFromDB(data: CollectionData): Collection {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    coverImage: data.cover_image,
    type: data.type as CollectionType,
    visibility: data.visibility as CollectionVisibility,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    ownerId: data.owner_id,
    itemCount: data.items_count?.[0]?.count ?? 0,
    ownerUsername: data.profile?.username || 'Utilisateur',
    ownerAvatar: data.profile?.avatar_url || null
  };
}

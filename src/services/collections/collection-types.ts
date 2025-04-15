
import { Collection, CollectionType, CollectionVisibility } from "@/types/collection";

export interface CollectionData {
  id: string;
  name: string;
  description: string;
  cover_image: string;
  type: string; // Changed from CollectionType to string to match DB response
  visibility: string; // Changed from CollectionVisibility to string to match DB response
  created_at: string;
  updated_at: string;
  owner_id: string;
  items_count?: { count: number }[];
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
    type: data.type as CollectionType, // Cast string to CollectionType
    visibility: data.visibility as CollectionVisibility, // Cast string to CollectionVisibility
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    ownerId: data.owner_id,
    itemCount: data.items_count?.[0]?.count ?? 0
  };
}

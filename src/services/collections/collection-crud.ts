
import { supabase } from "@/integrations/supabase/client";
import { Collection, CollectionType, CollectionVisibility } from "@/types/collection";
import { mapCollectionFromDB } from "./collection-types";

export async function createCollection(collectionData: Partial<Collection>): Promise<Collection> {
  const { data, error } = await supabase
    .from('collections')
    .insert({
      name: collectionData.name,
      description: collectionData.description || '',
      cover_image: collectionData.coverImage,
      type: collectionData.type || 'thematic',
      visibility: collectionData.visibility || 'private',
      owner_id: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();

  if (error) throw error;
  
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
    itemCount: 0
  };
}

export async function updateCollection(id: string, collectionData: Partial<Collection>): Promise<Collection> {
  const { data, error } = await supabase
    .from('collections')
    .update({
      name: collectionData.name,
      description: collectionData.description,
      cover_image: collectionData.coverImage,
      type: collectionData.type,
      visibility: collectionData.visibility
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    coverImage: data.cover_image,
    type: data.type as CollectionType,
    visibility: data.visibility as CollectionVisibility,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    ownerId: data.owner_id
  };
}

export async function deleteCollection(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  return true;
}


import { supabase } from "@/integrations/supabase/client";
import { Collection, CollectionItem, CollectionType, CollectionVisibility } from "@/types/collection";
import { Media } from "@/types";

export async function getMyCollections() {
  const { data, error } = await supabase
    .from('collections')
    .select(`
      *,
      items_count:collection_items(count)
    `)
    .eq('owner_id', (await supabase.auth.getUser()).data.user?.id)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  // Format the data to match our types
  return data.map(collection => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    coverImage: collection.cover_image,
    type: collection.type as CollectionType,
    visibility: collection.visibility as CollectionVisibility,
    createdAt: collection.created_at,
    updatedAt: collection.updated_at,
    ownerId: collection.owner_id,
    itemCount: collection.items_count?.[0]?.count || 0
  }));
}

export async function getPublicCollections() {
  const { data, error } = await supabase
    .from('collections')
    .select(`
      *,
      items_count:collection_items(count)
    `)
    .in('visibility', ['public', 'collaborative'])
    .order('updated_at', { ascending: false });

  if (error) throw error;

  // Format the data to match our types
  return data.map(collection => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    coverImage: collection.cover_image,
    type: collection.type as CollectionType,
    visibility: collection.visibility as CollectionVisibility,
    createdAt: collection.created_at,
    updatedAt: collection.updated_at,
    ownerId: collection.owner_id,
    itemCount: collection.items_count?.[0]?.count || 0
  }));
}

export async function getFollowedCollections() {
  const { data, error } = await supabase
    .from('collection_followers')
    .select(`
      *,
      collection:collections(*)
    `)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

  if (error) throw error;

  // Format the data to match our types
  return data.map(follower => ({
    id: follower.collection.id,
    name: follower.collection.name,
    description: follower.collection.description,
    coverImage: follower.collection.cover_image,
    type: follower.collection.type as CollectionType,
    visibility: follower.collection.visibility as CollectionVisibility,
    createdAt: follower.collection.created_at,
    updatedAt: follower.collection.updated_at,
    ownerId: follower.collection.owner_id
  }));
}

export async function getCollectionById(id: string) {
  const { data, error } = await supabase
    .from('collections')
    .select(`
      *,
      items:collection_items(
        *,
        media(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  // Format the data to match our types
  const collection: Collection = {
    id: data.id,
    name: data.name,
    description: data.description,
    coverImage: data.cover_image,
    type: data.type as CollectionType,
    visibility: data.visibility as CollectionVisibility,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    ownerId: data.owner_id,
    itemCount: data.items?.length || 0
  };

  const items: CollectionItem[] = data.items.map(item => ({
    id: item.id,
    collectionId: item.collection_id,
    mediaId: item.media_id,
    position: item.position,
    addedAt: item.added_at,
    addedBy: item.added_by,
    media: {
      id: item.media.id,
      title: item.media.title,
      type: item.media.type,
      coverImage: item.media.cover_image,
      year: item.media.year,
      rating: item.media.rating,
      genres: item.media.genres,
      description: item.media.description,
      status: item.media?.status || 'to-watch',
      duration: item.media.duration,
      director: item.media.director,
      author: item.media.author,
      publisher: item.media.publisher,
      platform: item.media.platform
    }
  }));

  return { collection, items };
}

export async function createCollection(collectionData: Partial<Collection>) {
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

export async function updateCollection(id: string, collectionData: Partial<Collection>) {
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

export async function deleteCollection(id: string) {
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  return true;
}

export async function addMediaToCollection(collectionId: string, mediaId: string, position?: number) {
  // Get the current max position if not provided
  let newPosition = position;
  
  if (newPosition === undefined) {
    const { data, error } = await supabase
      .from('collection_items')
      .select('position')
      .eq('collection_id', collectionId)
      .order('position', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    newPosition = data.length > 0 ? data[0].position + 1 : 0;
  }

  const { data, error } = await supabase
    .from('collection_items')
    .insert({
      collection_id: collectionId,
      media_id: mediaId,
      position: newPosition,
      added_by: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    collectionId: data.collection_id,
    mediaId: data.media_id,
    position: data.position,
    addedAt: data.added_at,
    addedBy: data.added_by
  };
}

export async function removeMediaFromCollection(collectionId: string, mediaId: string) {
  const { error } = await supabase
    .from('collection_items')
    .delete()
    .eq('collection_id', collectionId)
    .eq('media_id', mediaId);

  if (error) throw error;
  
  return true;
}

export async function followCollection(collectionId: string) {
  const { data, error } = await supabase
    .from('collection_followers')
    .insert({
      collection_id: collectionId,
      user_id: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    collectionId: data.collection_id,
    userId: data.user_id,
    followedAt: data.followed_at
  };
}

export async function unfollowCollection(collectionId: string) {
  const { error } = await supabase
    .from('collection_followers')
    .delete()
    .eq('collection_id', collectionId)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

  if (error) throw error;
  
  return true;
}

export async function getCollectionsForMedia(mediaId: string) {
  const { data, error } = await supabase
    .from('collection_items')
    .select(`
      *,
      collection:collections(*)
    `)
    .eq('media_id', mediaId);

  if (error) throw error;

  // Format the data to match our types
  return data.map(item => ({
    id: item.collection.id,
    name: item.collection.name,
    description: item.collection.description,
    coverImage: item.collection.cover_image,
    type: item.collection.type as CollectionType,
    visibility: item.collection.visibility as CollectionVisibility,
    createdAt: item.collection.created_at,
    updatedAt: item.collection.updated_at,
    ownerId: item.collection.owner_id
  }));
}

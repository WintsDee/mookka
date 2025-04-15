
import { supabase } from "@/integrations/supabase/client";
import { CollectionItem } from "@/types/collection";
import { Media, MediaType } from "@/types";

export async function addMediaToCollection(
  collectionId: string, 
  mediaId: string, 
  position?: number
): Promise<CollectionItem> {
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

export async function removeMediaFromCollection(
  collectionId: string, 
  mediaId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('collection_items')
    .delete()
    .eq('collection_id', collectionId)
    .eq('media_id', mediaId);

  if (error) throw error;
  
  return true;
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

  const collection = {
    id: data.id,
    name: data.name,
    description: data.description,
    coverImage: data.cover_image,
    type: data.type,
    visibility: data.visibility,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    ownerId: data.owner_id,
    itemCount: data.items?.length || 0
  };

  const items = data.items.map(item => ({
    id: item.id,
    collectionId: item.collection_id,
    mediaId: item.media_id,
    position: item.position,
    addedAt: item.added_at,
    addedBy: item.added_by,
    media: {
      id: item.media.id,
      title: item.media.title,
      type: item.media.type as MediaType,
      coverImage: item.media.cover_image,
      year: item.media.year,
      rating: item.media.rating,
      genres: item.media.genres,
      description: item.media.description,
      status: 'to-watch', // Default value if not present
      duration: item.media.duration,
      director: item.media.director,
      author: item.media.author,
      publisher: item.media.publisher,
      platform: item.media.platform
    }
  }));

  return { collection, items };
}

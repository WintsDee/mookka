
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

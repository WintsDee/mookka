
import { supabase } from "@/integrations/supabase/client";
import { Collection } from "@/types/collection";
import { mapCollectionFromDB, CollectionData } from "./collection-types";
import { Media } from "@/types";

export async function getCollectionById(collectionId: string): Promise<{ collection: Collection; items: Media[] }> {
  // Get collection data
  const { data: collectionData, error: collectionError } = await supabase
    .from('collections')
    .select(`
      *,
      items_count:collection_items(count),
      owner:profiles(username, avatar_url)
    `)
    .eq('id', collectionId)
    .single();

  if (collectionError) throw collectionError;

  // Get collection items with media details
  const { data: itemsData, error: itemsError } = await supabase
    .from('collection_items')
    .select(`
      id, position, added_at, added_by,
      media(*)
    `)
    .eq('collection_id', collectionId)
    .order('position', { ascending: true });

  if (itemsError) throw itemsError;

  // Format the collection items to match the Media type
  const items: Media[] = itemsData.map((item) => {
    const media = item.media;
    
    // Map media to the Media type
    return {
      id: media.id,
      title: media.title,
      type: media.type,
      coverImage: media.cover_image,
      year: media.year,
      description: media.description,
      genres: media.genres,
      director: media.director,
      author: media.author,
      publisher: media.publisher,
      platform: media.platform,
      duration: media.duration,
      rating: media.rating,
      // Don't include status as it's not in the media table
      externalId: media.external_id,
      createdAt: media.created_at,
      ownerId: media.owner_id
    };
  });

  return {
    collection: {
      ...mapCollectionFromDB(collectionData as CollectionData),
      ownerUsername: collectionData.owner?.username || "Unknown",
      ownerAvatar: collectionData.owner?.avatar_url || null
    },
    items
  };
}

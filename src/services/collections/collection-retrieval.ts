
import { supabase } from "@/integrations/supabase/client";
import { Media, MediaType } from "@/types";

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
      status: item.media.status || 'to-watch', // Default value if not present
      duration: item.media.duration,
      director: item.media.director,
      author: item.media.author,
      publisher: item.media.publisher,
      platform: item.media.platform
    }
  }));

  return { collection, items };
}

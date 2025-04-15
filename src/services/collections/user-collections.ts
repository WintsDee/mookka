
import { supabase } from "@/integrations/supabase/client";
import { Collection } from "@/types/collection";
import { mapCollectionFromDB, CollectionData } from "./collection-types";

export async function getMyCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('collections')
    .select(`
      *,
      items_count:collection_items(count)
    `)
    .eq('owner_id', (await supabase.auth.getUser()).data.user?.id)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return data.map(mapCollectionFromDB);
}

export async function getFollowedCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('collection_followers')
    .select(`
      *,
      collection:collections(*)
    `)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

  if (error) throw error;

  return data.map(follower => {
    const collection = follower.collection as CollectionData;
    return mapCollectionFromDB({
      ...collection,
      items_count: [{ count: 0 }]
    });
  });
}

export async function getCollectionsForMedia(mediaId: string): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('collection_items')
    .select(`
      *,
      collection:collections(*)
    `)
    .eq('media_id', mediaId);

  if (error) throw error;

  return data.map(item => {
    const collection = item.collection as CollectionData;
    return mapCollectionFromDB({
      ...collection,
      items_count: undefined
    });
  });
}


import { supabase } from "@/integrations/supabase/client";
import { Collection } from "@/types/collection";
import { mapCollectionFromDB, CollectionData } from "./collection-types";

export async function getMyCollections(): Promise<Collection[]> {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  
  // Si l'utilisateur n'est pas connecté, retourner un tableau vide
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('collections')
    .select(`
      *,
      items_count:collection_items(count)
    `)
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return data.map((item) => mapCollectionFromDB(item as CollectionData));
}

export async function getFollowedCollections(): Promise<Collection[]> {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  
  // Si l'utilisateur n'est pas connecté, retourner un tableau vide
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('collection_followers')
    .select(`
      *,
      collection:collections(*)
    `)
    .eq('user_id', userId);

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
  if (!mediaId) {
    return [];
  }
  
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

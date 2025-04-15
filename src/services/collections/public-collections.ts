
import { supabase } from "@/integrations/supabase/client";
import { Collection } from "@/types/collection";
import { mapCollectionFromDB } from "./collection-types";

export async function getPublicCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('collections')
    .select(`
      *,
      items_count:collection_items(count)
    `)
    .in('visibility', ['public', 'collaborative'])
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return data.map(mapCollectionFromDB);
}


import { supabase } from "@/integrations/supabase/client";

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

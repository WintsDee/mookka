
import { supabase } from "@/integrations/supabase/client";
import { CollectionItem } from "@/types/collection";
import { Media, MediaType } from "@/types";

export async function addMediaToCollection(
  collectionId: string, 
  mediaId: string, 
  position?: number
): Promise<CollectionItem> {
  console.log('Adding media to collection:', { collectionId, mediaId });
  
  try {
    // Vérifier l'authentification
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error('Utilisateur non authentifié');
    }

    let newPosition = position;
    
    if (newPosition === undefined) {
      const { data, error } = await supabase
        .from('collection_items')
        .select('position')
        .eq('collection_id', collectionId)
        .order('position', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error getting position:', error);
        throw new Error(`Erreur lors de la récupération de la position: ${error.message}`);
      }
      
      newPosition = data.length > 0 ? data[0].position + 1 : 0;
    }

    // Vérifier que la collection existe
    const { data: collectionExists, error: collectionError } = await supabase
      .from('collections')
      .select('id')
      .eq('id', collectionId)
      .maybeSingle();

    if (collectionError) {
      console.error('Error checking collection:', collectionError);
      throw new Error(`Erreur lors de la vérification de la collection: ${collectionError.message}`);
    }

    if (!collectionExists) {
      throw new Error('Cette collection n\'existe pas');
    }

    // Vérifier que le média existe dans la table media
    const { data: mediaExists, error: mediaError } = await supabase
      .from('media')
      .select('id')
      .eq('id', mediaId)
      .maybeSingle();

    if (mediaError) {
      console.error('Error checking media existence:', mediaError);
      throw new Error(`Erreur lors de la vérification du média: ${mediaError.message}`);
    }

    if (!mediaExists) {
      throw new Error('Ce média n\'existe pas dans la base de données');
    }

    // Vérifier si le média n'est pas déjà dans la collection
    const { data: existingItem, error: existingError } = await supabase
      .from('collection_items')
      .select('id')
      .eq('collection_id', collectionId)
      .eq('media_id', mediaId)
      .maybeSingle();

    if (existingError) {
      console.error('Error checking existing item:', existingError);
      throw new Error(`Erreur lors de la vérification: ${existingError.message}`);
    }

    if (existingItem) {
      throw new Error('Ce média est déjà dans cette collection');
    }

    const { data, error } = await supabase
      .from('collection_items')
      .insert({
        collection_id: collectionId,
        media_id: mediaId,
        position: newPosition,
        added_by: userData.user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting collection item:', error);
      throw new Error(`Impossible d'ajouter le média à la collection: ${error.message}`);
    }
    
    console.log('Media added successfully:', data);
    
    return {
      id: data.id,
      collectionId: data.collection_id,
      mediaId: data.media_id,
      position: data.position,
      addedAt: data.added_at,
      addedBy: data.added_by
    };
  } catch (error) {
    console.error('Error in addMediaToCollection:', error);
    throw error;
  }
}

export async function removeMediaFromCollection(
  collectionId: string, 
  mediaId: string
): Promise<boolean> {
  console.log('Removing media from collection:', { collectionId, mediaId });
  
  try {
    const { error } = await supabase
      .from('collection_items')
      .delete()
      .eq('collection_id', collectionId)
      .eq('media_id', mediaId);

    if (error) {
      console.error('Error removing media from collection:', error);
      throw new Error(`Impossible de retirer le média de la collection: ${error.message}`);
    }
    
    console.log('Media removed successfully');
    return true;
  } catch (error) {
    console.error('Error in removeMediaFromCollection:', error);
    throw error;
  }
}

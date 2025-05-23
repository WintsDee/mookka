
import { supabase, isAuthError } from "@/integrations/supabase/client";
import { MediaStatus } from "@/types";

interface UpdateMediaParams {
  userId: string;
  mediaId: string;
  status: MediaStatus;
  notes?: string;
  rating?: number;
}

/**
 * Ajoute ou met à jour un média dans la bibliothèque de l'utilisateur
 */
export async function addOrUpdateUserMedia({
  userId, 
  mediaId, 
  status, 
  notes, 
  rating
}: UpdateMediaParams): Promise<void> {
  try {
    // 1. Vérification si déjà dans la bibliothèque
    console.log(`Vérification si l'utilisateur ${userId} a déjà le média ${mediaId} dans sa bibliothèque`);
    
    const { data: existingMedia, error: userMediaCheckError } = await supabase
      .from('user_media')
      .select('id, status, media_id')
      .eq('user_id', userId)
      .eq('media_id', mediaId)
      .maybeSingle();
    
    if (userMediaCheckError) {
      console.error("Error checking user media:", userMediaCheckError);
      throw new Error(`Erreur lors de la vérification de la bibliothèque: ${userMediaCheckError.message}`);
    }
    
    // 2. Ajout ou mise à jour dans la bibliothèque
    if (existingMedia) {
      console.log(`Media ${mediaId} already in library with status: ${existingMedia.status}`);
      
      // Mettre à jour le média existant
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (status) updateData.status = status;
      if (notes !== undefined) updateData.notes = notes || null;
      if (rating !== undefined) updateData.user_rating = rating;
      
      console.log("Updating existing user media:", updateData);
      
      const { error: updateError } = await supabase
        .from('user_media')
        .update(updateData)
        .eq('id', existingMedia.id);
      
      if (updateError) {
        console.error("Error updating user media:", updateError);
        
        if (isAuthError(updateError)) {
          throw new Error("Votre session a expiré. Veuillez vous reconnecter pour continuer.");
        } else {
          throw new Error(`Erreur lors de la mise à jour du média: ${updateError.message}`);
        }
      }
      
      console.log("Media successfully updated");
    } else {
      // Ajouter un nouveau média
      console.log(`Le média ${mediaId} n'est pas dans la bibliothèque, ajout avec statut: ${status}`);
      
      const newMediaData: any = {
        user_id: userId,
        media_id: mediaId,
        status: status,
        added_at: new Date().toISOString()
      };
      
      if (notes !== undefined) newMediaData.notes = notes || null;
      if (rating !== undefined) newMediaData.user_rating = rating;
      
      console.log("Données à insérer:", newMediaData);
      
      const { error: insertError } = await supabase
        .from('user_media')
        .insert(newMediaData);
      
      if (insertError) {
        console.error("Error inserting user media:", insertError);
        
        // Gestion spécifique des erreurs d'insertion
        if (insertError.code === '23505') {
          throw new Error(`Ce média est déjà dans votre bibliothèque`);
        } else if (insertError.code === '23503') {
          throw new Error(`Le média ou l'utilisateur n'existe pas dans la base de données`);
        } else if (isAuthError(insertError)) {
          throw new Error("Session expirée. Veuillez vous reconnecter pour ajouter ce média.");
        } else {
          throw new Error(`Erreur lors de l'ajout du média: ${insertError.message}`);
        }
      }
      
      console.log("Média ajouté avec succès à la bibliothèque");
    }
  } catch (error) {
    console.error("Erreur dans addOrUpdateUserMedia:", error);
    throw error;
  }
}


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
 * Service optimisé pour la gestion des médias utilisateur
 */
export async function addOrUpdateUserMediaOptimized({
  userId, 
  mediaId, 
  status, 
  notes, 
  rating
}: UpdateMediaParams): Promise<void> {
  console.log(`Opération média utilisateur:`, { userId, mediaId, status });

  try {
    // Vérification en une seule requête avec upsert
    const updateData: any = {
      user_id: userId,
      media_id: mediaId,
      status: status,
      updated_at: new Date().toISOString()
    };

    if (notes !== undefined) updateData.notes = notes || null;
    if (rating !== undefined) updateData.user_rating = rating;

    // Upsert optimisé - insert ou update en une seule opération
    const { error } = await supabase
      .from('user_media')
      .upsert(updateData, {
        onConflict: 'user_id,media_id',
        ignoreDuplicates: false
      });

    if (error) {
      console.error("Erreur upsert user_media:", error);
      
      if (error.code === '23514') {
        throw new Error(`Statut invalide: ${status}. Statuts valides: to-watch, watching, completed, abandoned, to-read, reading, to-play, playing`);
      } else if (error.code === '23503') {
        throw new Error('Le média ou l\'utilisateur n\'existe pas');
      } else if (isAuthError(error)) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      } else {
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }
    }

    console.log("Média utilisateur mis à jour avec succès");
  } catch (error) {
    console.error("Erreur dans addOrUpdateUserMediaOptimized:", error);
    throw error;
  }
}

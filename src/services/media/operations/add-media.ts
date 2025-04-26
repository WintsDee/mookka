
import { supabase } from "@/integrations/supabase/client";
import { Media, MediaType, MediaStatus } from "@/types";

interface AddMediaParams {
  mediaId: string;
  mediaType: MediaType;
  status?: MediaStatus;
  notes?: string;
  rating?: number;
}

export async function addMediaToLibrary({
  mediaId,
  mediaType,
  status = 'to-watch',
  notes = '',
  rating
}: AddMediaParams): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    // Adapter le statut en fonction du type de média si aucun n'est spécifié
    let defaultStatus: MediaStatus;
    
    if (!status) {
      switch (mediaType) {
        case 'book':
          defaultStatus = 'to-read';
          break;
        case 'game':
          defaultStatus = 'to-play';
          break;
        case 'film':
        case 'serie':
        default:
          defaultStatus = 'to-watch';
      }
    }
    
    const { error } = await supabase
      .from('user_media')
      .insert({
        user_id: user.user.id,
        media_id: mediaId,
        status: status || defaultStatus,
        notes: notes || null,
        user_rating: rating || null,
        added_at: new Date().toISOString()
      });
      
    if (error) {
      console.error("Erreur lors de l'ajout du média:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erreur dans addMediaToLibrary:", error);
    throw error;
  }
}

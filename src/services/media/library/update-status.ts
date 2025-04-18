
import { supabase } from "@/integrations/supabase/client";
import { MediaStatus } from "@/types";

export async function updateMediaStatus(mediaId: string, status: MediaStatus): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    const { error } = await supabase
      .from('user_media')
      .update({ status })
      .eq('user_id', user.user.id)
      .eq('media_id', mediaId);
      
    if (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erreur dans updateMediaStatus:", error);
    throw error;
  }
}

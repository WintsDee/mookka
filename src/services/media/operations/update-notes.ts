
import { supabase } from "@/integrations/supabase/client";

export async function updateMediaNotes(mediaId: string, notes: string): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    const { error } = await supabase
      .from('user_media')
      .update({ notes })
      .eq('user_id', user.user.id)
      .eq('media_id', mediaId);
      
    if (error) {
      console.error("Erreur lors de la mise à jour des notes:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erreur dans updateMediaNotes:", error);
    throw error;
  }
}

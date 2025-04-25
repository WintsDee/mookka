
import { supabase } from "@/integrations/supabase/client";

export async function addMediaToLibrary(
  mediaId: string, 
  status: string = 'to-watch'
): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    const { error } = await supabase
      .from('user_media')
      .insert({
        user_id: user.user.id,
        media_id: mediaId,
        status,
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

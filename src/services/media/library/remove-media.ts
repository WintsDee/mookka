
import { supabase } from "@/integrations/supabase/client";

export async function removeMediaFromLibrary(mediaId: string): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    const { error } = await supabase
      .from('user_media')
      .delete()
      .eq('user_id', user.user.id)
      .eq('media_id', mediaId);
      
    if (error) {
      console.error("Erreur lors de la suppression du média:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erreur dans removeMediaFromLibrary:", error);
    throw error;
  }
}


import { supabase } from "@/integrations/supabase/client";
import { MediaStatus } from "@/types";

export async function updateMediaStatus(mediaId: string, status: MediaStatus): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    console.log(`Mise à jour du statut pour le média ${mediaId}: ${status}`);
    
    // Vérifier si le média existe dans user_media
    const { data: existingMedia, error: checkError } = await supabase
      .from('user_media')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('media_id', mediaId)
      .maybeSingle();
      
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Erreur lors de la vérification du média:", checkError);
      throw checkError;
    }
    
    if (existingMedia) {
      // Mettre à jour le statut si le média existe déjà
      const { error } = await supabase
        .from('user_media')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.user.id)
        .eq('media_id', mediaId);
        
      if (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
        throw error;
      }
    } else {
      // Ajouter le média avec le statut spécifié s'il n'existe pas encore
      const { error } = await supabase
        .from('user_media')
        .insert({
          user_id: user.user.id,
          media_id: mediaId,
          status,
          added_at: new Date().toISOString()
        });
        
      if (error) {
        console.error("Erreur lors de l'ajout du média avec statut:", error);
        throw error;
      }
    }
    
    // Mettre à jour également le statut dans media_progressions si nécessaire
    const { data: progression } = await supabase
      .from('media_progressions')
      .select('id, progression_data')
      .eq('user_id', user.user.id)
      .eq('media_id', mediaId)
      .maybeSingle();
      
    if (progression) {
      // Vérifier explicitement si progression_data est un objet et utiliser un objet vide comme fallback
      const progressionData = progression.progression_data && 
                             typeof progression.progression_data === 'object' && 
                             progression.progression_data !== null ? 
                             progression.progression_data : {};
      
      const updatedProgressionData = {
        ...progressionData,
        status
      };
      
      await supabase
        .from('media_progressions')
        .update({
          progression_data: updatedProgressionData,
          updated_at: new Date().toISOString()
        })
        .eq('id', progression.id);
    }
    
    console.log(`Statut mis à jour avec succès pour ${mediaId}: ${status}`);
  } catch (error) {
    console.error("Erreur dans updateMediaStatus:", error);
    throw error;
  }
}

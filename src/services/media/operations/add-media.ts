
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
  status,
  notes = '',
  rating
}: AddMediaParams): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    // Adapter le statut par défaut en fonction du type de média si aucun n'est spécifié
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
    
    // Vérifier si le média est déjà dans la bibliothèque
    const { data: existingMedia } = await supabase
      .from('user_media')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('media_id', mediaId)
      .maybeSingle();
    
    if (existingMedia) {
      // Mettre à jour le média existant
      const { error: updateError } = await supabase
        .from('user_media')
        .update({
          status: status || defaultStatus,
          notes: notes || null,
          user_rating: rating || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingMedia.id);
        
      if (updateError) {
        console.error("Erreur lors de la mise à jour du média:", updateError);
        throw updateError;
      }
    } else {
      // Ajouter un nouveau média
      const { error: insertError } = await supabase
        .from('user_media')
        .insert({
          user_id: user.user.id,
          media_id: mediaId,
          status: status || defaultStatus,
          notes: notes || null,
          user_rating: rating || null,
          added_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error("Erreur lors de l'ajout du média:", insertError);
        throw insertError;
      }
    }

    // Mettre à jour également le statut dans media_progressions si nécessaire
    const { data: progression } = await supabase
      .from('media_progressions')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('media_id', mediaId)
      .maybeSingle();
      
    if (progression) {
      // Créer une structure de progression basique
      const progressionData = {
        status: status || defaultStatus,
        notes: notes || ""
      };
      
      await supabase
        .from('media_progressions')
        .update({
          progression_data: progressionData,
          updated_at: new Date().toISOString()
        })
        .eq('id', progression.id);
    }
  } catch (error) {
    console.error("Erreur dans addMediaToLibrary:", error);
    throw error;
  }
}

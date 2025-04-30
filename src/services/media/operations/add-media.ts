
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
    
    console.log(`Ajout/mise à jour du média ${mediaId} avec statut: ${status || defaultStatus}, notes: ${notes}, rating: ${rating}`);
    
    // Vérifier si le média est déjà dans la bibliothèque
    const { data: existingMedia } = await supabase
      .from('user_media')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('media_id', mediaId)
      .maybeSingle();
    
    if (existingMedia) {
      console.log(`Mise à jour du média existant: ${existingMedia.id}`);
      // Créer un objet de mise à jour, en excluant les valeurs null/undefined
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      // N'ajouter les champs que s'ils sont définis
      if (status || defaultStatus) updateData.status = status || defaultStatus;
      if (notes !== undefined) updateData.notes = notes || null;
      if (rating !== undefined) updateData.user_rating = rating !== null ? rating : null;
      
      // Mettre à jour le média existant
      const { error: updateError } = await supabase
        .from('user_media')
        .update(updateData)
        .eq('id', existingMedia.id);
        
      if (updateError) {
        console.error("Erreur lors de la mise à jour du média:", updateError);
        throw updateError;
      }
    } else {
      console.log(`Ajout d'un nouveau média: ${mediaId}`);
      // Ajouter un nouveau média
      const newMediaData: any = {
        user_id: user.user.id,
        media_id: mediaId,
        status: status || defaultStatus,
        added_at: new Date().toISOString()
      };
      
      // N'ajouter les champs que s'ils sont définis
      if (notes !== undefined) newMediaData.notes = notes || null;
      if (rating !== undefined) newMediaData.user_rating = rating !== null ? rating : null;
      
      const { error: insertError } = await supabase
        .from('user_media')
        .insert(newMediaData);
        
      if (insertError) {
        console.error("Erreur lors de l'ajout du média:", insertError);
        throw insertError;
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
      console.log(`Mise à jour de la progression existante: ${progression.id}`);
      // Initialiser progressionData comme un objet vide par défaut
      let progressionData = {};
      
      // Vérifier si progression_data existe et est un objet
      if (progression.progression_data && 
          typeof progression.progression_data === 'object' && 
          progression.progression_data !== null &&
          !Array.isArray(progression.progression_data)) {
        progressionData = { ...progression.progression_data };
      }
      
      // Si c'est un tableau, conversion en objet
      if (Array.isArray(progression.progression_data)) {
        console.warn("progression_data est un tableau, conversion en objet");
        progressionData = {};
      }
      
      // Ajouter les champs nécessaires
      if (status || defaultStatus) {
        (progressionData as any).status = status || defaultStatus;
      }
      
      if (notes !== undefined) {
        (progressionData as any).notes = notes || "";
      }
      
      await supabase
        .from('media_progressions')
        .update({
          progression_data: progressionData,
          updated_at: new Date().toISOString()
        })
        .eq('id', progression.id);
    } else {
      console.log(`Création d'une nouvelle progression pour: ${mediaId}`);
      // Créer une structure de progression basique
      const progressionData: Record<string, any> = {};
      
      // N'ajouter les champs que s'ils sont définis
      if (status || defaultStatus) progressionData.status = status || defaultStatus;
      if (notes !== undefined) progressionData.notes = notes || "";
      
      // Créer une nouvelle entrée de progression
      await supabase
        .from('media_progressions')
        .insert({
          media_id: mediaId,
          user_id: user.user.id,
          progression_data: progressionData
        });
    }
    
    console.log(`Média ${mediaId} ajouté/mis à jour avec succès`);
  } catch (error) {
    console.error("Erreur dans addMediaToLibrary:", error);
    throw error;
  }
}

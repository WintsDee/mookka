
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
    
    console.log(`Ajout/mise à jour du média ${mediaId} avec statut: ${status || defaultStatus}`);
    
    // Étape 1: Vérifier si le média existe déjà dans la table 'media'
    const { data: existingMediaInDb } = await supabase
      .from('media')
      .select('id')
      .eq('id', mediaId)
      .maybeSingle();
    
    // Étape 2: Si le média n'existe pas encore dans la base de données, l'ajouter
    if (!existingMediaInDb) {
      console.log(`Le média ${mediaId} n'existe pas encore dans la base de données, récupération des détails...`);
      
      // Récupérer les informations du média depuis l'API externe
      const mediaFetchResponse = await fetch(`https://dfuawprsisgwyvdtfjvl.supabase.co/functions/v1/fetch-media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: mediaType,
          id: mediaId
        })
      });
      
      if (!mediaFetchResponse.ok) {
        throw new Error(`Erreur lors de la récupération des données du média: ${mediaFetchResponse.statusText}`);
      }
      
      const mediaData = await mediaFetchResponse.json();
      
      if (mediaData && mediaData.id) {
        // Préparer les données pour l'insertion
        const newMediaEntry = {
          id: mediaId,
          title: mediaData.title,
          type: mediaType,
          year: mediaData.year || null,
          description: mediaData.description || null,
          cover_image: mediaData.poster_path || mediaData.cover_image || null,
          genres: Array.isArray(mediaData.genres) ? mediaData.genres : [],
          director: mediaData.director || null,
          author: mediaData.author || (mediaData.authors ? (Array.isArray(mediaData.authors) ? mediaData.authors.join(', ') : mediaData.authors) : null),
          publisher: mediaData.publisher || null,
          platform: mediaData.platform || null,
          rating: mediaData.rating || null,
          external_id: mediaData.external_id || mediaData.id.toString()
        };
        
        await supabase.from('media').insert(newMediaEntry);
      }
    }
    
    // Étape 3: Vérifier si le média est déjà dans la bibliothèque de l'utilisateur
    const { data: existingMedia } = await supabase
      .from('user_media')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('media_id', mediaId)
      .maybeSingle();
    
    // Étape 4: Mettre à jour ou ajouter le média dans la bibliothèque de l'utilisateur
    if (existingMedia) {
      // Mettre à jour le média existant
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (status || defaultStatus) updateData.status = status || defaultStatus;
      if (notes !== undefined) updateData.notes = notes || null;
      if (rating !== undefined) updateData.user_rating = rating !== null ? rating : null;
      
      await supabase
        .from('user_media')
        .update(updateData)
        .eq('id', existingMedia.id);
    } else {
      // Ajouter un nouveau média
      const newMediaData: any = {
        user_id: user.user.id,
        media_id: mediaId,
        status: status || defaultStatus,
        added_at: new Date().toISOString()
      };
      
      if (notes !== undefined) newMediaData.notes = notes || null;
      if (rating !== undefined) newMediaData.user_rating = rating !== null ? rating : null;
      
      await supabase
        .from('user_media')
        .insert(newMediaData);
    }
    
    // Étape 5: Mettre à jour la progression si nécessaire
    const { data: progression } = await supabase
      .from('media_progressions')
      .select('id, progression_data')
      .eq('user_id', user.user.id)
      .eq('media_id', mediaId)
      .maybeSingle();
    
    if (progression) {
      // Initialiser progressionData comme un objet vide par défaut
      let progressionData = {};
      
      if (progression.progression_data && 
          typeof progression.progression_data === 'object' && 
          progression.progression_data !== null &&
          !Array.isArray(progression.progression_data)) {
        progressionData = { ...progression.progression_data };
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
      // Créer une structure de progression basique
      const progressionData: Record<string, any> = {};
      
      if (status || defaultStatus) progressionData.status = status || defaultStatus;
      if (notes !== undefined) progressionData.notes = notes || "";
      
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

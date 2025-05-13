
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
    console.log(`Starting addMediaToLibrary for ${mediaType}/${mediaId} with status: ${status}`);
    
    // Check session and authentication
    const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
    
    if (sessionError) {
      console.error("Authentication error:", sessionError);
      throw new Error("Utilisateur non authentifié - Veuillez vous connecter");
    }
    
    if (!sessionData.user) {
      console.error("No user found in session");
      throw new Error("Utilisateur non connecté - Veuillez vous connecter");
    }
    
    const userId = sessionData.user.id;
    console.log(`User authenticated: ${userId}`);
    
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
    
    const effectiveStatus = status || defaultStatus;
    console.log(`Adding/updating media ${mediaId} with status: ${effectiveStatus}`);
    
    // Étape 1: Vérifier si le média existe déjà dans la table 'media'
    const { data: existingMediaInDb, error: mediaCheckError } = await supabase
      .from('media')
      .select('id')
      .eq('id', mediaId)
      .maybeSingle();
    
    if (mediaCheckError) {
      console.error("Error checking media existence:", mediaCheckError);
      throw new Error("Erreur lors de la vérification du média");
    }
    
    // Étape 2: Si le média n'existe pas encore dans la base de données, l'ajouter
    if (!existingMediaInDb) {
      console.log(`Media ${mediaId} doesn't exist yet, fetching details...`);
      
      try {
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
          console.error(`Error fetching media data: ${mediaFetchResponse.status} - ${mediaFetchResponse.statusText}`);
          const errorText = await mediaFetchResponse.text();
          console.error("Error response:", errorText);
          throw new Error(`Erreur lors de la récupération des données du média (${mediaFetchResponse.status})`);
        }
        
        const mediaData = await mediaFetchResponse.json();
        console.log("Media data fetched:", mediaData);
        
        if (!mediaData || !mediaData.id) {
          console.error("Invalid media data received:", mediaData);
          throw new Error("Données du média invalides");
        }
        
        // Prepare data for insertion
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
        
        console.log("Inserting new media entry:", newMediaEntry);
        
        // Insert the new media
        const { error: insertMediaError } = await supabase.from('media').insert(newMediaEntry);
        
        if (insertMediaError) {
          console.error("Error inserting media:", insertMediaError);
          throw new Error(`Erreur lors de l'ajout du média: ${insertMediaError.message}`);
        }
      } catch (apiError) {
        console.error("API or insert error:", apiError);
        throw new Error(apiError instanceof Error ? apiError.message : "Erreur lors de la récupération des données du média");
      }
    }
    
    // Étape 3: Vérifier si le média est déjà dans la bibliothèque de l'utilisateur
    const { data: existingMedia, error: userMediaCheckError } = await supabase
      .from('user_media')
      .select('id, status')
      .eq('user_id', userId)
      .eq('media_id', mediaId)
      .maybeSingle();
    
    if (userMediaCheckError) {
      console.error("Error checking user media:", userMediaCheckError);
      throw new Error("Erreur lors de la vérification de la bibliothèque");
    }
    
    // Étape 4: Mettre à jour ou ajouter le média dans la bibliothèque de l'utilisateur
    if (existingMedia) {
      // Si le média existe déjà et que le statut est le même, informer l'utilisateur
      if (existingMedia.status === effectiveStatus) {
        console.log(`Media ${mediaId} already in library with the same status: ${effectiveStatus}`);
        throw new Error(`Ce média est déjà dans votre bibliothèque avec le statut "${effectiveStatus}"`);
      }
      
      // Mettre à jour le média existant
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (effectiveStatus) updateData.status = effectiveStatus;
      if (notes !== undefined) updateData.notes = notes || null;
      if (rating !== undefined) updateData.user_rating = rating !== null ? rating : null;
      
      console.log("Updating existing user media:", updateData);
      
      const { error: updateError } = await supabase
        .from('user_media')
        .update(updateData)
        .eq('id', existingMedia.id);
      
      if (updateError) {
        console.error("Error updating user media:", updateError);
        throw new Error(`Erreur lors de la mise à jour du média: ${updateError.message}`);
      }
    } else {
      // Ajouter un nouveau média
      const newMediaData: any = {
        user_id: userId,
        media_id: mediaId,
        status: effectiveStatus,
        added_at: new Date().toISOString()
      };
      
      if (notes !== undefined) newMediaData.notes = notes || null;
      if (rating !== undefined) newMediaData.user_rating = rating !== null ? rating : null;
      
      console.log("Adding new user media:", newMediaData);
      
      const { error: insertError } = await supabase
        .from('user_media')
        .insert(newMediaData);
      
      if (insertError) {
        console.error("Error inserting user media:", insertError);
        throw new Error(`Erreur lors de l'ajout du média: ${insertError.message}`);
      }
    }
    
    // Étape 5: Mettre à jour la progression si nécessaire
    try {
      const { data: progression, error: progressionError } = await supabase
        .from('media_progressions')
        .select('id, progression_data')
        .eq('user_id', userId)
        .eq('media_id', mediaId)
        .maybeSingle();
      
      if (progressionError) {
        console.error("Error checking media progression:", progressionError);
        // Continue execution as this is not critical
      }
      
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
        if (effectiveStatus) {
          (progressionData as any).status = effectiveStatus;
        }
        
        if (notes !== undefined) {
          (progressionData as any).notes = notes || "";
        }
        
        const { error: updateProgressionError } = await supabase
          .from('media_progressions')
          .update({
            progression_data: progressionData,
            updated_at: new Date().toISOString()
          })
          .eq('id', progression.id);
        
        if (updateProgressionError) {
          console.error("Error updating progression:", updateProgressionError);
          // Continue execution as this is not critical
        }
      } else {
        // Créer une structure de progression basique
        const progressionData: Record<string, any> = {};
        
        if (effectiveStatus) progressionData.status = effectiveStatus;
        if (notes !== undefined) progressionData.notes = notes || "";
        
        const { error: insertProgressionError } = await supabase
          .from('media_progressions')
          .insert({
            media_id: mediaId,
            user_id: userId,
            progression_data: progressionData
          });
        
        if (insertProgressionError) {
          console.error("Error inserting progression:", insertProgressionError);
          // Continue execution as this is not critical
        }
      }
    } catch (progressionError) {
      console.error("Error handling progression data:", progressionError);
      // Continue execution as progression updates are not critical
    }
    
    console.log(`Media ${mediaId} added/updated successfully`);
  } catch (error) {
    console.error("Error in addMediaToLibrary:", error);
    throw error instanceof Error ? error : new Error("Erreur inconnue lors de l'ajout à la bibliothèque");
  }
}

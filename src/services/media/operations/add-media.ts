
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
    
    // 1. Vérification de l'authentification - amélioration des messages d'erreur
    const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
    
    if (sessionError) {
      console.error("Authentication error:", sessionError);
      throw new Error("Utilisateur non authentifié - Veuillez vous reconnecter");
    }
    
    if (!sessionData.user) {
      console.error("No user found in session");
      throw new Error("Session utilisateur introuvable - Veuillez vous reconnecter");
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
      status = defaultStatus;
    }
    
    const effectiveStatus = status;
    console.log(`Adding/updating media ${mediaId} with status: ${effectiveStatus}`);
    
    // 2. Vérification d'existence du média - gestion améliorée des erreurs
    try {
      const { data: existingMediaInDb, error: mediaCheckError } = await supabase
        .from('media')
        .select('id, title')
        .eq('id', mediaId)
        .maybeSingle();
      
      if (mediaCheckError) {
        console.error("Error checking media existence:", mediaCheckError);
        throw new Error("Erreur d'accès à la base de données - Veuillez réessayer");
      }
      
      // 3. Récupération depuis l'API externe si nécessaire
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
            const statusCode = mediaFetchResponse.status;
            let errorMessage;
            
            try {
              const errorData = await mediaFetchResponse.json();
              errorMessage = errorData.message || errorData.error || `Erreur API (${statusCode})`;
            } catch (e) {
              errorMessage = await mediaFetchResponse.text() || `Erreur API (${statusCode})`;
            }
            
            console.error(`Error fetching media data: ${statusCode} - ${errorMessage}`);
            throw new Error(`Impossible de récupérer les données du média (${errorMessage})`);
          }
          
          const mediaData = await mediaFetchResponse.json();
          console.log("Media data fetched:", mediaData);
          
          if (!mediaData || !mediaData.id) {
            console.error("Invalid media data received:", mediaData);
            throw new Error("Données du média invalides ou incomplètes");
          }
          
          // Prepare data for insertion with validation
          const newMediaEntry = {
            id: mediaId,
            title: mediaData.title || "Titre inconnu",
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
            // Gestion spécifique de l'erreur de duplication
            if (insertMediaError.code === '23505') { // Code PostgreSQL pour violation d'unicité
              console.log("Media already exists, continuing with user_media operation");
            } else {
              console.error("Error inserting media:", insertMediaError);
              throw new Error(`Erreur lors de l'ajout du média dans la bibliothèque: ${insertMediaError.message}`);
            }
          }
        } catch (apiError: any) {
          console.error("API or insert error:", apiError);
          const errorMessage = apiError instanceof Error ? 
            apiError.message : 
            "Erreur lors de la récupération des données du média";
          throw new Error(errorMessage);
        }
      }
      
      // 4. Vérification si déjà dans la bibliothèque - gestion améliorée
      const { data: existingMedia, error: userMediaCheckError } = await supabase
        .from('user_media')
        .select('id, status, media_id')
        .eq('user_id', userId)
        .eq('media_id', mediaId)
        .maybeSingle();
      
      if (userMediaCheckError) {
        console.error("Error checking user media:", userMediaCheckError);
        throw new Error("Erreur lors de la vérification de la bibliothèque");
      }
      
      // 5. Ajout ou mise à jour dans la bibliothèque avec transaction optimiste
      if (existingMedia) {
        console.log(`Media ${mediaId} already in library with status: ${existingMedia.status}`);
        
        // Ne pas lever d'erreur si même statut, procéder à la mise à jour silencieuse
        // pour permettre la modification des notes ou de la notation
        
        // Mettre à jour le média existant
        const updateData: any = {
          updated_at: new Date().toISOString()
        };
        
        if (effectiveStatus) updateData.status = effectiveStatus;
        if (notes !== undefined) updateData.notes = notes || null;
        if (rating !== undefined) updateData.user_rating = rating;
        
        console.log("Updating existing user media:", updateData);
        
        const { error: updateError } = await supabase
          .from('user_media')
          .update(updateData)
          .eq('id', existingMedia.id);
        
        if (updateError) {
          console.error("Error updating user media:", updateError);
          throw new Error(`Erreur lors de la mise à jour du média: ${updateError.message}`);
        }
        
        console.log("Media successfully updated");
      } else {
        // Ajouter un nouveau média
        const newMediaData: any = {
          user_id: userId,
          media_id: mediaId,
          status: effectiveStatus,
          added_at: new Date().toISOString()
        };
        
        if (notes !== undefined) newMediaData.notes = notes || null;
        if (rating !== undefined) newMediaData.user_rating = rating;
        
        console.log("Adding new user media:", newMediaData);
        
        const { error: insertError } = await supabase
          .from('user_media')
          .insert(newMediaData);
        
        if (insertError) {
          console.error("Error inserting user media:", insertError);
          
          // Gestion spécifique des erreurs d'insertion
          if (insertError.code === '23505') {
            throw new Error(`Ce média est déjà dans votre bibliothèque`);
          } else if (insertError.code === '23503') {
            throw new Error(`Référence incorrecte: le média ou l'utilisateur n'existe pas`);
          } else {
            throw new Error(`Erreur lors de l'ajout du média: ${insertError.message}`);
          }
        }
        
        console.log("Media successfully added to library");
      }
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      throw dbError;
    }
    
    // 6. Mise à jour de la progression si nécessaire - rendue optionnelle pour ne pas bloquer l'ajout principal
    try {
      const { data: progression, error: progressionError } = await supabase
        .from('media_progressions')
        .select('id, progression_data')
        .eq('user_id', userId)
        .eq('media_id', mediaId)
        .maybeSingle();
      
      // Ne pas bloquer le flux principal si cette partie échoue
      if (!progressionError) {
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
          
          if (effectiveStatus) progressionData.status = effectiveStatus;
          if (notes !== undefined) progressionData.notes = notes || "";
          
          await supabase
            .from('media_progressions')
            .insert({
              media_id: mediaId,
              user_id: userId,
              progression_data: progressionData
            });
        }
      }
    } catch (progressionError) {
      // Log but don't throw - progression is secondary to the main library update
      console.error("Error handling progression data:", progressionError);
    }
    
    console.log(`Media ${mediaId} added/updated successfully`);
  } catch (error) {
    console.error("Error in addMediaToLibrary:", error);
    throw error instanceof Error ? error : new Error("Erreur inconnue lors de l'ajout à la bibliothèque");
  }
}

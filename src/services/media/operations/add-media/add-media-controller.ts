
import { supabase, isAuthError } from "@/integrations/supabase/client";
import { MediaType, MediaStatus } from "@/types";
import { validateUserSession } from "./auth-validator";
import { checkExistingMedia } from "./media-validator";
import { fetchMediaFromExternalApi } from "./external-api-service";
import { addOrUpdateUserMedia } from "./user-media-service";
import { v4 as uuidv4 } from "uuid";

interface AddMediaParams {
  mediaId: string;
  mediaType: MediaType;
  status?: MediaStatus;
  notes?: string;
  rating?: number;
}

/**
 * Ajoute ou met à jour un média dans la bibliothèque de l'utilisateur
 */
export async function addMediaToLibrary(params: AddMediaParams): Promise<void> {
  try {
    console.log(`Starting addMediaToLibrary for ${params.mediaType}/${params.mediaId} with status: ${params.status}`);
    
    // 1. Vérifier l'authentification et obtenir l'ID utilisateur
    const userId = await validateUserSession();
    
    // 2. Adapter le statut par défaut en fonction du type de média si aucun n'est spécifié
    let effectiveStatus = params.status;
    if (!effectiveStatus) {
      switch (params.mediaType) {
        case 'book':
          effectiveStatus = 'to-read';
          break;
        case 'game':
          effectiveStatus = 'to-play';
          break;
        case 'film':
        case 'serie':
        default:
          effectiveStatus = 'to-watch';
      }
    }
    
    console.log(`Adding/updating media ${params.mediaId} with status: ${effectiveStatus}`);
    
    // 3. Vérifier si le média existe déjà dans la base de données Mookka
    let existingMediaInDb = null;
    try {
      existingMediaInDb = await checkExistingMedia(params.mediaId);
      console.log("Résultat de checkExistingMedia:", existingMediaInDb);
    } catch (checkError) {
      console.error("Error checking media existence:", checkError);
      throw new Error(`Erreur lors de la vérification du média: ${checkError instanceof Error ? checkError.message : "Erreur inconnue"}`);
    }
    
    let internalMediaId: string;
    
    // 4. Si le média n'existe pas dans Mookka, essayer de le récupérer depuis l'API externe
    if (!existingMediaInDb) {
      try {
        console.log("Média non trouvé dans Mookka, récupération depuis l'API externe");
        await fetchMediaFromExternalApi(params.mediaId, params.mediaType);
        
        // Vérifier à nouveau après récupération API
        const mediaAfterFetch = await checkExistingMedia(params.mediaId);
        
        if (mediaAfterFetch) {
          internalMediaId = mediaAfterFetch.id;
          console.log(`Média récupéré et ajouté à Mookka, ID interne: ${internalMediaId}`);
        } else {
          // Si l'API n'a pas pu récupérer le média, créer une entrée temporaire
          console.log("API n'a pas pu récupérer le média, création d'une entrée temporaire");
          
          internalMediaId = uuidv4();
          const title = `Média ${params.mediaType} #${params.mediaId}`;
          
          const { error: insertError } = await supabase
            .from('media')
            .insert({
              id: internalMediaId,
              external_id: params.mediaId.toString(),
              title: title,
              type: params.mediaType
            });
            
          if (insertError) {
            console.error("Erreur lors de la création de l'entrée temporaire:", insertError);
            throw new Error(`Impossible de créer l'entrée média: ${insertError.message}`);
          }
          
          console.log(`Entrée temporaire créée avec succès, ID: ${internalMediaId}`);
        }
      } catch (fetchError) {
        console.error("Erreur lors de la récupération depuis l'API externe:", fetchError);
        throw new Error("Impossible de récupérer les informations du média. Veuillez réessayer plus tard.");
      }
    } else {
      internalMediaId = existingMediaInDb.id;
      console.log(`Média trouvé dans Mookka avec l'ID: ${internalMediaId}`);
    }
    
    // 5. Ajouter ou mettre à jour dans la bibliothèque de l'utilisateur
    try {
      console.log(`Ajout à la bibliothèque utilisateur: userId=${userId}, mediaId=${internalMediaId}, status=${effectiveStatus}`);
      
      await addOrUpdateUserMedia({
        userId,
        mediaId: internalMediaId,
        status: effectiveStatus,
        notes: params.notes,
        rating: params.rating
      });
      
      console.log("Media successfully added or updated in user library");
    } catch (userMediaError) {
      console.error("Error in addOrUpdateUserMedia:", userMediaError);
      throw userMediaError;
    }
    
  } catch (error) {
    console.error("Error in addMediaToLibrary:", error);
    throw error instanceof Error ? error : new Error("Erreur inconnue lors de l'ajout à la bibliothèque");
  }
}

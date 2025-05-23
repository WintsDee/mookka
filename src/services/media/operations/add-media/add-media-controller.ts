
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
    
    // Adapter le statut par défaut en fonction du type de média si aucun n'est spécifié
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
    
    // 2. Vérifier si le média existe dans la base de données
    let existingMediaInDb = null;
    try {
      existingMediaInDb = await checkExistingMedia(params.mediaId);
    } catch (checkError) {
      console.error("Error checking media existence:", checkError);
      throw new Error(`Erreur lors de la vérification du média: ${checkError instanceof Error ? checkError.message : "Erreur inconnue"}`);
    }
    
    // UUID pour le nouveau média si nécessaire
    let internalMediaId: string;
    
    // 3. Récupérer depuis l'API externe ou créer une entrée temporaire si nécessaire
    if (!existingMediaInDb) {
      try {
        console.log("Média non trouvé dans la base de données, tentative de récupération depuis l'API externe");
        await fetchMediaFromExternalApi(params.mediaId, params.mediaType);
        
        // Vérifier à nouveau après récupération API
        const mediaAfterFetch = await checkExistingMedia(params.mediaId);
        
        if (!mediaAfterFetch) {
          // L'API n'a pas pu récupérer le média, créer une entrée temporaire
          console.log("Création d'une entrée temporaire dans la base de données");
          
          internalMediaId = uuidv4();
          console.log(`UUID généré pour le nouveau média: ${internalMediaId}`);
          
          // Récupérer le titre depuis l'API externe si disponible ou utiliser un titre temporaire
          let title = `Média ${params.mediaType} #${params.mediaId}`;
          
          // Insérer dans la table media
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
        } else {
          internalMediaId = mediaAfterFetch.id;
          console.log(`Média récupéré de l'API et ajouté à la base de données, ID: ${internalMediaId}`);
        }
      } catch (fetchError) {
        console.error("Erreur lors de la récupération depuis l'API externe:", fetchError);
        if (fetchError instanceof Error) {
          throw fetchError; // Propagate the specific error message
        } else {
          throw new Error("Impossible de récupérer les informations du média. Veuillez réessayer plus tard.");
        }
      }
    } else {
      internalMediaId = existingMediaInDb.id;
      console.log(`Média trouvé dans la base de données avec l'ID: ${internalMediaId}`);
    }
    
    // 4. Ajouter ou mettre à jour dans la bibliothèque de l'utilisateur
    try {
      await addOrUpdateUserMedia({
        userId,
        mediaId: internalMediaId,
        status: effectiveStatus,
        notes: params.notes,
        rating: params.rating
      });
      
      console.log("Media successfully added or updated in library");
    } catch (userMediaError) {
      console.error("Error in addOrUpdateUserMedia:", userMediaError);
      throw userMediaError; // Propagate the specific error
    }
    
  } catch (error) {
    console.error("Error in addMediaToLibrary:", error);
    
    // Gérer les cas spécifiques d'erreurs de connexion
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error("La connexion a pris trop de temps. Vérifiez votre connexion internet et réessayez.");
    }
    
    // Gérer les erreurs réseau
    if (error instanceof Error && error.message.includes('network')) {
      throw new Error("Problème de connexion réseau. Vérifiez votre connexion internet et réessayez.");
    }
    
    throw error instanceof Error ? error : new Error("Erreur inconnue lors de l'ajout à la bibliothèque");
  }
}

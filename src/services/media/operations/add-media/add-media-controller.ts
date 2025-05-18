
import { supabase, isAuthError } from "@/integrations/supabase/client";
import { MediaType, MediaStatus } from "@/types";
import { validateUserSession } from "./auth-validator";
import { checkExistingMedia } from "./media-validator";
import { fetchMediaFromExternalApi } from "./external-api-service";
import { addOrUpdateUserMedia } from "./user-media-service";

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
    const existingMediaInDb = await checkExistingMedia(params.mediaId);
    
    // 3. Récupérer depuis l'API externe si nécessaire
    if (!existingMediaInDb) {
      await fetchMediaFromExternalApi(params.mediaId, params.mediaType);
    }
    
    // 4. Ajouter ou mettre à jour dans la bibliothèque de l'utilisateur
    await addOrUpdateUserMedia({
      userId,
      mediaId: params.mediaId,
      status: effectiveStatus,
      notes: params.notes,
      rating: params.rating
    });
    
    console.log("Media successfully added or updated in library");
    
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

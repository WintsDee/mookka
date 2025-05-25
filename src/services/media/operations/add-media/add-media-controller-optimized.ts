
import { MediaType, MediaStatus } from "@/types";
import { validateUserSessionOptimized } from "./auth-validator-optimized";
import { checkExistingMediaOptimized } from "./media-validator-optimized";
import { fetchMediaFromExternalApi } from "./external-api-service";
import { addOrUpdateUserMediaOptimized } from "./user-media-service-optimized";

interface AddMediaParams {
  mediaId: string;
  mediaType: MediaType;
  status?: MediaStatus;
  notes?: string;
  rating?: number;
}

/**
 * Contrôleur optimisé pour l'ajout de médias
 */
export async function addMediaToLibraryOptimized(params: AddMediaParams): Promise<void> {
  console.log(`Ajout média optimisé: ${params.mediaType}/${params.mediaId}`);
  
  try {
    // 1. Validation utilisateur (avec cache)
    const userId = await validateUserSessionOptimized();
    
    // 2. Déterminer le statut par défaut
    const effectiveStatus = params.status || getDefaultStatus(params.mediaType);
    
    // 3. Vérification média existant (avec cache)
    let existingMedia = await checkExistingMediaOptimized(params.mediaId);
    let internalMediaId: string;
    
    if (existingMedia) {
      internalMediaId = existingMedia.id;
      console.log(`Média trouvé: ${internalMediaId}`);
    } else {
      // 4. Récupération depuis API externe si nécessaire
      console.log("Récupération depuis API externe...");
      await fetchMediaFromExternalApi(params.mediaId, params.mediaType);
      
      // Vérifier à nouveau
      existingMedia = await checkExistingMediaOptimized(params.mediaId);
      if (!existingMedia) {
        throw new Error("Impossible de récupérer le média depuis l'API externe");
      }
      internalMediaId = existingMedia.id;
    }
    
    // 5. Ajout/mise à jour dans la bibliothèque utilisateur (optimisé)
    await addOrUpdateUserMediaOptimized({
      userId,
      mediaId: internalMediaId,
      status: effectiveStatus,
      notes: params.notes,
      rating: params.rating
    });
    
    console.log("Média ajouté avec succès à la bibliothèque");
  } catch (error) {
    console.error("Erreur dans addMediaToLibraryOptimized:", error);
    throw error;
  }
}

/**
 * Détermine le statut par défaut selon le type de média
 */
function getDefaultStatus(mediaType: MediaType): MediaStatus {
  switch (mediaType) {
    case 'book': return 'to-read';
    case 'game': return 'to-play';
    case 'film':
    case 'serie':
    default: return 'to-watch';
  }
}

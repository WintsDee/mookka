
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
  
  if (!params.mediaId || !params.mediaType) {
    throw new Error("MediaId et mediaType sont requis");
  }
  
  // Nettoyer le mediaId - s'assurer qu'il s'agit d'une chaîne valide
  const cleanMediaId = String(params.mediaId).trim();
  if (!cleanMediaId) {
    throw new Error("MediaId invalide");
  }
  
  try {
    // 1. Validation utilisateur (avec cache)
    console.log("1. Validation de l'utilisateur...");
    const userId = await validateUserSessionOptimized();
    console.log("Utilisateur validé:", userId);
    
    // 2. Déterminer le statut par défaut
    const effectiveStatus = params.status || getDefaultStatus(params.mediaType);
    console.log("Statut effectif:", effectiveStatus);
    
    // 3. Vérification média existant (avec cache)
    console.log("3. Vérification du média existant...");
    let existingMedia = await checkExistingMediaOptimized(cleanMediaId);
    let internalMediaId: string;
    
    if (existingMedia) {
      internalMediaId = existingMedia.id;
      console.log(`Média trouvé: ${internalMediaId}`);
    } else {
      // 4. Récupération depuis API externe si nécessaire
      console.log("4. Récupération depuis API externe...");
      try {
        await fetchMediaFromExternalApi(cleanMediaId, params.mediaType);
        
        // Attendre un peu puis vérifier à nouveau
        await new Promise(resolve => setTimeout(resolve, 1000));
        existingMedia = await checkExistingMediaOptimized(cleanMediaId);
        
        if (!existingMedia) {
          throw new Error("Impossible de récupérer le média depuis l'API externe");
        }
        internalMediaId = existingMedia.id;
        console.log("Média récupéré et ajouté:", internalMediaId);
      } catch (apiError) {
        console.error("Erreur API externe:", apiError);
        throw new Error("Ce média n'est pas disponible actuellement. Veuillez réessayer plus tard.");
      }
    }
    
    // 5. Ajout/mise à jour dans la bibliothèque utilisateur (optimisé)
    console.log("5. Ajout à la bibliothèque utilisateur...");
    await addOrUpdateUserMediaOptimized({
      userId,
      mediaId: internalMediaId,
      status: effectiveStatus,
      notes: params.notes || null,
      rating: params.rating || null
    });
    
    console.log("Média ajouté avec succès à la bibliothèque");
  } catch (error) {
    console.error("Erreur dans addMediaToLibraryOptimized:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Une erreur inattendue s'est produite lors de l'ajout du média");
    }
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

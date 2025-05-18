
import { supabase, isAuthError } from "@/integrations/supabase/client";
import { MediaType } from "@/types";

/**
 * Récupère les informations du média depuis une API externe
 * et les ajoute à la base de données
 */
export async function fetchMediaFromExternalApi(mediaId: string, mediaType: MediaType): Promise<void> {
  console.log(`Media ${mediaId} doesn't exist yet, fetching details...`);
  
  try {
    // Récupérer la session pour l'authentification avec l'API
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      throw new Error("Session utilisateur introuvable - Veuillez vous reconnecter");
    }
    
    // Récupérer les informations du média depuis l'API externe avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 secondes timeout
    
    const mediaFetchResponse = await fetch(`https://dfuawprsisgwyvdtfjvl.supabase.co/functions/v1/fetch-media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionData.session.access_token}`,
      },
      body: JSON.stringify({
        type: mediaType,
        id: mediaId
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!mediaFetchResponse.ok) {
      const statusCode = mediaFetchResponse.status;
      let errorMessage;
      
      try {
        const errorData = await mediaFetchResponse.json();
        errorMessage = errorData.message || errorData.error || `Erreur API (${statusCode})`;
      } catch (e) {
        errorMessage = await mediaFetchResponse.text() || `Erreur API (${statusCode})`;
      }
      
      // Gestion spécifique des erreurs d'API
      if (statusCode === 404) {
        throw new Error(`Média introuvable dans la source externe (ID: ${mediaId})`);
      } else if (statusCode === 401 || statusCode === 403) {
        throw new Error(`Accès non autorisé à la source externe. Veuillez vous reconnecter.`);
      } else if (statusCode >= 500) {
        throw new Error(`Le service externe est indisponible. Veuillez réessayer plus tard.`);
      } else {
        throw new Error(`Impossible de récupérer les données du média: ${errorMessage}`);
      }
    }
    
    const mediaData = await mediaFetchResponse.json();
    console.log("Media data fetched:", mediaData);
    
    if (!mediaData || !mediaData.id) {
      console.error("Invalid media data received:", mediaData);
      throw new Error("Données du média invalides ou incomplètes");
    }
    
    // Valider les données avant insertion
    validateMediaData(mediaData);
    
    // Préparer les données pour insertion
    const newMediaEntry = formatMediaEntry(mediaData, mediaId, mediaType);
    
    console.log("Inserting new media entry:", newMediaEntry);
    
    // Utiliser upsert pour éviter les erreurs de duplications
    const { error: insertMediaError } = await supabase
      .from('media')
      .upsert(newMediaEntry, { onConflict: 'id' });
    
    if (insertMediaError) {
      if (insertMediaError.code === '23505') { // Code PostgreSQL pour violation d'unicité
        console.log("Media already exists, continuing with user_media operation");
      } else {
        console.error("Error inserting media:", insertMediaError);
        throw new Error(`Erreur lors de l'ajout du média dans la bibliothèque: ${insertMediaError.message}`);
      }
    }
  } catch (apiError: any) {
    console.error("API or insert error:", apiError);
    
    // Si c'est une erreur d'abandon (timeout), message spécifique
    if (apiError.name === 'AbortError') {
      throw new Error("La requête a pris trop de temps. Vérifiez votre connexion et réessayez.");
    }
    
    const errorMessage = apiError instanceof Error ? 
      apiError.message : 
      "Erreur lors de la récupération des données du média";
    throw new Error(errorMessage);
  }
}

/**
 * Valide les données du média reçues de l'API externe
 */
function validateMediaData(mediaData: any): void {
  const requiredFields = ['id', 'title', 'type'];
  for (const field of requiredFields) {
    if (!mediaData[field]) {
      throw new Error(`Données du média incomplètes: ${field} manquant`);
    }
  }
}

/**
 * Formate les données du média pour insertion dans la base de données
 */
function formatMediaEntry(mediaData: any, mediaId: string, mediaType: MediaType) {
  return {
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
}

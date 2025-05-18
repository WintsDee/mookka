
import { supabase, isAuthError } from "@/integrations/supabase/client";
import { Media, MediaType, MediaStatus } from "@/types";

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
export async function addMediaToLibrary({
  mediaId,
  mediaType,
  status,
  notes = '',
  rating
}: AddMediaParams): Promise<void> {
  try {
    console.log(`Starting addMediaToLibrary for ${mediaType}/${mediaId} with status: ${status}`);
    
    // 1. Vérification de l'authentification avec gestion améliorée des erreurs
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Authentication error:", sessionError);
      
      // Tenter une actualisation du token si possible
      try {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !refreshData.session) {
          throw new Error("Utilisateur non authentifié - Veuillez vous reconnecter");
        }
        
        console.log("Session refreshed successfully");
      } catch (refreshError) {
        console.error("Session refresh failed:", refreshError);
        throw new Error("Session expirée - Veuillez vous reconnecter");
      }
    }
    
    if (!sessionData?.session?.user) {
      console.error("No user found in session");
      throw new Error("Session utilisateur introuvable - Veuillez vous reconnecter");
    }
    
    const userId = sessionData.session.user.id;
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
    
    // 2. Vérification d'existence du média avec retry automatique
    const MAX_RETRIES = 2;
    let retryCount = 0;
    let existingMediaInDb = null;
    let mediaCheckError = null;
    
    while (retryCount <= MAX_RETRIES) {
      try {
        const { data, error } = await supabase
          .from('media')
          .select('id, title')
          .eq('id', mediaId)
          .maybeSingle();
        
        existingMediaInDb = data;
        mediaCheckError = error;
        
        if (mediaCheckError) {
          if (isAuthError(mediaCheckError)) {
            // Problème d'authentification, on essaie de rafraîchir le token
            if (retryCount < MAX_RETRIES) {
              console.log(`Auth error detected, attempting retry ${retryCount + 1}/${MAX_RETRIES}`);
              await supabase.auth.refreshSession();
              retryCount++;
              continue;
            } else {
              throw new Error("Problème d'authentification persistant - Veuillez vous reconnecter");
            }
          } else {
            throw mediaCheckError;
          }
        }
        
        // Si pas d'erreur, sortir de la boucle
        break;
      } catch (error) {
        console.error(`Retry ${retryCount}/${MAX_RETRIES} failed:`, error);
        if (retryCount >= MAX_RETRIES) throw error;
        retryCount++;
      }
    }
    
    if (mediaCheckError) {
      console.error("Error checking media existence after retries:", mediaCheckError);
      throw new Error("Erreur d'accès à la base de données - Veuillez réessayer");
    }
    
    // 3. Récupération depuis l'API externe si nécessaire
    if (!existingMediaInDb) {
      console.log(`Media ${mediaId} doesn't exist yet, fetching details...`);
      
      try {
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
        const requiredFields = ['id', 'title', 'type'];
        for (const field of requiredFields) {
          if (!mediaData[field]) {
            throw new Error(`Données du média incomplètes: ${field} manquant`);
          }
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
        
        if (isAuthError(updateError)) {
          throw new Error("Votre session a expiré. Veuillez vous reconnecter pour continuer.");
        } else {
          throw new Error(`Erreur lors de la mise à jour du média: ${updateError.message}`);
        }
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
        } else if (isAuthError(insertError)) {
          throw new Error("Session expirée. Veuillez vous reconnecter pour ajouter ce média.");
        } else {
          throw new Error(`Erreur lors de l'ajout du média: ${insertError.message}`);
        }
      }
      
      console.log("Media successfully added to library");
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

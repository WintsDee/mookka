
import { supabase, isAuthError } from "@/integrations/supabase/client";
import { MediaType } from "@/types";
import { v4 as uuidv4 } from "uuid";

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
      console.error("Session error:", sessionError);
      throw new Error("Session utilisateur introuvable - Veuillez vous reconnecter");
    }
    
    // Récupérer les informations du média depuis l'API externe avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // Increase timeout to 20 seconds
    
    console.log(`Envoi de la requête à l'API pour récupérer le média ${mediaType}/${mediaId}`);
    
    // Directly invoke the edge function using the Supabase client
    try {
      const { data: mediaData, error: funcError } = await supabase.functions.invoke('fetch-media', {
        body: {
          type: mediaType,
          id: mediaId
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (funcError) {
        console.error("Edge function error:", funcError);
        throw new Error(`Erreur lors de la récupération des données du média: ${funcError.message}`);
      }
      
      if (!mediaData) {
        console.error("No data received from API");
        throw new Error("Aucune donnée reçue de l'API externe");
      }
      
      console.log("Données du média récupérées:", mediaData);
      
      if (!mediaData || !mediaData.id) {
        console.error("Données invalides reçues:", mediaData);
        throw new Error("Données du média invalides ou incomplètes");
      }
      
      // Valider les données avant insertion
      validateMediaData(mediaData);
      
      // Préparer les données pour insertion
      const newMediaEntry = formatMediaEntry(mediaData, mediaId, mediaType);
      
      console.log("Insertion du média dans la base de données:", newMediaEntry);
      
      // Utiliser upsert pour éviter les erreurs de duplications
      const { error: insertMediaError } = await supabase
        .from('media')
        .upsert(newMediaEntry, { onConflict: 'external_id, type' });
      
      if (insertMediaError) {
        if (insertMediaError.code === '23505') { // Code PostgreSQL pour violation d'unicité
          console.log("Le média existe déjà, opération user_media continuée");
        } else {
          console.error("Erreur lors de l'insertion du média:", insertMediaError);
          throw new Error(`Erreur lors de l'ajout du média dans la bibliothèque: ${insertMediaError.message}`);
        }
      } else {
        console.log("Média ajouté avec succès à la base de données");
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Si c'est une erreur d'abandon (timeout), message spécifique
      if (fetchError.name === 'AbortError') {
        console.error("Request timeout:", fetchError);
        throw new Error("La requête a pris trop de temps. Vérifiez votre connexion et réessayez.");
      }
      
      console.error("API fetch error:", fetchError);
      throw new Error(`Impossible de récupérer les informations du média. Veuillez réessayer plus tard. (${fetchError.message})`);
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
  // Liste des champs requis pour tous les types de médias
  const requiredFields = ['id', 'title', 'type'];
  
  // Vérifier les champs requis
  for (const field of requiredFields) {
    if (mediaData[field] === undefined || mediaData[field] === null) {
      console.error(`Données du média incomplètes: ${field} manquant`, mediaData);
      throw new Error(`Données du média incomplètes: ${field} manquant`);
    }
  }
  
  // Vérifier si le titre est une chaîne vide
  if (typeof mediaData.title === 'string' && mediaData.title.trim() === '') {
    console.error("Le titre du média est vide");
    throw new Error("Le titre du média ne peut pas être vide");
  }
  
  // Vérifier si l'ID est valide
  if (!mediaData.id || mediaData.id.toString().trim() === '') {
    console.error("L'ID du média est invalide");
    throw new Error("L'ID du média est invalide");
  }
  
  console.log("Validation des données du média réussie");
}

/**
 * Formate les données du média pour insertion dans la base de données
 */
function formatMediaEntry(mediaData: any, mediaId: string, mediaType: MediaType) {
  // Générer un UUID pour le média
  const internalId = uuidv4();
  console.log(`UUID généré pour le nouveau média: ${internalId}`);
  
  // Créer l'entrée formatée
  return {
    id: internalId,
    external_id: mediaId.toString(),
    title: mediaData.title || "Titre inconnu",
    type: mediaType,
    year: mediaData.year || mediaData.release_date ? parseInt(mediaData.release_date?.substring(0, 4)) : null,
    description: mediaData.description || mediaData.overview || null,
    cover_image: mediaData.poster_path ? `https://image.tmdb.org/t/p/w500${mediaData.poster_path}` : 
                (mediaData.cover_image || mediaData.background_image || null),
    genres: Array.isArray(mediaData.genres) ? mediaData.genres : 
           (Array.isArray(mediaData.genre_ids) ? mediaData.genre_ids : []),
    director: mediaData.director || null,
    author: mediaData.author || (mediaData.authors ? (Array.isArray(mediaData.authors) ? mediaData.authors.join(', ') : mediaData.authors) : null),
    publisher: mediaData.publisher || null,
    platform: mediaData.platform || null,
    rating: mediaData.rating || mediaData.vote_average || null
  };
}

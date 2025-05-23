
import { supabase, isAuthError } from "@/integrations/supabase/client";
import { MediaType } from "@/types";
import { v4 as uuidv4 } from "uuid";

/**
 * Récupère les informations du média depuis une API externe
 * et les ajoute à la base de données
 */
export async function fetchMediaFromExternalApi(mediaId: string, mediaType: MediaType): Promise<void> {
  console.log(`Début de fetchMediaFromExternalApi pour ${mediaType}/${mediaId}`);
  
  try {
    // 1. Récupérer la session pour l'authentification avec l'API
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error("Session error:", sessionError);
      throw new Error("Session utilisateur introuvable - Veuillez vous reconnecter");
    }
    
    console.log(`Envoi de la requête à l'API pour récupérer le média ${mediaType}/${mediaId}`);
    
    // 2. Appel à la fonction Edge pour récupérer les données du média
    const { data: mediaData, error: funcError } = await supabase.functions.invoke('fetch-media', {
      body: {
        type: mediaType,
        id: mediaId
      }
    });
    
    if (funcError) {
      console.error("Edge function error:", funcError);
      throw new Error(`Erreur lors de la récupération des données du média: ${funcError.message}`);
    }
    
    if (!mediaData) {
      console.error("No data received from API");
      throw new Error("Aucune donnée reçue de l'API externe");
    }
    
    console.log("Données du média récupérées:", mediaData);
    
    // 3. Valider les données et préparer pour insertion
    try {
      validateMediaData(mediaData);
      
      // Préparer les données pour insertion
      const newMediaEntry = formatMediaEntry(mediaData, mediaId, mediaType);
      
      console.log("Insertion du média dans la base de données:", newMediaEntry);
      
      // 4. Utiliser upsert pour éviter les erreurs de duplications
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
    } catch (validationError) {
      console.error("Validation or insert error:", validationError);
      if (validationError instanceof Error) {
        throw validationError;
      } else {
        throw new Error("Erreur lors de la validation ou de l'insertion des données du média");
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

/**
 * Valide les données du média reçues de l'API externe
 */
function validateMediaData(mediaData: any): void {
  // 1. Vérifier si mediaData est null ou undefined
  if (!mediaData) {
    console.error("Les données du média sont nulles ou indéfinies");
    throw new Error("Données du média invalides: données manquantes");
  }
  
  // 2. Vérifier le type de mediaData (doit être un objet)
  if (typeof mediaData !== 'object' || Array.isArray(mediaData)) {
    console.error("Les données du média ne sont pas un objet:", mediaData);
    throw new Error("Format de données du média invalide");
  }
  
  // 3. Différentes validations selon le type de média
  const requiredFields = ['id'];
  
  // Résoudre l'ID selon le type de média
  let idValue = null;
  
  if ('id' in mediaData) {
    idValue = mediaData.id;
  } else if ('volumeInfo' in mediaData && mediaData.id) {
    // Pour les livres de Google Books
    idValue = mediaData.id;
  }
  
  // Vérifier si l'ID est présent et valide
  if (!idValue) {
    console.error("L'identifiant du média est manquant ou invalide:", mediaData);
    throw new Error("Identifiant du média manquant ou invalide");
  }
  
  // Résoudre le titre selon le type de média
  let title = null;
  
  if ('title' in mediaData) {
    title = mediaData.title; // Film (TMDB)
  } else if ('name' in mediaData) {
    title = mediaData.name; // Série (TMDB) ou Jeu (RAWG)
  } else if ('volumeInfo' in mediaData && mediaData.volumeInfo?.title) {
    title = mediaData.volumeInfo.title; // Livre (Google Books)
  }
  
  // Vérifier si le titre est présent et valide
  if (!title || typeof title !== 'string' || title.trim() === '') {
    console.error("Le titre du média est manquant ou invalide:", mediaData);
    throw new Error("Titre du média manquant ou invalide");
  }
  
  console.log("Validation des données du média réussie pour:", title);
}

/**
 * Formate les données du média pour insertion dans la base de données
 */
function formatMediaEntry(mediaData: any, mediaId: string, mediaType: MediaType) {
  // Générer un UUID pour le média
  const internalId = uuidv4();
  console.log(`UUID généré pour le nouveau média: ${internalId}`);
  
  // Résoudre le titre selon le type de média
  let title;
  let year = null;
  let description = null;
  let coverImage = null;
  let genres = [];
  let director = null;
  let author = null;
  let publisher = null;
  let platform = null;
  let rating = null;
  
  switch (mediaType) {
    case 'film':
      title = mediaData.title || "Titre inconnu";
      year = mediaData.release_date ? parseInt(mediaData.release_date.substring(0, 4)) : null;
      description = mediaData.overview || null;
      coverImage = mediaData.poster_path ? `https://image.tmdb.org/t/p/w500${mediaData.poster_path}` : null;
      genres = Array.isArray(mediaData.genres) ? mediaData.genres.map((g: any) => g.name) : 
              (Array.isArray(mediaData.genre_ids) ? mediaData.genre_ids : []);
      director = mediaData.director || 
                (mediaData.credits?.crew?.find((p: any) => p.job === 'Director')?.name) || null;
      rating = mediaData.vote_average || null;
      break;
      
    case 'serie':
      title = mediaData.name || mediaData.original_name || "Titre inconnu";
      year = mediaData.first_air_date ? parseInt(mediaData.first_air_date.substring(0, 4)) : null;
      description = mediaData.overview || null;
      coverImage = mediaData.poster_path ? `https://image.tmdb.org/t/p/w500${mediaData.poster_path}` : null;
      genres = Array.isArray(mediaData.genres) ? mediaData.genres.map((g: any) => g.name) : 
              (Array.isArray(mediaData.genre_ids) ? mediaData.genre_ids : []);
      rating = mediaData.vote_average || null;
      break;
      
    case 'book':
      title = mediaData.volumeInfo?.title || "Titre inconnu";
      year = mediaData.volumeInfo?.publishedDate ? parseInt(mediaData.volumeInfo.publishedDate.substring(0, 4)) : null;
      description = mediaData.volumeInfo?.description || null;
      coverImage = mediaData.volumeInfo?.imageLinks?.thumbnail || null;
      genres = mediaData.volumeInfo?.categories || [];
      author = mediaData.volumeInfo?.authors ? 
              (Array.isArray(mediaData.volumeInfo.authors) ? mediaData.volumeInfo.authors.join(', ') : mediaData.volumeInfo.authors) 
              : null;
      publisher = mediaData.volumeInfo?.publisher || null;
      rating = mediaData.volumeInfo?.averageRating || null;
      break;
      
    case 'game':
      title = mediaData.name || "Titre inconnu";
      year = mediaData.released ? parseInt(mediaData.released.substring(0, 4)) : null;
      description = mediaData.description_raw || mediaData.description || null;
      coverImage = mediaData.background_image || null;
      genres = Array.isArray(mediaData.genres) ? mediaData.genres.map((g: any) => g.name) : [];
      publisher = mediaData.publishers?.length > 0 ? mediaData.publishers[0].name : null;
      platform = mediaData.platforms?.map((p: any) => p.platform.name).join(', ') || null;
      rating = mediaData.rating || null;
      break;
      
    default:
      title = "Média inconnu";
  }
  
  // Créer et retourner l'entrée formatée
  return {
    id: internalId,
    external_id: mediaId.toString(),
    title: title,
    type: mediaType,
    year: year,
    description: description,
    cover_image: coverImage,
    genres: genres,
    director: director,
    author: author,
    publisher: publisher,
    platform: platform,
    rating: rating
  };
}

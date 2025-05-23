
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
    
    console.log("Données du média récupérées:", JSON.stringify(mediaData, null, 2));
    
    // 3. Valider les données et préparer pour insertion
    try {
      validateMediaData(mediaData, mediaType);
      
      // Préparer les données pour insertion
      const newMediaEntry = formatMediaEntry(mediaData, mediaId, mediaType);
      
      console.log("Insertion du média dans la base de données:", newMediaEntry);
      
      // 4. Modification: utiliser INSERT seulement, et gérer le cas où il existe déjà
      // Vérifier d'abord si le média existe avec cet external_id et type
      const { data: existingMedia, error: checkError } = await supabase
        .from('media')
        .select('id')
        .eq('external_id', mediaId.toString())
        .eq('type', mediaType)
        .maybeSingle();
      
      if (checkError) {
        console.error("Erreur lors de la vérification du média existant:", checkError);
        throw new Error(`Erreur lors de la vérification du média: ${checkError.message}`);
      }
      
      if (existingMedia) {
        console.log(`Le média ${mediaType}/${mediaId} existe déjà avec l'ID: ${existingMedia.id}`);
        // Mise à jour optionnelle si besoin
        const { error: updateError } = await supabase
          .from('media')
          .update({
            title: newMediaEntry.title,
            cover_image: newMediaEntry.cover_image,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingMedia.id);
        
        if (updateError) {
          console.error("Erreur lors de la mise à jour du média:", updateError);
        } else {
          console.log("Données du média mises à jour avec succès");
        }
      } else {
        // Insertion d'un nouveau média
        const { error: insertError } = await supabase
          .from('media')
          .insert(newMediaEntry);
        
        if (insertError) {
          console.error("Erreur lors de l'insertion du média:", insertError);
          throw new Error(`Erreur lors de l'ajout du média dans la bibliothèque: ${insertError.message}`);
        } else {
          console.log("Média ajouté avec succès à la base de données");
        }
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
function validateMediaData(mediaData: any, mediaType: MediaType): void {
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
  
  // 3. Validation de l'ID
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
  
  // 4. Validation du titre selon le type de média
  let title = null;
  console.log(`Validation du titre pour le média de type ${mediaType}`);
  
  switch (mediaType) {
    case 'film':
      title = mediaData.title || mediaData.original_title;
      break;
    case 'serie':
      title = mediaData.name || mediaData.original_name;
      break;
    case 'book':
      title = mediaData.volumeInfo?.title;
      break;
    case 'game':
      title = mediaData.name;
      break;
  }
  
  // Afficher des logs détaillés pour aider au débogage
  console.log(`Titre trouvé: ${title ? `"${title}"` : "non trouvé"}`);
  console.log(`Structure de l'objet mediaData:`, JSON.stringify({
    hasTitle: 'title' in mediaData,
    hasName: 'name' in mediaData,
    hasOriginalTitle: 'original_title' in mediaData,
    hasOriginalName: 'original_name' in mediaData,
    hasVolumeInfo: 'volumeInfo' in mediaData,
    volumeInfoHasTitle: mediaData.volumeInfo ? 'title' in mediaData.volumeInfo : false
  }, null, 2));
  
  // Vérifier si le titre est présent et valide
  if (!title || typeof title !== 'string' || title.trim() === '') {
    console.error(`Le titre du média est manquant ou invalide pour le type ${mediaType}:`, mediaData);
    throw new Error(`Titre du média manquant ou invalide pour le type ${mediaType}`);
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
      title = mediaData.title || mediaData.original_title || "Titre inconnu";
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
  
  console.log(`Média formaté: titre=${title}, type=${mediaType}, année=${year}`);
  
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

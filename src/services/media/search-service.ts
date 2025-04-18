
import { supabase } from "@/integrations/supabase/client";
import { Media, MediaType } from "@/types";
import { filterAdultContent } from './filters';
import { formatBookSearchResult, formatFilmSearchResult, formatGameSearchResult, formatSerieSearchResult } from './formatters';

/**
 * Recherche fuzzy qui détecte les termes similaires et les fautes de frappe
 */
function isSimilarText(text: string, query: string, threshold: number = 0.7): boolean {
  if (!text || !query) return false;
  
  // Convertir en minuscules pour la comparaison
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Si le texte contient la requête, c'est un match direct
  if (textLower.includes(queryLower)) return true;
  
  // Diviser la requête en mots et vérifier si l'un d'eux est présent
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
  
  // Si l'un des mots de la requête est dans le texte, c'est un match
  if (queryWords.some(word => textLower.includes(word))) return true;
  
  // Algorithme simple de distance d'édition (Levenshtein simplifié)
  // Pour détecter les fautes de frappe légères
  const distanceMax = Math.floor(queryLower.length * (1 - threshold));
  
  // Pour chaque mot dans le texte, vérifier s'il est suffisamment proche d'un mot de la requête
  const textWords = textLower.split(/\s+/).filter(word => word.length > 2);
  
  for (const textWord of textWords) {
    for (const queryWord of queryWords) {
      // Si les longueurs sont trop différentes, ce n'est probablement pas similaire
      if (Math.abs(textWord.length - queryWord.length) > distanceMax) continue;
      
      // Compter les caractères communs dans l'ordre
      let matches = 0;
      let i = 0, j = 0;
      
      while (i < textWord.length && j < queryWord.length) {
        if (textWord[i] === queryWord[j]) {
          matches++;
          i++;
          j++;
        } else {
          // Si pas de correspondance, avancer dans le mot le plus long
          if (textWord.length > queryWord.length) i++;
          else j++;
        }
      }
      
      // Calculer la similarité en fonction des correspondances
      const similarity = matches / Math.max(textWord.length, queryWord.length);
      
      if (similarity >= threshold) return true;
    }
  }
  
  return false;
}

/**
 * Search for media in external APIs and local database
 */
export async function searchMedia(type: MediaType, query: string): Promise<any> {
  try {
    console.log(`Searching for ${type} with query: ${query}`);
    
    // 1. D'abord, rechercher dans la base de données Mookka (si disponible)
    let localMedia = [];
    let localError = null;
    
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('type', type)
        .or(`title.ilike.%${query}%, author.ilike.%${query}%, director.ilike.%${query}%`)
        .order('rating', { ascending: false })
        .limit(20);
      
      localMedia = data || [];
      localError = error;
    } catch (e) {
      console.log('Local database search error (expected during development):', e);
    }
    
    if (localError) {
      console.error("Erreur lors de la recherche locale de médias:", localError);
    }
    
    // 2. Ensuite, rechercher via l'API externe
    console.log(`Calling edge function for ${type}...`);
    const { data: apiData, error: apiError } = await supabase.functions.invoke('fetch-media', {
      body: { type, query }
    });

    if (apiError) {
      console.error("Erreur lors de la recherche de médias:", apiError);
      throw apiError;
    }
    
    console.log(`Received response for ${type}:`, apiData?.results?.length || 0, 'results');
    
    // 3. Utiliser directement les résultats de l'API sans transformation supplémentaire
    // puisque notre fonction Edge formate déjà les résultats correctement
    let apiResults = apiData?.results || [];
    
    // 4. Filtrer plus strictement les contenus inappropriés (optionnel)
    apiResults = filterAdultContent(apiResults);
    
    // 5. Fusionner les résultats (base de données + API) en évitant les doublons
    let mergedResults: any[] = [];
    
    // D'abord, ajouter les résultats locaux (Mookka)
    if (localMedia && localMedia.length > 0) {
      mergedResults = localMedia.map((item) => ({
        id: item.id,
        externalId: item.external_id,
        title: item.title,
        type: item.type,
        coverImage: item.cover_image,
        year: item.year,
        rating: item.rating,
        genres: item.genres,
        description: item.description,
        author: item.author,
        director: item.director,
        fromDatabase: true // Marquer comme venant de la base de données
      }));
    }
    
    // Ensuite, ajouter les résultats de l'API 
    // (pas besoin de vérifier les doublons pour le moment puisque c'est un démonstrateur)
    mergedResults = [...mergedResults, ...apiResults];
    
    return { results: mergedResults };
  } catch (error) {
    console.error("Erreur dans searchMedia:", error);
    // Retourner un tableau vide en cas d'erreur pour éviter de casser l'interface
    return { results: [] };
  }
}

/**
 * Get media details by ID
 */
export async function getMediaById(type: MediaType, id: string): Promise<any> {
  try {
    console.log(`Fetching details for ${type}/${id}`);
    
    const { data, error } = await supabase.functions.invoke('fetch-media-details', {
      body: { type, id }
    }).catch(e => {
      console.error("Error invoking fetch-media-details function:", e);
      // Fallback to regular fetch-media function
      return supabase.functions.invoke('fetch-media', {
        body: { type, id }
      });
    });

    if (error) {
      console.error("Erreur lors de la récupération du média:", error);
      throw error;
    }

    if (!data) {
      console.error("Aucune donnée reçue pour le média");
      return null;
    }

    console.log(`Received media details for ${type}/${id}`);
    return data;
  } catch (error) {
    console.error("Erreur dans getMediaById:", error);
    throw error;
  }
}

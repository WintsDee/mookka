
import { supabase } from "@/integrations/supabase/client";
import { Media, MediaType } from "@/types";
import { filterAdultContent } from './filters';
import { formatBookSearchResult, formatFilmSearchResult, formatGameSearchResult, formatSerieSearchResult } from './formatters';

/**
 * Recherche fuzzy qui détecte les termes similaires et les fautes de frappe
 */
function isSimilarText(text: string, query: string, threshold: number = 0.6): boolean {
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
    // 1. D'abord, rechercher dans la base de données Mookka
    // Utilisez .or pour chercher dans titre ET dans l'auteur/réalisateur
    const { data: localMedia, error: localError } = await supabase
      .from('media')
      .select('*')
      .eq('type', type)
      .or(`title.ilike.%${query}%, author.ilike.%${query}%, director.ilike.%${query}%`)
      .order('rating', { ascending: false })
      .limit(20);
    
    if (localError) {
      console.error("Erreur lors de la recherche locale de médias:", localError);
    }
    
    // 2. Ensuite, rechercher via l'API externe
    const { data: apiData, error: apiError } = await supabase.functions.invoke('fetch-media', {
      body: { type, query }
    });

    if (apiError) {
      console.error("Erreur lors de la recherche de médias:", apiError);
      throw apiError;
    }
    
    // 3. Traiter les résultats de l'API
    let apiResults: any[] = [];
    if (apiData) {
      switch (type) {
        case 'film':
          apiResults = apiData.results?.map(formatFilmSearchResult) || [];
          // Tri par popularité pour TMDB
          apiResults.sort((a, b) => b.popularity - a.popularity);
          break;
        case 'serie':
          apiResults = apiData.results?.map(formatSerieSearchResult) || [];
          // Tri par popularité pour TMDB
          apiResults.sort((a, b) => b.popularity - a.popularity);
          break;
        case 'book':
          apiResults = apiData.items?.map(formatBookSearchResult) || [];
          // Filtrer les livres avec un score de pertinence trop bas
          apiResults = apiResults.filter(item => item.popularity > -20);
          // Tri par score de pertinence pour Google Books
          apiResults.sort((a, b) => b.popularity - a.popularity);
          break;
        case 'game':
          apiResults = apiData.results?.map(formatGameSearchResult) || [];
          // Pour les jeux, on garde tous les résultats et on se base sur le tri de l'API
          break;
      }
    }
    
    // 4. Filtrer plus strictement les contenus inappropriés
    apiResults = filterAdultContent(apiResults);
    
    // 5. Appliquer le filtre de pertinence pour les types autre que 'game'
    // Pour les jeux, on fait confiance au tri de l'API RAWG
    if (type !== 'game') {
      apiResults = apiResults.filter(item => {
        // Vérifier la pertinence sur le titre
        const titleMatch = isSimilarText(item.title, query);
        
        // Vérifier aussi la pertinence sur les champs auteur/réalisateur
        const creatorMatch = (
          isSimilarText(item.author, query) || 
          isSimilarText(item.director, query)
        );
        
        // Accepter si l'un des deux correspond
        return titleMatch || creatorMatch;
      });
    }
    
    // 6. Fusionner les résultats (base de données + API) en évitant les doublons
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
    
    // Ensuite, ajouter les résultats de l'API en évitant les doublons
    const existingExternalIds = new Set(mergedResults.map(item => item.externalId));
    
    for (const apiItem of apiResults) {
      if (!existingExternalIds.has(apiItem.id)) {
        mergedResults.push(apiItem);
      }
    }
    
    // 7. Trier les résultats finaux par pertinence
    mergedResults.sort((a, b) => {
      // Donner priorité aux médias de la base de données
      if (a.fromDatabase && !b.fromDatabase) return -1;
      if (!a.fromDatabase && b.fromDatabase) return 1;
      
      // Pour les jeux, se fier davantage à la popularité (déjà triée par l'API)
      if (type === 'game') {
        return b.popularity - a.popularity;
      }
      
      // Pour les autres médias, calculer un score de pertinence
      const queryLower = query.toLowerCase();
      
      // Calculer le score de pertinence du titre
      const titleScoreA = a.title && a.title.toLowerCase().includes(queryLower) ? 10 : 0;
      const titleScoreB = b.title && b.title.toLowerCase().includes(queryLower) ? 10 : 0;
      
      // Calculer le score de pertinence de l'auteur/réalisateur
      const authorScoreA = 
        (a.author && a.author.toLowerCase().includes(queryLower)) || 
        (a.director && a.director.toLowerCase().includes(queryLower)) ? 8 : 0;
      
      const authorScoreB = 
        (b.author && b.author.toLowerCase().includes(queryLower)) || 
        (b.director && b.director.toLowerCase().includes(queryLower)) ? 8 : 0;
      
      // Ajouter le score de popularité
      const popularityScoreA = (a.popularity || a.rating || 0) / 2;
      const popularityScoreB = (b.popularity || b.rating || 0) / 2;
      
      // Score total
      const totalScoreA = titleScoreA + authorScoreA + popularityScoreA;
      const totalScoreB = titleScoreB + authorScoreB + popularityScoreB;
      
      return totalScoreB - totalScoreA;
    });
    
    return { results: mergedResults };
  } catch (error) {
    console.error("Erreur dans searchMedia:", error);
    throw error;
  }
}

/**
 * Get media details by ID
 */
export async function getMediaById(type: MediaType, id: string): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-media', {
      body: { type, id }
    });

    if (error) {
      console.error("Erreur lors de la récupération du média:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur dans getMediaById:", error);
    throw error;
  }
}

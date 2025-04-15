
import { supabase } from "@/integrations/supabase/client";
import { Media, MediaType } from "@/types";
import { filterAdultContent } from './filters';
import { formatBookSearchResult, formatFilmSearchResult, formatGameSearchResult, formatSerieSearchResult } from './formatters';

/**
 * Search for media in external APIs and local database
 */
export async function searchMedia(type: MediaType, query: string): Promise<any> {
  try {
    // 1. D'abord, rechercher dans la base de données Mookka
    const { data: localMedia, error: localError } = await supabase
      .from('media')
      .select('*')
      .eq('type', type)
      .ilike('title', `%${query}%`)
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
          // Tri par pertinence pour RAWG
          apiResults.sort((a, b) => b.popularity - a.popularity);
          break;
      }
    }
    
    // 4. Filtrer plus strictement les contenus inappropriés
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
    
    // Ensuite, ajouter les résultats de l'API en évitant les doublons
    const existingExternalIds = new Set(mergedResults.map(item => item.externalId));
    
    for (const apiItem of apiResults) {
      if (!existingExternalIds.has(apiItem.id)) {
        mergedResults.push(apiItem);
      }
    }
    
    // 6. Trier les résultats finaux par pertinence
    mergedResults.sort((a, b) => {
      // Donner priorité aux médias de la base de données
      if (a.fromDatabase && !b.fromDatabase) return -1;
      if (!a.fromDatabase && b.fromDatabase) return 1;
      
      // Ensuite, trier par popularité calculée ou rating
      const aPopularity = a.popularity || a.rating || 0;
      const bPopularity = b.popularity || b.rating || 0;
      return bPopularity - aPopularity;
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

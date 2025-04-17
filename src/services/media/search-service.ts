
import { supabase } from "@/integrations/supabase/client";
import { MediaType } from "@/types";
import { formatBookSearchResult, formatFilmSearchResult, formatSerieSearchResult, formatGameSearchResult } from "./formatters";
import { filterAdultContent } from "./filters";

// Cache pour stocker les résultats de recherche
const searchCache = new Map<string, { results: any[], timestamp: number, totalPages: number, totalResults: number }>();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

/**
 * Génère une clé de cache pour la recherche
 */
function getCacheKey(type: MediaType, query: string, page: number): string {
  return `${type}:${query}:${page}`;
}

/**
 * Nettoie les entrées de cache expirées
 */
function cleanupCache(): void {
  const now = Date.now();
  searchCache.forEach((value, key) => {
    if (now - value.timestamp > CACHE_DURATION) {
      searchCache.delete(key);
    }
  });
}

/**
 * Recherche de médias par type et terme de recherche
 */
export async function searchMedia(type: MediaType, query: string, page: number = 1, adultContentAllowed: boolean = false) {
  if (!query) {
    return { results: [], total_pages: 0, total_results: 0 };
  }

  // Nettoyer périodiquement le cache
  cleanupCache();

  const cacheKey = getCacheKey(type, query, page);
  const cachedResult = searchCache.get(cacheKey);

  // Si résultat en cache et non expiré, l'utiliser
  if (cachedResult) {
    // Filtrer le contenu pour adultes si nécessaire (au cas où les préférences ont changé)
    const filteredResults = filterAdultContent(cachedResult.results, adultContentAllowed);
    return {
      results: filteredResults,
      total_pages: cachedResult.totalPages,
      total_results: cachedResult.totalResults
    };
  }

  try {
    let results: any[] = [];
    let totalPages = 0;
    let totalResults = 0;

    // Appeler la fonction Edge de recherche appropriée selon le type
    const { data, error } = await supabase.functions.invoke(`search-${type}`, {
      body: { query, page }
    });

    if (error) {
      console.error(`Erreur lors de la recherche de ${type}:`, error);
      throw error;
    }

    if (data) {
      results = data.results || [];
      totalPages = data.total_pages || 0;
      totalResults = data.total_results || 0;

      // Filtrer le contenu pour adultes si nécessaire
      results = filterAdultContent(results, adultContentAllowed);

      // Formater les résultats selon le type
      switch (type) {
        case 'film':
          results = results.map(formatFilmSearchResult);
          break;
        case 'serie':
          results = results.map(formatSerieSearchResult);
          break;
        case 'book':
          results = results.map(formatBookSearchResult);
          break;
        case 'game':
          results = results.map(formatGameSearchResult);
          break;
      }

      // Mettre en cache les résultats
      searchCache.set(cacheKey, {
        results: [...results], // Copie pour éviter les modifications par référence
        timestamp: Date.now(),
        totalPages,
        totalResults
      });
    }

    return {
      results,
      total_pages: totalPages,
      total_results: totalResults
    };
  } catch (error) {
    console.error(`Erreur lors de la recherche de ${type}:`, error);
    throw error;
  }
}

// Cache pour les détails des médias
const detailsCache = new Map<string, { data: any, timestamp: number }>();

/**
 * Récupère les détails d'un média par son ID
 */
export async function getMediaById(type: MediaType, id: string) {
  try {
    const cacheKey = `${type}:${id}`;
    const cachedDetails = detailsCache.get(cacheKey);
    
    // Si données en cache et non expirées, les utiliser
    if (cachedDetails && (Date.now() - cachedDetails.timestamp < CACHE_DURATION)) {
      return cachedDetails.data;
    }
    
    // Vérifier si le média existe déjà dans notre base de données
    const { data: existingMedia } = await supabase
      .from('media')
      .select('*')
      .eq('external_id', id)
      .eq('type', type)
      .maybeSingle();

    if (existingMedia) {
      // Mettre en cache et retourner
      detailsCache.set(cacheKey, {
        data: existingMedia,
        timestamp: Date.now()
      });
      return existingMedia;
    }

    // Sinon, appeler l'API externe via la fonction Edge correspondante
    const { data, error } = await supabase.functions.invoke(`get-${type}-details`, {
      body: { id }
    });

    if (error) {
      console.error(`Erreur lors de la récupération des détails de ${type}:`, error);
      throw error;
    }
    
    // Mettre en cache les résultats
    if (data) {
      detailsCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }

    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails de ${type}:`, error);
    throw error;
  }
}


import { supabase } from "@/integrations/supabase/client";
import { MediaType } from "@/types";
import { formatBookSearchResult, formatFilmSearchResult, formatSerieSearchResult, formatGameSearchResult } from "./formatters";
import { filterAdultContent } from "./filters";

/**
 * Recherche de médias par type et terme de recherche
 */
export async function searchMedia(type: MediaType, query: string, page: number = 1, adultContentAllowed: boolean = false) {
  if (!query) {
    return { results: [], total_pages: 0, total_results: 0 };
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

/**
 * Récupère les détails d'un média par son ID
 */
export async function getMediaById(type: MediaType, id: string) {
  try {
    // Vérifier si le média existe déjà dans notre base de données
    const { data: existingMedia } = await supabase
      .from('media')
      .select('*')
      .eq('external_id', id)
      .eq('type', type)
      .maybeSingle();

    if (existingMedia) {
      // Si oui, utiliser ces données
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

    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails de ${type}:`, error);
    throw error;
  }
}

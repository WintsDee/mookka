
import { supabase } from "@/integrations/supabase/client";
import { Media, MediaType } from "@/types";
import { filterAdultContent } from '../filters';
import { mergeSearchResults } from './results-merger';
import { filterByRelevance } from './similarity-utils';
import { 
  formatFilmSearchResult,
  formatSerieSearchResult,
  formatBookSearchResult,
  formatGameSearchResult
} from '../formatters';

/**
 * Search for media in external APIs and local database
 */
export async function searchMedia(type: MediaType, query: string): Promise<any> {
  try {
    // 1. Search in local Mookka database
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
    
    // 2. Search via external API
    const { data: apiData, error: apiError } = await supabase.functions.invoke('fetch-media', {
      body: { type, query }
    });

    if (apiError) {
      console.error("Erreur lors de la recherche de médias:", apiError);
      throw apiError;
    }

    // 3. Filter and format results
    const apiResults = formatApiResults(apiData, type, query);
    
    // 4. Merge and sort results
    const mergedResults = mergeSearchResults(localMedia || [], apiResults, query, type);
    
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

function formatApiResults(apiData: any, type: MediaType, query: string): any[] {
  if (!apiData) return [];
  
  let results = [];
  switch (type) {
    case 'film':
      results = apiData.results?.map(formatFilmSearchResult) || [];
      results.sort((a, b) => b.popularity - a.popularity);
      break;
    case 'serie':
      results = apiData.results?.map(formatSerieSearchResult) || [];
      results.sort((a, b) => b.popularity - a.popularity);
      break;
    case 'book':
      results = apiData.items?.map(formatBookSearchResult) || [];
      results = results.filter(item => item.popularity > -20);
      results.sort((a, b) => b.popularity - a.popularity);
      break;
    case 'game':
      results = apiData.results?.map(formatGameSearchResult) || [];
      break;
  }
  
  // Filter adult content
  results = filterAdultContent(results);
  
  // Apply relevance filter except for games
  if (type !== 'game') {
    results = filterByRelevance(results, query);
  }
  
  return results;
}

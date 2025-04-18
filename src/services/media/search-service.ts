
import { supabase } from "@/integrations/supabase/client";
import { Media, MediaType } from "@/types";
import { filterAdultContent } from './filters';
import { mergeSearchResults } from './search/search-merger';

/**
 * Search for media in external APIs and local database
 */
export async function searchMedia(type: MediaType, query: string): Promise<any> {
  console.log(`Searching for "${query}" in media type: ${type}`);
  
  try {
    // 1. Search in local database
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

    console.log(`Local database search results: ${localMedia?.length || 0} items found`);
    
    // 2. Search via external API
    const { data: apiData, error: apiError } = await supabase.functions.invoke('fetch-media', {
      body: { type, query }
    });

    if (apiError) {
      console.error("Erreur lors de la recherche de médias via API:", apiError);
    }

    console.log(`API search results:`, apiData);
    
    // 3. Format API results based on media type
    const apiResults = formatApiResults(apiData, type);
    console.log(`Formatted API results: ${apiResults.length} items`);
    
    // 4. Filter adult content
    const filteredResults = filterAdultContent(apiResults);
    
    // 5. Merge and sort results
    const mergedResults = mergeSearchResults(localMedia || [], filteredResults, query);
    
    console.log(`Final merged results: ${mergedResults.length} items`);
    
    return { results: mergedResults };
  } catch (error) {
    console.error("Erreur dans searchMedia:", error);
    throw error;
  }
}

function formatApiResults(apiData: any, type: MediaType): any[] {
  if (!apiData) return [];
  
  let results: any[] = [];
  
  switch (type) {
    case 'film':
    case 'serie':
      results = apiData.results || [];
      break;
    case 'book':
      // Handle book search results including fallback data
      if (apiData.quotaExceeded || apiData.error) {
        console.log(apiData.quotaExceeded 
          ? "Utilisation des données de secours pour les livres (quota dépassé)"
          : "Utilisation des données de secours pour les livres (erreur API)"
        );
      }
      results = apiData.items || [];
      break;
    case 'game':
      results = apiData.results || [];
      break;
  }
  
  return results;
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

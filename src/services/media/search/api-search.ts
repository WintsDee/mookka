
import { supabase } from "@/integrations/supabase/client";
import { MediaType } from "@/types";
import { 
  formatFilmSearchResult, 
  formatSerieSearchResult, 
  formatBookSearchResult, 
  formatGameSearchResult 
} from '../formatters';

/**
 * Search for media in external APIs through Supabase Edge Functions
 */
export async function searchExternalApis(
  type: MediaType, 
  query: string,
  abortSignal?: AbortSignal
): Promise<any[]> {
  try {
    // Empêcher les recherches trop courtes pour éviter de surcharger les APIs externes
    if (query.length < 2) {
      console.log("Query too short for external API search");
      return [];
    }
    
    console.log(`Searching for ${type} with query: "${query}"`);
    
    // Call Supabase Function to fetch from external APIs
    const options: any = { body: { type, query } };
    
    // Only add the signal if it exists (for compatibility)
    if (abortSignal) {
      options.signal = abortSignal;
    }
    
    const { data: apiData, error: apiError } = await supabase.functions.invoke('fetch-media', options);

    if (apiError) {
      console.error("Error searching media via API:", apiError);
      throw apiError;
    }

    if (!apiData) {
      console.log("No data returned from API");
      return [];
    }

    console.log(`API search results:`, apiData);
    
    // Process API results based on media type
    let apiResults: any[] = [];
    
    if (apiData) {
      switch (type) {
        case 'film':
          apiResults = Array.isArray(apiData.results) ? apiData.results.map(formatFilmSearchResult).filter(Boolean) : [];
          // Sort by popularity for TMDB
          apiResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
          break;
          
        case 'serie':
          apiResults = Array.isArray(apiData.results) ? apiData.results.map(formatSerieSearchResult).filter(Boolean) : [];
          // Sort by popularity for TMDB
          apiResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
          break;
          
        case 'book':
          apiResults = Array.isArray(apiData.items) ? apiData.items.map(formatBookSearchResult).filter(Boolean) : [];
          // Filter books with low relevance score
          apiResults = apiResults.filter(item => (item.popularity || 0) > -20);
          // Sort by relevance score for Google Books
          apiResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
          break;
          
        case 'game':
          apiResults = Array.isArray(apiData.results) ? apiData.results.map(formatGameSearchResult).filter(Boolean) : [];
          // Sort by relevance for RAWG
          apiResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
          break;
      }
    }
    
    console.log(`Formatted API results: ${apiResults.length} items`);
    return apiResults;
  } catch (error: any) {
    // Check if it's an abort error (caused by request cancellation)
    if (error.name === 'AbortError') {
      console.log('API search request was cancelled');
      return [];
    }
    
    console.error("Error in searchExternalApis:", error);
    throw error;
  }
}

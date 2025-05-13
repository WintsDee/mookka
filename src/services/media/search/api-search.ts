
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
    // Call Supabase Function to fetch from external APIs
    const { data: apiData, error: apiError } = await supabase.functions.invoke('fetch-media', {
      body: { type, query },
      signal: abortSignal
    });

    if (apiError) {
      console.error("Error searching media via API:", apiError);
      throw apiError;
    }

    console.log(`API search results:`, apiData);
    
    // Process API results based on media type
    let apiResults: any[] = [];
    
    if (apiData) {
      switch (type) {
        case 'film':
          apiResults = apiData.results?.map(formatFilmSearchResult) || [];
          // Sort by popularity for TMDB
          apiResults.sort((a, b) => b.popularity - a.popularity);
          break;
          
        case 'serie':
          apiResults = apiData.results?.map(formatSerieSearchResult) || [];
          // Sort by popularity for TMDB
          apiResults.sort((a, b) => b.popularity - a.popularity);
          break;
          
        case 'book':
          apiResults = apiData.items?.map(formatBookSearchResult) || [];
          // Filter books with low relevance score
          apiResults = apiResults.filter(item => item.popularity > -20);
          // Sort by relevance score for Google Books
          apiResults.sort((a, b) => b.popularity - a.popularity);
          break;
          
        case 'game':
          apiResults = apiData.results?.map(formatGameSearchResult) || [];
          // Sort by relevance for RAWG
          apiResults.sort((a, b) => b.popularity - a.popularity);
          break;
      }
    }
    
    console.log(`Formatted API results: ${apiResults.length} items`);
    return apiResults;
  } catch (error) {
    // Check if it's an abort error (caused by request cancellation)
    if (error.name === 'AbortError') {
      console.log('API search request was cancelled');
      return [];
    }
    
    console.error("Error in searchExternalApis:", error);
    throw error;
  }
}

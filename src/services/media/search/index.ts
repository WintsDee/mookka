
import { MediaType } from "@/types";
import { searchLocalDatabase } from "./database-search";
import { searchExternalApis } from "./api-search";
import { mergeSearchResults, sortResultsByRelevance } from "./utils";
import { filterAdultContent } from '../filters';

/**
 * Search for media in external APIs and local database
 */
export async function searchMedia(
  type: MediaType, 
  query: string,
  abortSignal?: AbortSignal
): Promise<any> {
  console.log(`Searching for "${query}" in media type: ${type}`);
  
  try {
    // 1. First, search in the Mookka database
    const localMedia = await searchLocalDatabase(type, query);
    
    // 2. Then, search via external API
    const apiResults = await searchExternalApis(type, query, abortSignal);
    
    // 3. Filter out inappropriate content
    const filteredApiResults = filterAdultContent(apiResults);
    
    // 4. Merge results (database + API) avoiding duplicates
    const mergedResults = mergeSearchResults(localMedia, filteredApiResults);
    
    // 5. Sort final results by relevance
    const sortedResults = sortResultsByRelevance(mergedResults, query);
    
    console.log(`Final merged results: ${sortedResults.length} items`);
    
    return { results: sortedResults };
  } catch (error) {
    console.error("Error in searchMedia:", error);
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
      console.error("Error retrieving media:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getMediaById:", error);
    throw error;
  }
}

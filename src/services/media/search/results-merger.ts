
import { MediaType } from "@/types";
import { calculateRelevanceScore } from "./scoring-utils";

export function mergeSearchResults(
  localResults: any[],
  apiResults: any[],
  query: string,
  type: MediaType
): any[] {
  let mergedResults: any[] = [];
  
  // First, add local results with metadata
  if (localResults?.length > 0) {
    mergedResults = localResults.map((item) => ({
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
      fromDatabase: true
    }));
  }
  
  // Add API results while avoiding duplicates
  const existingExternalIds = new Set(mergedResults.map(item => item.externalId));
  
  for (const apiItem of apiResults) {
    if (!existingExternalIds.has(apiItem.id)) {
      mergedResults.push(apiItem);
    }
  }
  
  // Sort results by relevance score
  mergedResults.sort((a, b) => {
    const queryLower = query.toLowerCase();
    
    // Check for exact title matches - these get highest priority
    const titleA = (a.title || '').toLowerCase();
    const titleB = (b.title || '').toLowerCase();
    
    const exactMatchA = titleA === queryLower;
    const exactMatchB = titleB === queryLower;
    
    // If one has an exact match and the other doesn't, prioritize the exact match
    if (exactMatchA && !exactMatchB) return -1;
    if (!exactMatchA && exactMatchB) return 1;
    
    // Prioritize local database results
    if (a.fromDatabase && !b.fromDatabase) return -1;
    if (!a.fromDatabase && b.fromDatabase) return 1;
    
    // Calculate relevance scores
    const scoreA = calculateRelevanceScore(a, query, type);
    const scoreB = calculateRelevanceScore(b, query, type);
    
    return scoreB - scoreA;
  });
  
  return mergedResults;
}

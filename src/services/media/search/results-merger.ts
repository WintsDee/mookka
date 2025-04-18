
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

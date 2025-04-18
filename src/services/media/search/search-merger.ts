
import { MediaType } from "@/types";
import { isSimilarText } from "./search-utils";

interface SearchResult {
  id: string;
  title: string;
  type: MediaType;
  author?: string;
  director?: string;
  fromDatabase?: boolean;
  popularity?: number;
  rating?: number;
  externalId?: string;
}

export function mergeSearchResults(localResults: any[], apiResults: any[], query: string): any[] {
  let mergedResults: any[] = [];
  
  // Add local database results first
  if (localResults && localResults.length > 0) {
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
  
  // Add API results, avoiding duplicates
  const existingExternalIds = new Set(mergedResults.map(item => item.externalId));
  
  for (const apiItem of apiResults) {
    if (!existingExternalIds.has(apiItem.id)) {
      mergedResults.push(apiItem);
    }
  }
  
  // Sort results by relevance
  return sortByRelevance(mergedResults, query);
}

function sortByRelevance(results: SearchResult[], query: string): SearchResult[] {
  return results.sort((a, b) => {
    if (a.fromDatabase && !b.fromDatabase) return -1;
    if (!a.fromDatabase && b.fromDatabase) return 1;
    
    const queryLower = query.toLowerCase();
    
    const titleScoreA = a.title && a.title.toLowerCase().includes(queryLower) ? 10 : 0;
    const titleScoreB = b.title && b.title.toLowerCase().includes(queryLower) ? 10 : 0;
    
    const authorScoreA = 
      (a.author && a.author.toLowerCase().includes(queryLower)) || 
      (a.director && a.director.toLowerCase().includes(queryLower)) ? 8 : 0;
    
    const authorScoreB = 
      (b.author && b.author.toLowerCase().includes(queryLower)) || 
      (b.director && b.director.toLowerCase().includes(queryLower)) ? 8 : 0;
    
    const popularityScoreA = (a.popularity || a.rating || 0) / 2;
    const popularityScoreB = (b.popularity || b.rating || 0) / 2;
    
    const totalScoreA = titleScoreA + authorScoreA + popularityScoreA;
    const totalScoreB = titleScoreB + authorScoreB + popularityScoreB;
    
    return totalScoreB - totalScoreA;
  });
}

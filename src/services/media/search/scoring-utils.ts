
import { MediaType } from "@/types";
import { isSimilarText } from "./similarity-utils";

export function calculateRelevanceScore(
  item: any,
  query: string,
  type: MediaType
): number {
  const queryLower = query.toLowerCase();
  
  // Base score calculation for all media types
  let score = 0;
  
  // Title matching (highest priority)
  const titleMatch = isSimilarText(item.title, query);
  if (titleMatch) score += 10;
  
  // Creator matching (author/director - high priority)
  const creatorMatch = 
    isSimilarText(item.author, query) || 
    isSimilarText(item.director, query);
  if (creatorMatch) score += 8;
  
  // Rating/popularity boost
  const popularityScore = (item.popularity || item.rating || 0) / 2;
  score += popularityScore;
  
  // Type-specific scoring adjustments
  switch (type) {
    case 'game':
      // Games rely more heavily on platform data and ratings
      if (item.platforms?.length) {
        score += Math.min(item.platforms.length, 5);
      }
      break;
      
    case 'book':
      // Books get extra points for recent publications
      if (item.year && item.year > 2000) {
        score += Math.min((item.year - 2000) / 10, 3);
      }
      break;
      
    case 'film':
    case 'serie':
      // Movies and TV shows get extra points for vote counts
      if (item.vote_count) {
        score += Math.min(item.vote_count / 1000, 5);
      }
      break;
  }
  
  return score;
}

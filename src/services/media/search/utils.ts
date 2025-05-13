
/**
 * Utility functions for media search operations
 */

/**
 * Fuzzy search function that detects similar terms and typos
 */
export function isSimilarText(text: string, query: string, threshold: number = 0.7): boolean {
  if (!text || !query) return false;
  
  // Convert to lowercase for comparison
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // If text contains the query, it's a direct match
  if (textLower.includes(queryLower)) return true;
  
  // Split the query into words and check if any is present
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
  
  // If any of the query words is in the text, it's a match
  if (queryWords.some(word => textLower.includes(word))) return true;
  
  // Simple Levenshtein distance algorithm (simplified)
  // To detect slight typos
  const distanceMax = Math.floor(queryLower.length * (1 - threshold));
  
  // For each word in the text, check if it's close enough to a query word
  const textWords = textLower.split(/\s+/).filter(word => word.length > 2);
  
  for (const textWord of textWords) {
    for (const queryWord of queryWords) {
      // If the lengths are too different, it's probably not similar
      if (Math.abs(textWord.length - queryWord.length) > distanceMax) continue;
      
      // Count matching characters in order
      let matches = 0;
      let i = 0, j = 0;
      
      while (i < textWord.length && j < queryWord.length) {
        if (textWord[i] === queryWord[j]) {
          matches++;
          i++;
          j++;
        } else {
          // If no match, advance in the longer word
          if (textWord.length > queryWord.length) i++;
          else j++;
        }
      }
      
      // Calculate similarity based on matches
      const similarity = matches / Math.max(textWord.length, queryWord.length);
      
      if (similarity >= threshold) return true;
    }
  }
  
  return false;
}

/**
 * Merge and deduplicate results from local database and external APIs
 */
export function mergeSearchResults(localMedia: any[], apiResults: any[]): any[] {
  let mergedResults: any[] = [];
  
  // First, add local results (from Mookka database)
  if (localMedia && localMedia.length > 0) {
    mergedResults = localMedia.map((item) => ({
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
      fromDatabase: true // Mark as coming from database
    }));
  }
  
  // Then, add API results avoiding duplicates
  const existingExternalIds = new Set(mergedResults.map(item => item.externalId));
  
  for (const apiItem of apiResults) {
    if (!existingExternalIds.has(apiItem.id)) {
      mergedResults.push(apiItem);
    }
  }
  
  return mergedResults;
}

/**
 * Sort results by relevance based on query match and popularity
 */
export function sortResultsByRelevance(results: any[], query: string): any[] {
  const queryLower = query.toLowerCase();
  
  return results.sort((a, b) => {
    // Prioritize database items
    if (a.fromDatabase && !b.fromDatabase) return -1;
    if (!a.fromDatabase && b.fromDatabase) return 1;
    
    // Calculate relevance score based on title/author match with query
    const titleScoreA = a.title && a.title.toLowerCase().includes(queryLower) ? 10 : 0;
    const titleScoreB = b.title && b.title.toLowerCase().includes(queryLower) ? 10 : 0;
    
    const authorScoreA = 
      (a.author && a.author.toLowerCase().includes(queryLower)) || 
      (a.director && a.director.toLowerCase().includes(queryLower)) ? 8 : 0;
    
    const authorScoreB = 
      (b.author && b.author.toLowerCase().includes(queryLower)) || 
      (b.director && b.director.toLowerCase().includes(queryLower)) ? 8 : 0;
    
    // Add popularity score
    const popularityScoreA = (a.popularity || a.rating || 0) / 2;
    const popularityScoreB = (b.popularity || b.rating || 0) / 2;
    
    // Total score
    const totalScoreA = titleScoreA + authorScoreA + popularityScoreA;
    const totalScoreB = titleScoreB + authorScoreB + popularityScoreB;
    
    return totalScoreB - totalScoreA;
  });
}

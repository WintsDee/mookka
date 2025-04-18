
/**
 * Checks if two texts are similar using a fuzzy matching algorithm
 */
export function isSimilarText(text: string, query: string, threshold: number = 0.6): boolean {
  if (!text || !query) return false;
  
  // Convert to lowercase for comparison
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Direct match check
  if (textLower.includes(queryLower)) return true;
  
  // Word-based matching
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
  if (queryWords.some(word => textLower.includes(word))) return true;
  
  // Simple Levenshtein-like algorithm for typo detection
  const distanceMax = Math.floor(queryLower.length * (1 - threshold));
  const textWords = textLower.split(/\s+/).filter(word => word.length > 2);
  
  for (const textWord of textWords) {
    for (const queryWord of queryWords) {
      if (Math.abs(textWord.length - queryWord.length) > distanceMax) continue;
      
      let matches = 0;
      let i = 0, j = 0;
      
      while (i < textWord.length && j < queryWord.length) {
        if (textWord[i] === queryWord[j]) {
          matches++;
          i++;
          j++;
        } else {
          if (textWord.length > queryWord.length) i++;
          else j++;
        }
      }
      
      const similarity = matches / Math.max(textWord.length, queryWord.length);
      if (similarity >= threshold) return true;
    }
  }
  
  return false;
}

export function filterByRelevance(results: any[], query: string): any[] {
  return results.filter(item => {
    const titleMatch = isSimilarText(item.title, query);
    const creatorMatch = isSimilarText(item.author, query) || isSimilarText(item.director, query);
    return titleMatch || creatorMatch;
  });
}

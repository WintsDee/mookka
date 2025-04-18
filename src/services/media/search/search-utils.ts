
/**
 * Check if text is similar, accounting for typos and variations
 */
export function isSimilarText(text: string, query: string, threshold: number = 0.7): boolean {
  if (!text || !query) return false;
  
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  if (textLower.includes(queryLower)) return true;
  
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
  
  if (queryWords.some(word => textLower.includes(word))) return true;
  
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


export function sortSearchResults(data: any, type: string, query: string) {
  if (!data) return data;
  
  const queryLower = query.toLowerCase();
  
  if (type === 'book' && data.items) {
    data.items.sort((a: any, b: any) => {
      const titleA = (a.volumeInfo?.title || '').toLowerCase();
      const titleB = (b.volumeInfo?.title || '').toLowerCase();
      const authorA = (a.volumeInfo?.authors || []).join(' ').toLowerCase();
      const authorB = (b.volumeInfo?.authors || []).join(' ').toLowerCase();
      
      const exactTitleMatchA = titleA === queryLower ? 100 : 0;
      const exactTitleMatchB = titleB === queryLower ? 100 : 0;
      
      if (exactTitleMatchA !== exactTitleMatchB) {
        return exactTitleMatchB - exactTitleMatchA;
      }
      
      const scoreA = 
        (titleA.includes(queryLower) ? 30 : 0) + 
        (authorA === queryLower ? 25 : 0) + 
        (authorA.includes(queryLower) ? 15 : 0);
        
      const scoreB = 
        (titleB.includes(queryLower) ? 30 : 0) + 
        (authorB === queryLower ? 25 : 0) + 
        (authorB.includes(queryLower) ? 15 : 0);
        
      return scoreB - scoreA;
    });
  }
  
  if (type === 'game' && data.results) {
    data.results.sort((a: any, b: any) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      
      const exactMatchA = nameA === queryLower ? 100 : 0;
      const exactMatchB = nameB === queryLower ? 100 : 0;
      
      if (exactMatchA !== exactMatchB) {
        return exactMatchB - exactMatchA;
      }
      
      const scoreA = 
        (nameA.includes(queryLower) ? 30 : 0) + 
        (queryLower.includes(nameA) ? 15 : 0) +
        (a.rating || 0) * 3 +
        Math.min((a.ratings_count || 0) / 100, 15);
        
      const scoreB = 
        (nameB.includes(queryLower) ? 30 : 0) + 
        (queryLower.includes(nameB) ? 15 : 0) +
        (b.rating || 0) * 3 +
        Math.min((b.ratings_count || 0) / 100, 15);
      
      return scoreB - scoreA;
    });
  }
  
  return data;
}

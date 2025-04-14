
// Function to detect media type from content
export function detectMediaType(title: string, description: string, source: string): 'film' | 'serie' | 'book' | 'game' | 'general' {
  title = title.toLowerCase();
  description = description.toLowerCase();
  
  // Default category based on the source
  let defaultCategory: 'film' | 'serie' | 'book' | 'game' | 'general' = 'general';
  
  switch(source) {
    case 'ActuGaming':
    case 'Jeuxvideo.com':
      defaultCategory = 'game';
      break;
    case 'Ecran Large':
      // Detect if it's a film or serie
      if (title.includes('série') || title.includes('saison') || 
          description.includes('série') || description.includes('saison') || 
          description.includes('épisode') || title.includes('tv show') ||
          title.includes('télé') || title.includes('netflix') || 
          title.includes('disney+') || title.includes('prime video')) {
        return 'serie';
      }
      return 'film';
    case 'ActuaLitté':
      defaultCategory = 'book';
      break;
    default:
      // For general sources, try to detect the category
      const bookTerms = ['livre', 'roman', 'bd', 'manga', 'lecture', 'auteur', 'écrivain', 'bande dessinée', 'littérature'];
      const filmTerms = ['film', 'cinéma', 'réalisateur', 'acteur', 'actrice', 'blockbuster', 'box-office'];
      const serieTerms = ['série', 'saison', 'épisode', 'télévision', 'netflix', 'disney+', 'prime video', 'hbo'];
      const gameTerms = ['jeu', 'console', 'ps5', 'xbox', 'switch', 'nintendo', 'playstation', 'gaming', 'gamer'];
      
      // Count occurrences of terms in title and description
      let bookCount = 0, filmCount = 0, serieCount = 0, gameCount = 0;
      
      bookTerms.forEach(term => {
        if (title.includes(term) || description.includes(term)) bookCount++;
      });
      
      filmTerms.forEach(term => {
        if (title.includes(term) || description.includes(term)) filmCount++;
      });
      
      serieTerms.forEach(term => {
        if (title.includes(term) || description.includes(term)) serieCount++;
      });
      
      gameTerms.forEach(term => {
        if (title.includes(term) || description.includes(term)) gameCount++;
      });
      
      // Determine category based on highest count
      const maxCount = Math.max(bookCount, filmCount, serieCount, gameCount);
      
      if (maxCount === 0) {
        return defaultCategory;
      }
      
      if (bookCount === maxCount) return 'book';
      if (gameCount === maxCount) return 'game';
      if (serieCount === maxCount) return 'serie';
      if (filmCount === maxCount) return 'film';
      
      return defaultCategory;
  }
  
  return defaultCategory;
}

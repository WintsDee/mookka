
// Function to detect media type from content
export function detectMediaType(title: string, description: string, source: string): 'film' | 'serie' | 'book' | 'game' | 'general' {
  const lowTitle = title.toLowerCase();
  const lowDesc = description.toLowerCase();
  
  // Default category based on the source
  let defaultCategory: 'film' | 'serie' | 'book' | 'game' | 'general' = 'general';
  
  // Set default category based on the source
  switch(source) {
    case 'AlloCiné':
    case 'Ecran Large':
      defaultCategory = 'film';
      break;
    case 'CineSeries':
      defaultCategory = 'serie';
      break;
    case 'ActuaLitté':
    case 'Babelio':
    case 'Éditions Points':
      defaultCategory = 'book';
      break;
    case 'Jeuxvideo.com':
    case 'JeuxActu':
    case 'Gamekult':
      defaultCategory = 'game';
      break;
  }
  
  // For sites with mixed content, try to detect specific category
  if (defaultCategory === 'film' || defaultCategory === 'general') {
    // Check if it's a TV series instead of a film
    const seriesTerms = [
      'série', 'séries', 'saison', 'épisode', 'netflix', 'disney+', 'prime video',
      'hbo', 'apple tv+', 'canal+', 'tv show', 'télé', 'télévisée', 'télévisé',
      'showrunner', 'pilote', 'sitcom', 'show', 'mini-série'
    ];
    
    let seriesHits = 0;
    seriesTerms.forEach(term => {
      if (lowTitle.includes(term) || lowDesc.includes(term)) seriesHits++;
    });
    
    if (seriesHits >= 2) {
      return 'serie';
    }
  }
  
  // For general sources, try to detect the category
  if (defaultCategory === 'general') {
    const bookTerms = [
      'livre', 'roman', 'bd', 'manga', 'littérature', 'lecture', 'auteur', 'écrivain',
      'bande dessinée', 'édition', 'éditeur', 'bouquin', 'bibliothèque', 'liseuse',
      'librairie', 'pages', 'tome', 'chapitre', 'nouvelles', 'conte'
    ];
    
    const filmTerms = [
      'film', 'cinéma', 'réalisateur', 'acteur', 'actrice', 'blockbuster', 'box-office',
      'hollywood', 'casting', 'oscar', 'césar', 'avant-première', 'projection', 
      'long-métrage', 'court-métrage', 'réalisation', 'cinématographique'
    ];
    
    const serieTerms = [
      'série', 'séries', 'saison', 'épisode', 'netflix', 'disney+', 'prime video',
      'hbo', 'apple tv+', 'canal+', 'tv show', 'télé', 'télévisée', 'télévisé',
      'showrunner', 'pilote', 'sitcom', 'show', 'mini-série'
    ];
    
    const gameTerms = [
      'jeu', 'jeux vidéo', 'console', 'ps5', 'ps4', 'xbox', 'switch', 'nintendo',
      'playstation', 'gaming', 'gamer', 'joueur', 'manette', 'level', 'niveau',
      'steam', 'fps', 'rpg', 'mmorpg', 'battle royale', 'open world', 'monde ouvert'
    ];
    
    // Count occurrences of terms in title and description
    let bookCount = 0, filmCount = 0, serieCount = 0, gameCount = 0;
    
    bookTerms.forEach(term => {
      if (lowTitle.includes(term)) bookCount += 2;  // Title matches are weighted higher
      if (lowDesc.includes(term)) bookCount += 1;
    });
    
    filmTerms.forEach(term => {
      if (lowTitle.includes(term)) filmCount += 2;
      if (lowDesc.includes(term)) filmCount += 1;
    });
    
    serieTerms.forEach(term => {
      if (lowTitle.includes(term)) serieCount += 2;
      if (lowDesc.includes(term)) serieCount += 1;
    });
    
    gameTerms.forEach(term => {
      if (lowTitle.includes(term)) gameCount += 2;
      if (lowDesc.includes(term)) gameCount += 1;
    });
    
    // Determine category based on highest count
    const scores = [
      { category: 'book', count: bookCount },
      { category: 'film', count: filmCount },
      { category: 'serie', count: serieCount },
      { category: 'game', count: gameCount }
    ];
    
    scores.sort((a, b) => b.count - a.count);
    
    // Only change from default if we have at least some evidence
    if (scores[0].count > 0) {
      return scores[0].category as 'film' | 'serie' | 'book' | 'game' | 'general';
    }
  }
  
  return defaultCategory;
}

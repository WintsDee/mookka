
// Function to detect media type from content
export function detectMediaType(title: string, description: string, source: string): 'film' | 'serie' | 'book' | 'game' | 'general' {
  title = title.toLowerCase();
  description = description.toLowerCase();
  
  // Default category based on the source
  let defaultCategory: 'film' | 'serie' | 'book' | 'game' | 'general' = 'general';
  
  // Certaines sources sont spécifiques à une catégorie
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
    case 'Babelio':
    case 'Éditions Points':
      defaultCategory = 'book';
      break;
    default:
      // Pour les sources générales, on détecte la catégorie
      const bookTerms = [
        'livre', 'roman', 'bd', 'manga', 'lecture', 'auteur', 'écrivain', 
        'bande dessinée', 'littérature', 'poésie', 'essai', 'biographie',
        'bibliothèque', 'édition', 'librairie', 'bouquin', 'tome', 'éditeur',
        'publication', 'recueil', 'best-seller', 'prix littéraire', 'fnac livre'
      ];
      
      const filmTerms = [
        'film', 'cinéma', 'réalisateur', 'acteur', 'actrice', 'blockbuster', 
        'box-office', 'projection', 'sortie ciné', 'bande-annonce', 'trailer'
      ];
      
      const serieTerms = [
        'série', 'saison', 'épisode', 'télévision', 'netflix', 'disney+', 
        'prime video', 'hbo', 'showrunner', 'tv show', 'télévisée'
      ];
      
      const gameTerms = [
        'jeu', 'console', 'ps5', 'xbox', 'switch', 'nintendo', 'playstation', 
        'gaming', 'gamer', 'gameplay', 'dlc', 'steam', 'fps', 'mmorpg', 'rpg'
      ];
      
      // Vérification explicite pour les actualités de livres
      if (
        title.includes('lire') || 
        title.includes('lecture') || 
        title.includes('livre') || 
        title.includes('roman') || 
        title.includes('écrivain') ||
        description.includes('pages') && (description.includes('lire') || description.includes('lecture'))
      ) {
        return 'book';
      }
      
      // Count occurrences of terms in title and description
      let bookCount = 0, filmCount = 0, serieCount = 0, gameCount = 0;
      
      bookTerms.forEach(term => {
        if (title.includes(term)) bookCount += 2; // Un poids plus important pour le titre
        if (description.includes(term)) bookCount++;
      });
      
      filmTerms.forEach(term => {
        if (title.includes(term)) filmCount += 2;
        if (description.includes(term)) filmCount++;
      });
      
      serieTerms.forEach(term => {
        if (title.includes(term)) serieCount += 2;
        if (description.includes(term)) serieCount++;
      });
      
      gameTerms.forEach(term => {
        if (title.includes(term)) gameCount += 2;
        if (description.includes(term)) gameCount++;
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

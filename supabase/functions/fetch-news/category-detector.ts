
// Function to detect media type from content
export function detectMediaType(title: string, description: string, source: string): 'film' | 'serie' | 'book' | 'game' | 'general' {
  title = title.toLowerCase();
  description = description.toLowerCase();
  
  // Default category based on the source
  let defaultCategory: 'film' | 'serie' | 'book' | 'game' | 'general' = 'general';
  
  switch(source) {
    case 'ActuGaming':
      defaultCategory = 'game';
      break;
    case 'Ecran Large':
      // Detect if it's a film or serie
      if (title.includes('série') || title.includes('saison') || description.includes('série') || description.includes('saison') || description.includes('épisode')) {
        return 'serie';
      }
      return 'film';
    case 'ActuaLitté':
      defaultCategory = 'book';
      break;
    default:
      // For general sources, try to detect the category
      if (title.includes('livre') || title.includes('roman') || title.includes('bd') || title.includes('manga') || description.includes('livre') || description.includes('roman') || description.includes('bd') || description.includes('manga')) {
        return 'book';
      } else if (title.includes('film') || title.includes('cinéma') || description.includes('film') || description.includes('cinéma')) {
        return 'film';
      } else if (title.includes('série') || title.includes('saison') || description.includes('série') || description.includes('saison') || description.includes('épisode')) {
        return 'serie';
      } else if (title.includes('jeu') || title.includes('console') || title.includes('ps5') || title.includes('xbox') || title.includes('switch') || description.includes('jeu') || description.includes('console') || description.includes('ps5') || description.includes('xbox') || description.includes('switch')) {
        return 'game';
      }
      return 'general';
  }
  
  return defaultCategory;
}

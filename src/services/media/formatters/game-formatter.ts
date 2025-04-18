
import { MediaType } from "@/types";

export const formatGameSearchResult = (item: any) => {
  const releaseYear = item.released ? parseInt(item.released.substring(0, 4)) : null;
  
  // Calcul d'un score de pertinence amélioré pour les jeux
  let gameRelevance = 0;
  
  // Prioriser les jeux avec des notes élevées
  if (item.rating) {
    gameRelevance += item.rating * 10; // 0-50 points basé sur la notation 0-5
  }
  
  // Prioriser les jeux populaires
  if (item.ratings_count) {
    gameRelevance += Math.min(item.ratings_count / 100, 40); // Max 40 points
  }
  
  // Bonus pour les jeux récents
  if (releaseYear) {
    if (releaseYear >= 2015) {
      gameRelevance += Math.min((releaseYear - 2015) * 2, 20); // Max 20 points
    }
  }
  
  // Bonus pour les jeux avec des images
  if (item.background_image) {
    gameRelevance += 15;
  }
  
  // Bonus pour les jeux avec beaucoup de plateformes (généralement plus connus)
  if (item.platforms && Array.isArray(item.platforms)) {
    gameRelevance += Math.min(item.platforms.length * 2, 20); // Max 20 points
  }
  
  return {
    id: item.id.toString(),
    title: item.name,
    type: 'game' as MediaType,
    coverImage: item.background_image || '/placeholder.svg',
    year: releaseYear,
    rating: item.rating || null,
    popularity: gameRelevance,
    externalData: item
  };
};

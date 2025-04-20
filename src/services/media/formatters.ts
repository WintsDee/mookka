import { MediaType } from "@/types";

/**
 * Format film search result
 */
export const formatFilmSearchResult = (item: any) => ({
  id: item.id.toString(),
  title: item.title,
  type: 'film' as MediaType,
  coverImage: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder.svg',
  year: item.release_date ? parseInt(item.release_date.substring(0, 4)) : null,
  rating: item.vote_average || null,
  popularity: item.popularity || 0,
  externalData: item
});

/**
 * Format serie search result
 */
export const formatSerieSearchResult = (item: any) => ({
  id: item.id.toString(),
  title: item.name,
  type: 'serie' as MediaType,
  coverImage: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder.svg',
  year: item.first_air_date ? parseInt(item.first_air_date.substring(0, 4)) : null,
  rating: item.vote_average || null,
  popularity: item.popularity || 0,
  externalData: item
});

/**
 * Format book search result with relevance scoring
 */
export const formatBookSearchResult = (item: any) => {
  const publishedDate = item.volumeInfo?.publishedDate;
  const publishedYear = publishedDate ? parseInt(publishedDate.substring(0, 4)) : null;
  const categories = item.volumeInfo?.categories || [];
  const title = item.volumeInfo?.title || 'Sans titre';
  const description = item.volumeInfo?.description || '';
  
  // Calculer un score de pertinence basé sur le contenu
  let relevanceScore = 0;
  
  // Liste des catégories préférées (divertissement)
  const preferredCategories = [
    'fiction', 'roman', 'manga', 'bande dessinée', 'bd', 'comics', 'graphic novel',
    'fantasy', 'sci-fi', 'science fiction', 'thriller', 'mystery', 'policier', 'adventure',
    'aventure', 'young adult', 'jeunesse', 'fantastique', 'horreur', 'horror'
  ];
  
  // Liste des catégories à éviter (académiques, essais, etc.)
  const avoidCategories = [
    'academic', 'textbook', 'manuel', 'thesis', 'thèse', 'dissertation', 'essay', 
    'essai', 'biography', 'biographie', 'self-help', 'développement personnel',
    'business', 'management', 'education', 'reference', 'science', 'mathematics',
    'mathématiques', 'philosophy', 'philosophie', 'religion', 'political', 'politique',
    'economics', 'économie', 'medical', 'médical', 'law', 'droit', 'computer science'
  ];
  
  // Vérifier les catégories
  for (const category of categories) {
    const lowerCategory = category.toLowerCase();
    
    // Bonus pour les catégories préférées
    for (const preferred of preferredCategories) {
      if (lowerCategory.includes(preferred)) {
        relevanceScore += 20;
        break;
      }
    }
    
    // Pénalité pour les catégories à éviter
    for (const avoid of avoidCategories) {
      if (lowerCategory.includes(avoid)) {
        relevanceScore -= 30;
        break;
      }
    }
  }
  
  // Vérifier le titre et la description pour les mots-clés pertinents
  const lowerTitle = title.toLowerCase();
  const lowerDescription = description.toLowerCase();
  const contentText = `${lowerTitle} ${lowerDescription}`;
  
  for (const preferred of preferredCategories) {
    if (contentText.includes(preferred)) {
      relevanceScore += 10;
    }
  }
  
  for (const avoid of avoidCategories) {
    if (contentText.includes(avoid)) {
      relevanceScore -= 15;
    }
  }
  
  // Bonus pour les livres avec des images de couverture (généralement plus pertinents)
  if (item.volumeInfo?.imageLinks?.thumbnail) {
    relevanceScore += 15;
  }
  
  // Bonus pour les livres avec des avis (généralement plus pertinents)
  if (item.volumeInfo?.averageRating) {
    relevanceScore += item.volumeInfo.averageRating * 5;
  }
  
  if (item.volumeInfo?.ratingsCount) {
    relevanceScore += Math.min(item.volumeInfo.ratingsCount / 10, 20);
  }
  
  // Bonus pour les livres récents (mais pas trop non plus pour les classiques)
  if (publishedYear) {
    if (publishedYear > 2000) {
      relevanceScore += Math.min((publishedYear - 2000) / 5, 15);
    } else if (publishedYear < 1900) {
      // Bonus pour les classiques
      relevanceScore += 10;
    }
  }
  
  return {
    id: item.id,
    title: title,
    type: 'book' as MediaType,
    coverImage: item.volumeInfo?.imageLinks?.thumbnail || '/placeholder.svg',
    year: publishedYear,
    author: item.volumeInfo?.authors ? item.volumeInfo.authors[0] : null,
    popularity: relevanceScore,
    categories: categories,
    externalData: item
  };
};

/**
 * Format game search result with relevance scoring
 */
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

/**
 * Format library media item
 */
export const formatLibraryMedia = (item: any) => {
  if (!item.media) {
    console.warn("Missing media data in format:", item);
    return null;
  }
  
  // Déterminer quel ID utiliser (préférez l'ID externe pour les livres)
  const mediaId = item.media.type === 'book' && item.media.external_id 
    ? item.media.external_id 
    : item.media.id;
  
  return {
    id: mediaId,
    title: item.media.title,
    type: item.media.type as MediaType,
    coverImage: item.media.cover_image,
    year: item.media.year,
    rating: item.media.rating,
    userRating: item.user_rating,
    genres: item.media.genres,
    description: item.media.description,
    status: (item.status || 'to-watch') as 'to-watch' | 'watching' | 'completed',
    addedAt: item.added_at,
    notes: item.notes,
    duration: item.media.duration,
    director: item.media.director,
    author: item.media.author,
    publisher: item.media.publisher,
    platform: item.media.platform,
    externalId: item.media.external_id // Ajout de l'ID externe
  };
};

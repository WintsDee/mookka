
import { MediaType } from "@/types";

export const formatBookSearchResult = (item: any) => {
  const publishedDate = item.volumeInfo?.publishedDate;
  const publishedYear = publishedDate ? parseInt(publishedDate.substring(0, 4)) : null;
  const categories = item.volumeInfo?.categories || [];
  const title = item.volumeInfo?.title || 'Sans titre';
  const description = item.volumeInfo?.description || '';
  
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
  
  let relevanceScore = calculateBookRelevanceScore(
    categories,
    title,
    description,
    preferredCategories,
    avoidCategories,
    item.volumeInfo
  );
  
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

function calculateBookRelevanceScore(
  categories: string[],
  title: string,
  description: string,
  preferredCategories: string[],
  avoidCategories: string[],
  volumeInfo: any
): number {
  let score = 0;
  
  // Vérifier les catégories
  for (const category of categories) {
    const lowerCategory = category.toLowerCase();
    
    // Bonus pour les catégories préférées
    if (preferredCategories.some(preferred => lowerCategory.includes(preferred))) {
      score += 20;
    }
    
    // Pénalité pour les catégories à éviter
    if (avoidCategories.some(avoid => lowerCategory.includes(avoid))) {
      score -= 30;
    }
  }
  
  // Vérifier le titre et la description
  const contentText = `${title.toLowerCase()} ${description.toLowerCase()}`;
  
  for (const preferred of preferredCategories) {
    if (contentText.includes(preferred)) {
      score += 10;
    }
  }
  
  for (const avoid of avoidCategories) {
    if (contentText.includes(avoid)) {
      score -= 15;
    }
  }
  
  // Bonus pour les livres avec des images de couverture
  if (volumeInfo?.imageLinks?.thumbnail) {
    score += 15;
  }
  
  // Bonus pour les livres avec des avis
  if (volumeInfo?.averageRating) {
    score += volumeInfo.averageRating * 5;
  }
  
  if (volumeInfo?.ratingsCount) {
    score += Math.min(volumeInfo.ratingsCount / 10, 20);
  }
  
  // Bonus pour les livres récents
  const publishedYear = volumeInfo?.publishedDate 
    ? parseInt(volumeInfo.publishedDate.substring(0, 4)) 
    : null;
    
  if (publishedYear) {
    if (publishedYear > 2000) {
      score += Math.min((publishedYear - 2000) / 5, 15);
    } else if (publishedYear < 1900) {
      // Bonus pour les classiques
      score += 10;
    }
  }
  
  return score;
}

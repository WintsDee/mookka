
import { MediaType } from "@/types";

/**
 * Filtre le contenu pour adultes en fonction des paramètres de l'utilisateur
 * @param media Liste des médias à filtrer
 * @param adultContentAllowed Si true, le contenu pour adultes est autorisé
 */
export function filterAdultContent(media: any[], adultContentAllowed: boolean = false): any[] {
  if (adultContentAllowed) {
    return media;
  }

  return media.filter(item => {
    // Pour les films et séries (API TMDB)
    if (item.adult === false) {
      return true;
    }
    
    // Pour les jeux, filtrer ceux avec un rating mature (API RAWG)
    if (item.esrb_rating && ['Mature', 'Adults Only'].includes(item.esrb_rating.name)) {
      return false;
    }
    
    // Pour les livres, filtrer ceux avec un rating mature (API Google Books)
    if (item.volumeInfo?.maturityRating === 'MATURE') {
      return false;
    }
    
    // Par défaut, inclure le média
    return true;
  });
}

/**
 * Filtre les médias par type
 */
export function filterByType(media: any[], type: MediaType | 'all'): any[] {
  if (type === 'all') {
    return media;
  }
  
  return media.filter(item => item.type === type);
}

/**
 * Filtre les médias par statut
 */
export function filterByStatus(media: any[], status: string | 'all'): any[] {
  if (status === 'all') {
    return media;
  }
  
  return media.filter(item => item.status === status);
}

/**
 * Filtre les médias par recherche textuelle
 */
export function filterBySearchTerm(media: any[], searchTerm: string): any[] {
  if (!searchTerm || searchTerm.trim() === '') {
    return media;
  }
  
  const term = searchTerm.toLowerCase().trim();
  
  return media.filter(item => 
    // Recherche dans le titre
    (item.title && item.title.toLowerCase().includes(term)) ||
    // Recherche dans les genres
    (item.genres && Array.isArray(item.genres) && item.genres.some((genre: string) => 
      genre.toLowerCase().includes(term)
    )) ||
    // Recherche dans le réalisateur (pour les films)
    (item.director && item.director.toLowerCase().includes(term)) ||
    // Recherche dans l'auteur (pour les livres)
    (item.author && item.author.toLowerCase().includes(term)) ||
    // Recherche dans l'éditeur (pour les jeux)
    (item.publisher && item.publisher.toLowerCase().includes(term))
  );
}

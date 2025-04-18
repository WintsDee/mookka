
// Import formatters and utils from their respective files
import { formatFilmDetails, getFilmAdditionalInfo } from './film-formatter';
import { formatSerieDetails, getSerieAdditionalInfo } from './serie-formatter';
import { formatBookDetails, getBookAdditionalInfo } from './book-formatter';
import { formatGameDetails, getGameAdditionalInfo } from './game-formatter';
import { normalizeRating, formatDate } from './utils';

// Export all formatters and utils to make them available elsewhere
export { 
  formatFilmDetails, 
  getFilmAdditionalInfo,
  formatSerieDetails, 
  getSerieAdditionalInfo,
  formatBookDetails, 
  getBookAdditionalInfo,
  formatGameDetails, 
  getGameAdditionalInfo,
  normalizeRating, 
  formatDate 
};

// Main formatter functions that detect media type and use the appropriate formatter
export function formatMediaDetails(media: any, type: string): any {
  switch (type) {
    case 'film':
      return formatFilmDetails(media);
    case 'serie':
      return formatSerieDetails(media);
    case 'book':
      return formatBookDetails(media);
    case 'game':
      return formatGameDetails(media);
    default:
      throw new Error(`Type de média non pris en charge: ${type}`);
  }
}

export function getAdditionalMediaInfo(media: any, formattedMedia: any, type: string): any {
  switch (type) {
    case 'film':
      return getFilmAdditionalInfo(media, formattedMedia);
    case 'serie':
      return getSerieAdditionalInfo(media, formattedMedia);
    case 'book':
      return getBookAdditionalInfo(media, formattedMedia);
    case 'game':
      return getGameAdditionalInfo(media, formattedMedia);
    default:
      return {}; // Retourner un objet vide par défaut
  }
}

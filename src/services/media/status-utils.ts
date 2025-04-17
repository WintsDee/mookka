
import { MediaType, MediaStatus } from '@/types';

/**
 * Retourne le statut par défaut approprié en fonction du type de média
 */
export function getDefaultStatus(mediaType: MediaType): MediaStatus {
  switch (mediaType) {
    case 'film':
    case 'serie':
      return 'to-watch';
    case 'book':
      return 'to-read';
    case 'game':
      return 'to-play';
    default:
      // Fallback au cas où (ne devrait jamais se produire avec un bon typage)
      return 'to-watch';
  }
}

/**
 * Convertit une chaîne de statut en MediaStatus typé
 * Utilisé pour convertir les entrées utilisateur ou les valeurs de la base de données
 */
export function parseMediaStatus(status: string, mediaType: MediaType): MediaStatus {
  // Vérifie si le statut est déjà une valeur valide de MediaStatus
  if (isValidMediaStatus(status)) {
    return status as MediaStatus;
  }
  
  // Si le statut n'est pas valide, retourne un statut par défaut
  return getDefaultStatus(mediaType);
}

/**
 * Vérifie si une chaîne est un MediaStatus valide
 */
function isValidMediaStatus(status: string): boolean {
  const validStatuses: MediaStatus[] = [
    'to-watch', 'watching', 'completed',
    'to-read', 'reading',
    'to-play', 'playing'
  ];
  
  return validStatuses.includes(status as MediaStatus);
}

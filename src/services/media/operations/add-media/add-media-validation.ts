
import { MediaType, MediaStatus } from "@/types";

interface ValidateMediaParams {
  mediaId: string;
  mediaType: MediaType;
  status?: MediaStatus;
}

/**
 * Valide les paramètres fournis pour l'ajout d'un média
 * @returns true si les paramètres sont valides
 * @throws Error si les paramètres sont invalides
 */
export function addMediaWithValidation({ mediaId, mediaType, status }: ValidateMediaParams): boolean {
  if (!mediaId) {
    throw new Error("L'identifiant du média est requis");
  }
  
  if (!mediaType || !['book', 'film', 'serie', 'game'].includes(mediaType)) {
    throw new Error("Type de média invalide ou manquant");
  }
  
  if (status && !isValidStatus(status, mediaType)) {
    throw new Error(`Statut '${status}' invalide pour le type de média '${mediaType}'`);
  }
  
  return true;
}

/**
 * Vérifie si un statut est valide pour un type de média donné
 */
function isValidStatus(status: MediaStatus, mediaType: MediaType): boolean {
  const validStatuses: Record<MediaType, MediaStatus[]> = {
    book: ['to-read', 'reading', 'completed', 'dropped'],
    film: ['to-watch', 'watching', 'completed', 'dropped'],
    serie: ['to-watch', 'watching', 'completed', 'dropped'],
    game: ['to-play', 'playing', 'completed', 'dropped'],
  };
  
  return validStatuses[mediaType].includes(status);
}

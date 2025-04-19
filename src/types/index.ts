
export type MediaType = 'film' | 'serie' | 'book' | 'game';

export type MediaStatus = 
  | 'to-watch' | 'watching' | 'completed'  // Common/legacy statuses
  | 'to-read' | 'reading'                  // Book statuses
  | 'to-play' | 'playing';                 // Game statuses

export interface Media {
  id: string;
  title: string;
  type: MediaType;
  coverImage: string;
  year?: number;
  rating?: number;
  status?: MediaStatus;
  genres?: string[];
  description?: string;
  duration?: string; // Pour films et séries
  director?: string; // Pour films
  author?: string; // Pour livres
  publisher?: string; // Pour jeux
  platform?: string; // Pour jeux
  externalId?: string; // ID externe pour les APIs tierces
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  following?: number;
  followers?: number;
}

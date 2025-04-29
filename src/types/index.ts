
export type MediaType = 'film' | 'serie' | 'book' | 'game';

export type MediaStatus = 
  | 'to-watch' | 'watching' | 'completed'  // Statuts pour films et séries
  | 'to-read' | 'reading'                  // Statuts pour livres
  | 'to-play' | 'playing';                 // Statuts pour jeux

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
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  following?: number;
  followers?: number;
}

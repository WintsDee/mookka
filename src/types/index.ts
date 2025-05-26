
export type MediaType = 'film' | 'serie' | 'book' | 'game';

export type MediaStatus = 
  | 'to-watch' | 'watching' | 'completed' | 'abandoned'  // Updated to include abandoned status
  | 'to-read' | 'reading'                  
  | 'to-play' | 'playing';                 

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

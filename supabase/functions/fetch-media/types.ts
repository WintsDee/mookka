
export interface ApiConfig {
  apiKey: string;
  apiUrl: string;
}

export type MediaType = 'film' | 'serie' | 'book' | 'game';

export interface SerieDetails {
  seasons: any[];
}


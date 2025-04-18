
export interface Episode {
  number: number;
  title?: string;
  description?: string;
  airDate?: string;
  still_path?: string;
}

export interface Season {
  season_number: number;
  name?: string;
  episode_count: number;
  air_date?: string;
  episodes?: Episode[];
}

export interface SerieProgressionResult {
  seasons: Season[];
  upcomingEpisodes: any[];
  totalEpisodes: number;
  watchedEpisodes: number;
  status: string;
  progression: any;
  toggleEpisode: (seasonNumber: number, episodeNumber: number) => any;
  toggleSeason: (seasonNumber: number, episodeCount: number) => any;
  updateStatus: (status: string) => any;
}


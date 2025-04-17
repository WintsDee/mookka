
export interface Season {
  season_number: number;
  name?: string;
  episode_count: number;
  air_date?: string;
  episodes?: Episode[];
}

export interface Episode {
  number: number;
  title?: string;
  airDate?: string;
}

export interface UpcomingEpisode {
  season_number: number;
  episode_number: number;
  name?: string;
  air_date?: string;
}

export interface SerieProgression {
  watched_episodes?: Record<number, number[]>;
  watched_count?: number;
  total_episodes?: number;
  status?: string;
}

export interface SerieProgressionResult {
  seasons: Season[];
  upcomingEpisodes: UpcomingEpisode[];
  totalEpisodes: number;
  watchedEpisodes: number;
  status: string;
  progression: SerieProgression;
  toggleEpisode: (seasonNumber: number, episodeNumber: number) => SerieProgression | undefined;
  toggleSeason: (seasonNumber: number, episodeCount: number) => SerieProgression | undefined;
  updateStatus: (newStatus: string) => SerieProgression | undefined;
}

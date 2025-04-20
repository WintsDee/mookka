
import { useEpisodeState } from "./hooks/use-episode-state";
import { useProgressionState } from "./hooks/use-progression-state";
import { SerieProgressionResult } from "./types/serie-progression";

export function useSerieProgression(mediaDetails: any, initialProgression: any): SerieProgressionResult {
  const {
    seasons,
    totalEpisodes,
    watchedEpisodes,
    upcomingEpisodes
  } = useEpisodeState(mediaDetails, initialProgression);

  const {
    status,
    progression,
    toggleEpisode,
    toggleSeason,
    updateStatus
  } = useProgressionState(initialProgression, totalEpisodes);

  return {
    seasons,
    upcomingEpisodes,
    totalEpisodes,
    watchedEpisodes,
    status,
    progression,
    toggleEpisode,
    toggleSeason,
    updateStatus
  };
}

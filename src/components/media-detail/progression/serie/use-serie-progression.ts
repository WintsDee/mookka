
import { useState, useEffect } from "react";
import { SerieProgressionResult, SerieProgression, Season, UpcomingEpisode } from "./types";
import { formatSeasons, generateUpcomingEpisodes } from "./utils/formatters";
import { handleToggleEpisode, handleToggleSeason, handleUpdateStatus } from "./utils/progressionHandlers";

/**
 * Custom hook for managing serie progression state and interactions
 */
export function useSerieProgression(
  mediaDetails: any,
  initialProgression: SerieProgression = {}
): SerieProgressionResult {
  // Format the seasons data from media details
  const formattedSeasons: Season[] = formatSeasons(mediaDetails);
  
  // Generate upcoming episodes data
  const upcomingEpisodes: UpcomingEpisode[] = generateUpcomingEpisodes(mediaDetails, formattedSeasons);

  // Progression state
  const [progression, setProgression] = useState<SerieProgression>(initialProgression);
  
  // Total number of episodes across all seasons
  const totalEpisodes = formattedSeasons.reduce((acc, season) => acc + season.episode_count, 0);
  
  // Count of watched episodes
  const watchedEpisodes = Object.values(progression.watched_episodes || {})
    .reduce((acc, episodes) => acc + (Array.isArray(episodes) ? episodes.length : 0), 0);
  
  // Current watching status
  const status = progression.status || 'to-watch';
  
  // Update progression state when initial progression changes
  useEffect(() => {
    if (initialProgression) {
      setProgression(initialProgression);
    }
  }, [initialProgression]);
  
  // Toggle episode watched status
  const toggleEpisode = (seasonNumber: number, episodeNumber: number): SerieProgression | undefined => {
    const updatedProgression = handleToggleEpisode(progression, seasonNumber, episodeNumber);
    if (updatedProgression) {
      setProgression(updatedProgression);
      return updatedProgression;
    }
    return undefined;
  };
  
  // Toggle all episodes in a season
  const toggleSeason = (seasonNumber: number, episodeCount: number): SerieProgression | undefined => {
    const updatedProgression = handleToggleSeason(progression, seasonNumber, episodeCount);
    if (updatedProgression) {
      setProgression(updatedProgression);
      return updatedProgression;
    }
    return undefined;
  };
  
  // Update the watching status
  const updateStatus = (newStatus: string): SerieProgression | undefined => {
    const updatedProgression = handleUpdateStatus(progression, newStatus);
    if (updatedProgression) {
      setProgression(updatedProgression);
      return updatedProgression;
    }
    return undefined;
  };

  return {
    seasons: formattedSeasons,
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

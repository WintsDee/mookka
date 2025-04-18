
import { useState, useEffect } from "react";
import { SerieProgressionResult } from "./types/serie-progression";
import { formatSeasons } from "./utils/format-seasons";
import { generateUpcomingEpisodes } from "./utils/generate-upcoming";
import { updateEpisodeProgress, updateSeasonProgress } from "./utils/progression-updates";

export function useSerieProgression(mediaDetails: any, initialProgression: any): SerieProgressionResult {
  const [seasons, setSeasons] = useState<any[]>([]);
  const [upcomingEpisodes, setUpcomingEpisodes] = useState<any[]>([]);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [watchedEpisodes, setWatchedEpisodes] = useState(0);
  const [status, setStatus] = useState(initialProgression?.status || 'to-watch');
  const [progression, setProgression] = useState(initialProgression || {});

  useEffect(() => {
    if (mediaDetails) {
      console.log("Media details for series:", mediaDetails);
      
      // Use the seasons data from the API response
      const formattedSeasons = formatSeasons(mediaDetails);
      setSeasons(formattedSeasons);
      
      // Calculate total episodes across all seasons
      const total = formattedSeasons.reduce((acc, season) => 
        acc + (season.episode_count || 0), 0);
      setTotalEpisodes(total);
      
      // Get count of watched episodes from progression data
      const watched = countWatchedEpisodes(initialProgression?.watched_episodes || {});
      setWatchedEpisodes(watched);
      
      // Use upcoming episodes from API or generate if not available
      const upcoming = mediaDetails.upcoming_episodes || 
        generateUpcomingEpisodes(mediaDetails, formattedSeasons);
      setUpcomingEpisodes(upcoming);
    }
  }, [mediaDetails]);

  useEffect(() => {
    if (initialProgression) {
      setStatus(initialProgression.status || 'to-watch');
      setProgression(initialProgression);
      
      const watched = countWatchedEpisodes(initialProgression.watched_episodes || {});
      setWatchedEpisodes(watched);
    }
  }, [initialProgression]);

  // Helper function to count watched episodes
  const countWatchedEpisodes = (watchedEpisodes: Record<string, number[]>) => {
    return Object.values(watchedEpisodes).reduce((acc, episodes) => 
      acc + (Array.isArray(episodes) ? episodes.length : 0), 0);
  };

  const toggleEpisode = (seasonNumber: number, episodeNumber: number) => {
    const updatedProgress = updateEpisodeProgress(progression, seasonNumber, episodeNumber, totalEpisodes);
    setWatchedEpisodes(countWatchedEpisodes(updatedProgress.watched_episodes));
    setStatus(updatedProgress.status);
    
    const updatedProgression = {
      ...progression,
      ...updatedProgress
    };
    
    setProgression(updatedProgression);
    return updatedProgression;
  };

  const toggleSeason = (seasonNumber: number, episodeCount: number) => {
    const updatedProgress = updateSeasonProgress(progression, seasonNumber, episodeCount, totalEpisodes);
    setWatchedEpisodes(countWatchedEpisodes(updatedProgress.watched_episodes));
    setStatus(updatedProgress.status);
    
    const updatedProgression = {
      ...progression,
      ...updatedProgress
    };
    
    setProgression(updatedProgression);
    return updatedProgression;
  };

  const updateStatus = (newStatus: string) => {
    setStatus(newStatus);
    
    const updatedProgression = {
      ...progression,
      status: newStatus
    };
    
    setProgression(updatedProgression);
    return updatedProgression;
  };

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

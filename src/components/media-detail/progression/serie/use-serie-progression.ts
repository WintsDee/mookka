
import { useState, useEffect } from "react";
import { SerieProgressionResult } from "./types/serie-progression";
import { formatSeasons } from "./utils/format-seasons";
import { generateUpcomingEpisodes } from "./utils/generate-upcoming";
import { updateEpisodeProgress, updateSeasonProgress } from "./utils/progression-updates";

export function useSerieProgression(mediaDetails: any, initialProgression: any): SerieProgressionResult {
  const [seasons, setSeasons] = useState([]);
  const [upcomingEpisodes, setUpcomingEpisodes] = useState([]);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [watchedEpisodes, setWatchedEpisodes] = useState(0);
  const [status, setStatus] = useState(initialProgression?.status || 'to-watch');
  const [progression, setProgression] = useState(initialProgression || {});

  useEffect(() => {
    if (mediaDetails) {
      console.log("Media details seasons:", mediaDetails.seasons);
      
      const formattedSeasons = formatSeasons(mediaDetails);
      setSeasons(formattedSeasons);
      
      const total = formattedSeasons.reduce((acc, season) => 
        acc + (season.episode_count || 0), 0);
      setTotalEpisodes(total);
      
      const watched = Object.values(initialProgression?.watched_episodes || {}).flat().length;
      setWatchedEpisodes(watched);
      
      const upcoming = generateUpcomingEpisodes(mediaDetails, formattedSeasons);
      setUpcomingEpisodes(upcoming);
    }
  }, [mediaDetails]);

  useEffect(() => {
    if (initialProgression?.status) {
      setStatus(initialProgression.status);
    }
    setProgression(initialProgression || {});
    
    const watched = Object.values(initialProgression?.watched_episodes || {}).flat().length;
    setWatchedEpisodes(watched);
  }, [initialProgression]);

  const toggleEpisode = (seasonNumber: number, episodeNumber: number) => {
    const updatedProgress = updateEpisodeProgress(progression, seasonNumber, episodeNumber, totalEpisodes);
    setWatchedEpisodes(updatedProgress.watched_count);
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
    setWatchedEpisodes(updatedProgress.watched_count);
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

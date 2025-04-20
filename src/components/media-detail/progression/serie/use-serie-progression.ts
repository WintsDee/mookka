
import { useState, useEffect } from "react";
import { formatSeasons } from "./utils/format-seasons";
import { Season, SerieProgressionResult } from "./types/serie-progression";
import { generateUpcomingEpisodes } from "./utils/generate-upcoming";

export function useSerieProgression(mediaDetails: any, initialProgression: any): SerieProgressionResult {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [totalEpisodes, setTotalEpisodes] = useState<number>(0);
  const [watchedEpisodes, setWatchedEpisodes] = useState<number>(0);
  const [status, setStatus] = useState(initialProgression?.status || 'to-watch');
  const [progression, setProgression] = useState(initialProgression || {});
  const [upcomingEpisodes, setUpcomingEpisodes] = useState<any[]>([]);

  useEffect(() => {
    if (mediaDetails) {
      const formattedSeasons = formatSeasons(mediaDetails);
      setSeasons(formattedSeasons);
      
      const totalEpisodeCount = formattedSeasons.reduce((acc: number, season) => 
        acc + (season.episode_count || 0), 0);
      setTotalEpisodes(totalEpisodeCount);
      
      // Calculate watched episodes count
      const watchedEpisodesObj = initialProgression?.watched_episodes || {};
      let watchedCount = 0;
      
      Object.values(watchedEpisodesObj).forEach((episodes: any) => {
        if (Array.isArray(episodes)) {
          watchedCount += episodes.length;
        }
      });
      
      setWatchedEpisodes(watchedCount);
      
      // Generate upcoming episodes if any
      const upcomingEps = generateUpcomingEpisodes(mediaDetails, formattedSeasons);
      setUpcomingEpisodes(upcomingEps);
    }
  }, [mediaDetails]);

  useEffect(() => {
    if (initialProgression) {
      setStatus(initialProgression.status || 'to-watch');
      setProgression(initialProgression);
      
      // Calculate watched episodes count
      const watchedEpisodesObj = initialProgression?.watched_episodes || {};
      let watchedCount = 0;
      
      Object.values(watchedEpisodesObj).forEach((episodes: any) => {
        if (Array.isArray(episodes)) {
          watchedCount += episodes.length;
        }
      });
      
      setWatchedEpisodes(watchedCount);
    }
  }, [initialProgression]);

  const toggleEpisode = (seasonNumber: number, episodeNumber: number) => {
    const currentWatchedEpisodes = {...(progression.watched_episodes || {})};
    const seasonEpisodes = Array.isArray(currentWatchedEpisodes[seasonNumber]) 
      ? [...currentWatchedEpisodes[seasonNumber]] 
      : [];
    
    // Check if episode is already watched
    const isEpisodeWatched = seasonEpisodes.includes(episodeNumber);
    
    let updatedSeasonEpisodes: number[];
    
    if (isEpisodeWatched) {
      // Remove episode from watched
      updatedSeasonEpisodes = seasonEpisodes.filter(ep => ep !== episodeNumber);
    } else {
      // Add episode to watched
      updatedSeasonEpisodes = [...seasonEpisodes, episodeNumber];
      // Sort episodes for better display
      updatedSeasonEpisodes.sort((a, b) => a - b);
    }
    
    // Update watched episodes for season
    const newWatchedEpisodes = {
      ...currentWatchedEpisodes,
      [seasonNumber]: updatedSeasonEpisodes
    };
    
    // Calculate total watched count
    let totalWatchedCount = 0;
    Object.values(newWatchedEpisodes).forEach((episodes: any) => {
      if (Array.isArray(episodes)) {
        totalWatchedCount += episodes.length;
      }
    });
    
    // Update status based on watched episodes
    let newStatus = status;
    if (totalWatchedCount === 0) {
      newStatus = 'to-watch';
    } else if (totalWatchedCount === totalEpisodes) {
      newStatus = 'completed';
    } else {
      newStatus = 'watching';
    }
    
    const updatedProgression = {
      ...progression,
      watched_episodes: newWatchedEpisodes,
      status: newStatus,
      watched_count: totalWatchedCount,
      total_episodes: totalEpisodes
    };
    
    setProgression(updatedProgression);
    setWatchedEpisodes(totalWatchedCount);
    setStatus(newStatus);
    
    return updatedProgression;
  };

  const toggleSeason = (seasonNumber: number, episodeCount: number) => {
    const currentWatchedEpisodes = {...(progression.watched_episodes || {})};
    const seasonEpisodes = Array.isArray(currentWatchedEpisodes[seasonNumber]) 
      ? currentWatchedEpisodes[seasonNumber] 
      : [];
    
    const isSeasonWatched = seasonEpisodes.length === episodeCount;
    
    const newWatchedEpisodes = { ...currentWatchedEpisodes };
    
    if (isSeasonWatched) {
      // If the season was completely watched, we empty it
      newWatchedEpisodes[seasonNumber] = [];
    } else {
      // Sinon on la marque comme complètement regardée
      newWatchedEpisodes[seasonNumber] = Array.from(
        { length: episodeCount }, 
        (_, i) => i + 1
      );
    }
    
    // Calculate the total watched count safely
    let totalWatchedCount = 0;
    
    // Explicit iteration to ensure type safety
    Object.values(newWatchedEpisodes).forEach((episodes: any) => {
      if (Array.isArray(episodes)) {
        totalWatchedCount += episodes.length;
      }
    });
    
    // Update status based on watched episodes count
    let newStatus = status;
    if (totalWatchedCount === 0) {
      newStatus = 'to-watch';
    } else if (totalWatchedCount === totalEpisodes) {
      newStatus = 'completed';
    } else {
      newStatus = 'watching';
    }
    
    const updatedProgression = {
      ...progression,
      watched_episodes: newWatchedEpisodes,
      status: newStatus,
      watched_count: totalWatchedCount,
      total_episodes: totalEpisodes
    };
    
    setProgression(updatedProgression);
    setWatchedEpisodes(totalWatchedCount);
    setStatus(newStatus);
    
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

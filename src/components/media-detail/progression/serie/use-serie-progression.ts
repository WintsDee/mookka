import { useState, useEffect } from "react";

export function useSerieProgression(mediaDetails: any, initialProgression: any) {
  const [seasons, setSeasons] = useState<any[]>([]);
  const [upcomingEpisodes, setUpcomingEpisodes] = useState<any[]>([]);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [watchedEpisodes, setWatchedEpisodes] = useState(0);
  const [status, setStatus] = useState(initialProgression?.status || 'to-watch');
  const [progression, setProgression] = useState(initialProgression || {});

  useEffect(() => {
    // Initialize season data from media details
    if (mediaDetails?.seasons) {
      const formattedSeasons = Array.isArray(mediaDetails.seasons) 
        ? mediaDetails.seasons 
        : Array(mediaDetails.seasons).fill(null).map((_, i) => ({ 
            season_number: i + 1, 
            name: `Saison ${i + 1}`,
            episode_count: 10 // Default value if not specified
          }));
      
      setSeasons(formattedSeasons);
      
      // Calculate total episodes
      const total = formattedSeasons.reduce((acc, season) => 
        acc + (season.episode_count || 0), 0);
      setTotalEpisodes(total);
      
      // Calculate watched episodes from progression
      const watched = Object.values(initialProgression?.watched_episodes || {}).flat().length;
      setWatchedEpisodes(watched);
      
      // If we have upcoming episodes data
      if (mediaDetails.upcoming_episodes) {
        setUpcomingEpisodes(mediaDetails.upcoming_episodes);
      }
    }
  }, [mediaDetails, initialProgression]);

  useEffect(() => {
    // Update local status when progression changes
    if (initialProgression?.status) {
      setStatus(initialProgression.status);
    }
    setProgression(initialProgression || {});
  }, [initialProgression]);

  const toggleEpisode = (seasonNumber: number, episodeNumber: number) => {
    const newWatchedEpisodes = { ...progression.watched_episodes } || {};
    
    if (!newWatchedEpisodes[seasonNumber]) {
      newWatchedEpisodes[seasonNumber] = [];
    }
    
    const episodeIndex = newWatchedEpisodes[seasonNumber].indexOf(episodeNumber);
    
    if (episodeIndex === -1) {
      // Add episode to watched
      newWatchedEpisodes[seasonNumber].push(episodeNumber);
    } else {
      // Remove episode from watched
      newWatchedEpisodes[seasonNumber].splice(episodeIndex, 1);
    }
    
    // Calculate new watched count
    const newWatchedCount = Object.values(newWatchedEpisodes).flat().length;
    setWatchedEpisodes(newWatchedCount);
    
    // Automatically update status based on progression
    let newStatus = status;
    if (newWatchedCount === 0) {
      newStatus = 'to-watch';
    } else if (newWatchedCount === totalEpisodes) {
      newStatus = 'completed';
    } else {
      newStatus = 'watching';
    }
    setStatus(newStatus);
    
    const updatedProgression = {
      ...progression,
      watched_episodes: newWatchedEpisodes,
      watched_count: newWatchedCount,
      total_episodes: totalEpisodes,
      status: newStatus
    };
    
    setProgression(updatedProgression);
    return updatedProgression;
  };

  const toggleSeason = (seasonNumber: number, episodeCount: number) => {
    const newWatchedEpisodes = { ...progression.watched_episodes } || {};
    
    // Check if all episodes in the season are already watched
    const seasonEpisodes = newWatchedEpisodes[seasonNumber] || [];
    const allWatched = seasonEpisodes.length === episodeCount;
    
    if (allWatched) {
      // If all are watched, remove them all
      newWatchedEpisodes[seasonNumber] = [];
    } else {
      // Otherwise, mark all episodes as watched
      newWatchedEpisodes[seasonNumber] = Array.from({ length: episodeCount }, (_, i) => i + 1);
    }
    
    // Calculate new watched count
    const newWatchedCount = Object.values(newWatchedEpisodes).flat().length;
    setWatchedEpisodes(newWatchedCount);
    
    // Automatically update status based on progression
    let newStatus = status;
    if (newWatchedCount === 0) {
      newStatus = 'to-watch';
    } else if (newWatchedCount === totalEpisodes) {
      newStatus = 'completed';
    } else {
      newStatus = 'watching';
    }
    setStatus(newStatus);
    
    const updatedProgression = {
      ...progression,
      watched_episodes: newWatchedEpisodes,
      watched_count: newWatchedCount,
      total_episodes: totalEpisodes,
      status: newStatus
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


import { useState, useEffect } from "react";
import { formatSeasons } from "./utils/format-seasons";

interface SerieProgressionResult {
  seasons: any[];
  totalEpisodes: number;
  watchedEpisodes: number;
  status: string;
  progression: any;
  toggleSeason: (seasonNumber: number, episodeCount: number) => any;
  updateStatus: (newStatus: string) => any;
}

export function useSerieProgression(mediaDetails: any, initialProgression: any): SerieProgressionResult {
  const [seasons, setSeasons] = useState([]);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [watchedEpisodes, setWatchedEpisodes] = useState(0);
  const [status, setStatus] = useState(initialProgression?.status || 'to-watch');
  const [progression, setProgression] = useState(initialProgression || {});

  useEffect(() => {
    if (mediaDetails) {
      const formattedSeasons = formatSeasons(mediaDetails);
      setSeasons(formattedSeasons);
      
      const total = formattedSeasons.reduce((acc, season) => 
        acc + (season.episode_count || 0), 0);
      setTotalEpisodes(total);
      
      const watched = Object.values(initialProgression?.watched_episodes || {})
        .reduce((acc: any, episodes: any) => acc + episodes.length, 0);
      setWatchedEpisodes(watched);
    }
  }, [mediaDetails]);

  useEffect(() => {
    if (initialProgression?.status) {
      setStatus(initialProgression.status);
    }
    setProgression(initialProgression || {});
    
    const watched = Object.values(initialProgression?.watched_episodes || {})
      .reduce((acc: any, episodes: any) => acc + episodes.length, 0);
    setWatchedEpisodes(watched);
  }, [initialProgression]);

  const toggleSeason = (seasonNumber: number, episodeCount: number) => {
    const currentWatchedEpisodes = progression.watched_episodes || {};
    const isSeasonWatched = 
      (currentWatchedEpisodes[seasonNumber] || []).length === episodeCount;
    
    const newWatchedEpisodes = { ...currentWatchedEpisodes };
    
    if (isSeasonWatched) {
      // Si la saison était complètement regardée, on la vide
      newWatchedEpisodes[seasonNumber] = [];
    } else {
      // Sinon on la marque comme complètement regardée
      newWatchedEpisodes[seasonNumber] = Array.from(
        { length: episodeCount }, 
        (_, i) => i + 1
      );
    }
    
    const totalWatchedCount = Object.values(newWatchedEpisodes)
      .reduce((acc: any, episodes: any) => acc + episodes.length, 0);
    
    // Mise à jour du statut en fonction du nombre d'épisodes regardés
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
    totalEpisodes,
    watchedEpisodes,
    status,
    progression,
    toggleSeason,
    updateStatus
  };
}

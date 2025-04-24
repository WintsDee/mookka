
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
      
      // Générer les épisodes à venir s'il y en a
      const upcomingEps = generateUpcomingEpisodes(mediaDetails, formattedSeasons);
      setUpcomingEpisodes(upcomingEps);
    }
  }, [mediaDetails]);

  useEffect(() => {
    if (initialProgression) {
      setStatus(initialProgression.status || 'to-watch');
      setProgression(initialProgression);
      
      // Calculer le nombre d'épisodes regardés
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
    
    // Vérifier si l'épisode est déjà regardé
    const isEpisodeWatched = seasonEpisodes.includes(episodeNumber);
    
    let updatedSeasonEpisodes: number[];
    
    if (isEpisodeWatched) {
      // Supprimer l'épisode des regardés
      updatedSeasonEpisodes = seasonEpisodes.filter(ep => ep !== episodeNumber);
    } else {
      // Ajouter l'épisode aux regardés
      updatedSeasonEpisodes = [...seasonEpisodes, episodeNumber];
      // Trier les épisodes pour un meilleur affichage
      updatedSeasonEpisodes.sort((a, b) => a - b);
    }
    
    // Mettre à jour les épisodes regardés pour la saison
    const newWatchedEpisodes = {
      ...currentWatchedEpisodes,
      [seasonNumber]: updatedSeasonEpisodes
    };
    
    // Calculer le nombre total d'épisodes regardés
    let totalWatchedCount = 0;
    Object.values(newWatchedEpisodes).forEach((episodes: any) => {
      if (Array.isArray(episodes)) {
        totalWatchedCount += episodes.length;
      }
    });
    
    // Mettre à jour le statut en fonction des épisodes regardés
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
      // Si la saison était complètement regardée, on la vide
      newWatchedEpisodes[seasonNumber] = [];
    } else {
      // Sinon on la marque comme complètement regardée
      newWatchedEpisodes[seasonNumber] = Array.from(
        { length: episodeCount }, 
        (_, i) => i + 1
      );
    }
    
    // Calculer le nombre total d'épisodes regardés de façon sécurisée
    let totalWatchedCount = 0;
    
    // Itération explicite pour assurer la sécurité des types
    Object.values(newWatchedEpisodes).forEach((episodes: any) => {
      if (Array.isArray(episodes)) {
        totalWatchedCount += episodes.length;
      }
    });
    
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


import { useState, useEffect } from "react";
import { updateEpisodeProgress } from "../utils/progression/episode-progress";
import { updateSeasonProgress } from "../utils/progression/season-progress";

export function useProgressionState(initialProgression: any, totalEpisodes: number) {
  const [status, setStatus] = useState(initialProgression?.status || 'to-watch');
  const [progression, setProgression] = useState(initialProgression || {});

  useEffect(() => {
    if (initialProgression) {
      setStatus(initialProgression.status || 'to-watch');
      setProgression(initialProgression);
    }
  }, [initialProgression]);

  const toggleEpisode = (seasonNumber: number, episodeNumber: number) => {
    const updatedProgress = updateEpisodeProgress(progression, seasonNumber, episodeNumber, totalEpisodes);
    setProgression(updatedProgress);
    setStatus(updatedProgress.status);
    return updatedProgress;
  };

  const toggleSeason = (seasonNumber: number, episodeCount: number) => {
    const updatedProgress = updateSeasonProgress(progression, seasonNumber, episodeCount, totalEpisodes);
    setProgression(updatedProgress);
    setStatus(updatedProgress.status);
    return updatedProgress;
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
    status,
    progression,
    toggleEpisode,
    toggleSeason,
    updateStatus
  };
}

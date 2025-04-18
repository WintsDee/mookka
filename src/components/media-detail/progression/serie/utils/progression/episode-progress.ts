
import { determineStatus } from './status-utils';

export function updateEpisodeProgress(
  progression: any,
  seasonNumber: number,
  episodeNumber: number,
  totalEpisodes: number
) {
  const newWatchedEpisodes = { ...(progression.watched_episodes || {}) };
  
  if (!newWatchedEpisodes[seasonNumber]) {
    newWatchedEpisodes[seasonNumber] = [];
  }
  
  const episodeIndex = newWatchedEpisodes[seasonNumber].indexOf(episodeNumber);
  
  if (episodeIndex === -1) {
    newWatchedEpisodes[seasonNumber].push(episodeNumber);
    newWatchedEpisodes[seasonNumber].sort((a: number, b: number) => a - b);
  } else {
    newWatchedEpisodes[seasonNumber].splice(episodeIndex, 1);
  }
  
  const newWatchedCount = Object.values(newWatchedEpisodes).flat().length;
  const newStatus = determineStatus(newWatchedCount, totalEpisodes);
  
  return {
    watched_episodes: newWatchedEpisodes,
    watched_count: newWatchedCount,
    total_episodes: totalEpisodes,
    status: newStatus
  };
}


import { determineStatus } from './status-utils';

export function updateSeasonProgress(
  progression: any,
  seasonNumber: number,
  episodeCount: number,
  totalEpisodes: number
) {
  const newWatchedEpisodes = { ...(progression.watched_episodes || {}) };
  const seasonEpisodes = newWatchedEpisodes[seasonNumber] || [];
  const allWatched = seasonEpisodes.length === episodeCount;
  
  if (allWatched) {
    newWatchedEpisodes[seasonNumber] = [];
  } else {
    newWatchedEpisodes[seasonNumber] = Array.from(
      { length: episodeCount }, 
      (_, i) => i + 1
    );
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

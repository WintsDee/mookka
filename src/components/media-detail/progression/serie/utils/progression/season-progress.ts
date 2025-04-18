
import { determineStatus } from './status-utils';

export function updateSeasonProgress(
  progression: any,
  seasonNumber: number,
  episodeCount: number,
  totalEpisodes: number
) {
  // Create a copy of the watched episodes structure
  const newWatchedEpisodes = { ...(progression.watched_episodes || {}) };
  
  // Check if all episodes in this season are already watched
  const seasonEpisodes = newWatchedEpisodes[seasonNumber] || [];
  const allWatched = Array.isArray(seasonEpisodes) && seasonEpisodes.length === episodeCount;
  
  // Toggle the entire season
  if (allWatched) {
    // If all watched, clear the season
    newWatchedEpisodes[seasonNumber] = [];
  } else {
    // If not all watched, mark all episodes as watched
    newWatchedEpisodes[seasonNumber] = Array.from(
      { length: episodeCount }, 
      (_, i) => i + 1
    );
  }
  
  // Count total watched episodes across all seasons
  const newWatchedCount = Object.values(newWatchedEpisodes).reduce(
    (count, episodes) => count + (Array.isArray(episodes) ? episodes.length : 0), 
    0
  );
  
  // Determine the new status based on watch progress
  const newStatus = determineStatus(newWatchedCount, totalEpisodes);
  
  // Return the updated progression data
  return {
    watched_episodes: newWatchedEpisodes,
    watched_count: newWatchedCount,
    total_episodes: totalEpisodes,
    status: newStatus
  };
}

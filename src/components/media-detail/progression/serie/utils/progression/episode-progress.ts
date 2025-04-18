
import { determineStatus } from './status-utils';

export function updateEpisodeProgress(
  progression: any,
  seasonNumber: number,
  episodeNumber: number,
  totalEpisodes: number
) {
  // Create a copy of the watched episodes structure
  const newWatchedEpisodes = { ...(progression.watched_episodes || {}) };
  
  // Ensure the season array exists
  if (!newWatchedEpisodes[seasonNumber]) {
    newWatchedEpisodes[seasonNumber] = [];
  } else if (!Array.isArray(newWatchedEpisodes[seasonNumber])) {
    // Make sure it's an array if it wasn't for some reason
    newWatchedEpisodes[seasonNumber] = [];
  }
  
  // Find if the episode is already marked as watched
  const episodeIndex = newWatchedEpisodes[seasonNumber].indexOf(episodeNumber);
  
  // Toggle the episode watched status
  if (episodeIndex === -1) {
    // Add to watched
    newWatchedEpisodes[seasonNumber].push(episodeNumber);
    // Sort for better display
    newWatchedEpisodes[seasonNumber].sort((a: number, b: number) => a - b);
  } else {
    // Remove from watched
    newWatchedEpisodes[seasonNumber].splice(episodeIndex, 1);
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

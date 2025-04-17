import { SerieProgression } from '../types';

/**
 * Toggles an episode's watched status and updates progression data
 */
export function toggleEpisode(
  progression: SerieProgression,
  seasonNumber: number, 
  episodeNumber: number,
  totalEpisodes: number
): SerieProgression {
  const newWatchedEpisodes = { ...(progression.watched_episodes || {}) };
  
  if (!newWatchedEpisodes[seasonNumber]) {
    newWatchedEpisodes[seasonNumber] = [];
  }
  
  const episodeIndex = newWatchedEpisodes[seasonNumber].indexOf(episodeNumber);
  
  if (episodeIndex === -1) {
    // Add the episode to the watched list
    newWatchedEpisodes[seasonNumber].push(episodeNumber);
    // Sort the list for better readability
    newWatchedEpisodes[seasonNumber].sort((a, b) => a - b);
  } else {
    // Remove the episode from the watched list
    newWatchedEpisodes[seasonNumber].splice(episodeIndex, 1);
  }
  
  // Calculate the new number of watched episodes
  const newWatchedCount = Object.values(newWatchedEpisodes).flat().length;
  
  // Update status automatically based on progress
  let newStatus = progression.status || 'to-watch';
  if (newWatchedCount === 0) {
    newStatus = 'to-watch';
  } else if (newWatchedCount === totalEpisodes) {
    newStatus = 'completed';
  } else {
    newStatus = 'watching';
  }
  
  return {
    ...progression,
    watched_episodes: newWatchedEpisodes,
    watched_count: newWatchedCount,
    total_episodes: totalEpisodes,
    status: newStatus
  };
}

/**
 * Toggles all episodes in a season and updates progression data
 */
export function toggleSeason(
  progression: SerieProgression,
  seasonNumber: number, 
  episodeCount: number,
  totalEpisodes: number
): SerieProgression {
  const newWatchedEpisodes = { ...(progression.watched_episodes || {}) };
  const seasonEpisodes = newWatchedEpisodes[seasonNumber] || [];
  const allWatched = seasonEpisodes.length === episodeCount;
  
  if (allWatched) {
    // If all are watched, remove them all
    newWatchedEpisodes[seasonNumber] = [];
  } else {
    // Otherwise, mark all episodes as watched
    // Create an array with all episode numbers from 1 to episodeCount
    newWatchedEpisodes[seasonNumber] = Array.from(
      { length: episodeCount }, 
      (_, i) => i + 1
    );
  }
  
  // Calculate the new number of watched episodes
  const newWatchedCount = Object.values(newWatchedEpisodes).flat().length;
  
  // Update status automatically based on progress
  let newStatus = progression.status || 'to-watch';
  if (newWatchedCount === 0) {
    newStatus = 'to-watch';
  } else if (newWatchedCount === totalEpisodes) {
    newStatus = 'completed';
  } else {
    newStatus = 'watching';
  }
  
  return {
    ...progression,
    watched_episodes: newWatchedEpisodes,
    watched_count: newWatchedCount,
    total_episodes: totalEpisodes,
    status: newStatus
  };
}

/**
 * Updates the status in the progression data
 */
export function updateStatus(progression: SerieProgression, newStatus: string): SerieProgression {
  return {
    ...progression,
    status: newStatus
  };
}

/**
 * Calculates the total number of episodes across all seasons
 */
export function calculateTotalEpisodes(seasons: any[]): number {
  return seasons.reduce((acc, season) => 
    acc + (season.episode_count || 0), 0);
}

/**
 * Calculates the number of watched episodes from progression data
 */
export function calculateWatchedEpisodes(progression: SerieProgression): number {
  return Object.values(progression?.watched_episodes || {}).flat().length;
}

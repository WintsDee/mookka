
import { SerieProgression } from "../types";

/**
 * Toggles the watched status of an episode
 */
export function handleToggleEpisode(
  progression: SerieProgression,
  seasonNumber: number,
  episodeNumber: number
): SerieProgression | undefined {
  try {
    // Create a copy of the current progression to modify
    const updatedProgression: SerieProgression = {
      ...progression,
      watched_episodes: { ...(progression.watched_episodes || {}) }
    };
    
    // Initialize the season's watched episodes array if it doesn't exist
    if (!updatedProgression.watched_episodes![seasonNumber]) {
      updatedProgression.watched_episodes![seasonNumber] = [];
    }
    
    // Get the current list of watched episodes for this season
    const watchedEpisodes = [...updatedProgression.watched_episodes![seasonNumber]];
    
    // Find if the episode is already marked as watched
    const episodeIndex = watchedEpisodes.indexOf(episodeNumber);
    
    if (episodeIndex === -1) {
      // If not watched, add it to the watched list
      watchedEpisodes.push(episodeNumber);
    } else {
      // If already watched, remove it from the watched list
      watchedEpisodes.splice(episodeIndex, 1);
    }
    
    // Sort episode numbers for consistency
    watchedEpisodes.sort((a, b) => a - b);
    
    // Update the progression with the new watched episodes
    updatedProgression.watched_episodes![seasonNumber] = watchedEpisodes;
    
    // Update the watched count
    const totalWatchedCount = Object.values(updatedProgression.watched_episodes!).reduce(
      (acc, episodes) => acc + episodes.length, 
      0
    );
    
    updatedProgression.watched_count = totalWatchedCount;
    
    return updatedProgression;
  } catch (error) {
    console.error('Error toggling episode:', error);
    return undefined;
  }
}

/**
 * Toggles all episodes in a season as watched or unwatched
 */
export function handleToggleSeason(
  progression: SerieProgression,
  seasonNumber: number,
  episodeCount: number
): SerieProgression | undefined {
  try {
    // Create a copy of the current progression to modify
    const updatedProgression: SerieProgression = {
      ...progression,
      watched_episodes: { ...(progression.watched_episodes || {}) }
    };
    
    // Check if all episodes of the season are already watched
    const currentWatchedEpisodes = updatedProgression.watched_episodes![seasonNumber] || [];
    const allEpisodesWatched = currentWatchedEpisodes.length === episodeCount;
    
    if (allEpisodesWatched) {
      // If all episodes are watched, mark all as unwatched
      updatedProgression.watched_episodes![seasonNumber] = [];
    } else {
      // Mark all episodes as watched
      updatedProgression.watched_episodes![seasonNumber] = Array.from(
        { length: episodeCount }, 
        (_, i) => i + 1
      );
    }
    
    // Update the watched count
    const totalWatchedCount = Object.values(updatedProgression.watched_episodes!).reduce(
      (acc, episodes) => acc + episodes.length, 
      0
    );
    
    updatedProgression.watched_count = totalWatchedCount;
    
    return updatedProgression;
  } catch (error) {
    console.error('Error toggling season:', error);
    return undefined;
  }
}

/**
 * Updates the watching status of the serie
 */
export function handleUpdateStatus(
  progression: SerieProgression,
  newStatus: string
): SerieProgression | undefined {
  try {
    return {
      ...progression,
      status: newStatus
    };
  } catch (error) {
    console.error('Error updating status:', error);
    return undefined;
  }
}

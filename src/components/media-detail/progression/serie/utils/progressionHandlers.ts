
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
    console.log("handleToggleEpisode input:", { progression, seasonNumber, episodeNumber });
    
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
      console.log(`Added episode ${episodeNumber} to watched list`);
    } else {
      // If already watched, remove it from the watched list
      watchedEpisodes.splice(episodeIndex, 1);
      console.log(`Removed episode ${episodeNumber} from watched list`);
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
    
    console.log("handleToggleEpisode output:", updatedProgression);
    
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
    console.log("handleToggleSeason input:", { progression, seasonNumber, episodeCount });
    
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
      console.log(`Unmarked all episodes for season ${seasonNumber}`);
    } else {
      // Mark all episodes as watched
      updatedProgression.watched_episodes![seasonNumber] = Array.from(
        { length: episodeCount }, 
        (_, i) => i + 1
      );
      console.log(`Marked all episodes for season ${seasonNumber} as watched`);
    }
    
    // Update the watched count
    const totalWatchedCount = Object.values(updatedProgression.watched_episodes!).reduce(
      (acc, episodes) => acc + episodes.length, 
      0
    );
    
    updatedProgression.watched_count = totalWatchedCount;
    
    console.log("handleToggleSeason output:", updatedProgression);
    
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
    console.log("handleUpdateStatus input:", { progression, newStatus });
    
    const updatedProgression = {
      ...progression,
      status: newStatus
    };
    
    console.log("handleUpdateStatus output:", updatedProgression);
    
    return updatedProgression;
  } catch (error) {
    console.error('Error updating status:', error);
    return undefined;
  }
}

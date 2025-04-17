
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

function determineStatus(watchedCount: number, totalEpisodes: number): string {
  if (watchedCount === 0) return 'to-watch';
  if (watchedCount === totalEpisodes) return 'completed';
  return 'watching';
}

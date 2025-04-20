
export function determineStatus(watchedCount: number, totalEpisodes: number): string {
  if (watchedCount === 0) return 'to-watch';
  if (watchedCount === totalEpisodes) return 'completed';
  return 'watching';
}


export function determineStatus(watchedCount: number, totalCount: number): string {
  if (watchedCount === 0) {
    return 'to-watch';
  } else if (watchedCount === totalCount) {
    return 'completed';
  } else {
    return 'watching';
  }
}

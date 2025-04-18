
export function normalizeRating(rating: number | undefined, sourceScale: number): number | null {
  if (rating === undefined || rating === null) {
    return null;
  }
  
  // Convert the rating to the 10-point scale if it's not already
  if (sourceScale !== 10) {
    return parseFloat(((rating / sourceScale) * 10).toFixed(1));
  }
  
  // Already on 10-point scale, just ensure one decimal place
  return parseFloat(rating.toFixed(1));
}

export function formatDate(dateString?: string): string | null {
  if (!dateString) return null;
  try {
    return dateString.substring(0, 4);
  } catch {
    return null;
  }
}

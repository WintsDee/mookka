/**
 * Filter out adult content from media results
 */
export function filterAdultContent(mediaList: any[]): any[] {
  // Keep only the most explicit keywords to avoid over-filtering
  const adultContentKeywords = [
    'xxx', 'porn', 'porno', 'pornographique', 'bdsm', 'kamasutra', 'explicit'
  ];
  
  return mediaList.filter(media => {
    const title = (media.title || '').toLowerCase();
    const description = (media.description || '').toLowerCase();
    const genres = Array.isArray(media.genres) 
      ? media.genres.map((g: string) => g.toLowerCase()).join(' ') 
      : '';
    
    const contentText = `${title} ${description} ${genres}`;
    
    // Only filter out explicit adult content
    return !adultContentKeywords.some(keyword => contentText.includes(keyword));
  });
}

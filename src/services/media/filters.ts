
/**
 * Filter out adult content from media results
 */
export function filterAdultContent(mediaList: any[]): any[] {
  // Expanded keyword list to better filter adult content
  const adultContentKeywords = [
    'xxx', 'porn', 'porno', 'pornographique', 'bdsm', 'kamasutra', 'explicit',
    'sexe', 'érotique', 'adult', 'adulte', 'nympho', 'nymphomane', 'nude', 'nu',
    'sensual', 'sensuel', 'mature', 'x-rated', 'classé x', 'uncensored', 'non censuré'
  ];
  
  return mediaList.filter(media => {
    const title = (media.title || '').toLowerCase();
    const description = (media.description || '').toLowerCase();
    const genres = Array.isArray(media.genres) 
      ? media.genres.map((g: string) => g.toLowerCase()).join(' ') 
      : '';
    
    const contentText = `${title} ${description} ${genres}`;
    
    // Filter out explicit adult content
    return !adultContentKeywords.some(keyword => contentText.includes(keyword));
  });
}

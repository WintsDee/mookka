
/**
 * Filter out adult content from media results
 */
export function filterAdultContent(mediaList: any[]): any[] {
  const adultContentKeywords = [
    'xxx', 'erotic', 'érotique', 'adult', 'adulte', 'sex', 'sexe', 'sexy', 'porn', 'porno',
    'pornographique', 'nude', 'nu', 'nue', 'naked', 'mature', 'kinky', 'fetish', 'fétiche',
    'bdsm', 'kamasutra', 'nudité', 'explicit', 'explicite', 'hot', 'sensual', 'sensuel',
    'seduction', 'séduction'
  ];
  
  return mediaList.filter(media => {
    const title = (media.title || '').toLowerCase();
    const description = (media.description || '').toLowerCase();
    const genres = Array.isArray(media.genres) 
      ? media.genres.map((g: string) => g.toLowerCase()).join(' ') 
      : '';
    
    const contentText = `${title} ${description} ${genres}`;
    
    // Vérifier si le contenu contient des mots-clés inappropriés
    return !adultContentKeywords.some(keyword => contentText.includes(keyword));
  });
}

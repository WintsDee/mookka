
/**
 * Filtre le contenu adulte des résultats de recherche
 */
export function filterAdultContent(media: any[]): any[] {
  return media.filter(item => {
    // Pour les films/séries (TMDB)
    if (item.hasOwnProperty('adult')) {
      return !item.adult;
    }
    
    // Pour les jeux (RAWG)
    if (item.hasOwnProperty('esrb_rating')) {
      return !item.esrb_rating || item.esrb_rating.slug !== 'adults-only';
    }
    
    // Par défaut, laisser passer le contenu
    return true;
  });
}

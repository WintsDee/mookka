
import { normalizeRating } from './utils';

export function formatGameDetails(media: any) {
  let gameDescription = media.description_raw || media.description || "Aucune description disponible.";
  
  if (media.locale_descriptions && media.locale_descriptions['fr']) {
    gameDescription = media.locale_descriptions['fr'];
  }
  
  return {
    id: media.id?.toString() || "unknown",
    title: media.name || "Jeu sans titre",
    coverImage: media.background_image || '/placeholder.svg',
    year: media.released ? media.released.substring(0, 4) : null,
    rating: normalizeRating(media.rating, 5),
    genres: media.genres?.map((g: any) => g.name) || [],
    description: gameDescription,
    publisher: media.publishers?.length > 0 ? media.publishers[0].name : null,
    platform: media.platforms?.map((p: any) => p.platform.name).join(', '),
    type: 'game'
  };
}

export function getGameAdditionalInfo(media: any, formattedMedia: any) {
  return {
    developer: media.developers?.[0]?.name,
    publisher: formattedMedia.publisher,
    platform: formattedMedia.platform,
    esrbRating: translateEsrbRating(media.esrb_rating?.name),
    metacritic: media.metacritic ? normalizeRating(media.metacritic, 100) : undefined,
    genres: media.genres?.map((g: any) => g.name).join(', '),
    releaseDate: media.released,
    website: media.website,
    tags: media.tags?.slice(0, 5).map((t: any) => t.name),
    awards: media.awards || []
  };
}

function translateEsrbRating(rating: string): string {
  if (!rating) return "";
  
  const ratingMap: Record<string, string> = {
    'Everyone': 'Tout public',
    'Everyone 10+': '10 ans et plus',
    'Teen': 'Adolescents',
    'Mature': '17 ans et plus',
    'Adults Only': 'Adultes uniquement',
    'Rating Pending': 'Évaluation en cours'
  };
  
  return ratingMap[rating] || rating;
}

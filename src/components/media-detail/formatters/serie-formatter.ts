
import { normalizeRating } from './utils';

export function formatSerieDetails(media: any) {
  return {
    id: media.id?.toString() || "unknown",
    title: media.name || media.original_name || "Série sans titre",
    coverImage: media.poster_path ? `https://image.tmdb.org/t/p/original${media.poster_path}` : '/placeholder.svg',
    year: media.first_air_date ? media.first_air_date.substring(0, 4) : null,
    rating: normalizeRating(media.vote_average, 10),
    genres: media.genres?.map((g: any) => g.name) || [],
    description: media.overview || "Aucune description disponible.",
    duration: media.number_of_seasons ? `${media.number_of_seasons} saison${media.number_of_seasons > 1 ? 's' : ''}` : null,
    type: 'serie'
  };
}

export function getSerieAdditionalInfo(media: any) {
  return {
    seasons: media.number_of_seasons,
    episodes: media.number_of_episodes,
    cast: media.credits?.cast?.slice(0, 10).map((actor: any) => actor.name),
    creators: media.created_by?.map((creator: any) => creator.name).join(', '),
    status: translateStatus(media.status),
    networks: media.networks?.map((n: any) => n.name).join(', '),
    originalTitle: media.original_name,
    language: media.original_language?.toUpperCase(),
    nextEpisode: media.next_episode_to_air ? new Date(media.next_episode_to_air.air_date).toLocaleDateString('fr-FR') : undefined,
    awards: media.awards || []
  };
}

function translateStatus(status: string): string {
  if (!status) return "";
  
  const statusMap: Record<string, string> = {
    'Ended': 'Terminée',
    'Canceled': 'Annulée',
    'Returning Series': 'En cours',
    'In Production': 'En production',
    'Planned': 'Planifiée',
    'Pilot': 'Pilote',
    'Pilot Ordered': 'Pilote commandé'
  };
  
  return statusMap[status] || status;
}

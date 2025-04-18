
import { normalizeRating } from './utils';

export function formatFilmDetails(media: any) {
  return {
    id: media.id?.toString() || "unknown",
    title: media.title || media.original_title || "Film sans titre",
    coverImage: media.poster_path ? `https://image.tmdb.org/t/p/original${media.poster_path}` : '/placeholder.svg',
    year: media.release_date ? media.release_date.substring(0, 4) : null,
    rating: normalizeRating(media.vote_average, 10),
    genres: media.genres?.map((g: any) => g.name) || [],
    description: media.overview || "Aucune description disponible.",
    duration: media.runtime ? `${media.runtime} min` : null,
    director: media.credits?.crew?.find((p: any) => p.job === 'Director')?.name,
    type: 'film'
  };
}

export function getFilmAdditionalInfo(media: any, formattedMedia: any) {
  return {
    director: formattedMedia.director,
    studio: media.production_companies?.[0]?.name,
    cast: media.credits?.cast?.slice(0, 10).map((actor: any) => actor.name),
    originalTitle: media.original_title,
    language: media.original_language?.toUpperCase(),
    budget: media.budget ? `${(media.budget / 1000000).toFixed(1)}M €` : undefined,
    revenue: media.revenue ? `${(media.revenue / 1000000).toFixed(1)}M €` : undefined,
    productionCountries: media.production_countries?.map((c: any) => c.name).join(', '),
    awards: media.awards || []
  };
}

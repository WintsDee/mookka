
import { MediaType } from "@/types";

export function formatSerieMedia(media: any) {
  return {
    external_id: media.id.toString() || '',
    title: media.name || '',
    type: 'serie' as MediaType,
    cover_image: media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : null,
    year: media.first_air_date ? parseInt(media.first_air_date.substring(0, 4)) : null,
    rating: media.vote_average || null,
    genres: media.genres ? media.genres.map((g: any) => g.name) : [],
    description: media.overview || '',
    duration: media.number_of_seasons ? `${media.number_of_seasons} saison(s)` : '',
  };
}

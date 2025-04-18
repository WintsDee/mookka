
import { MediaType } from "@/types";

export function formatFilmMedia(media: any) {
  return {
    external_id: media.id.toString() || '',
    title: media.title || '',
    type: 'film' as MediaType,
    cover_image: media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : null,
    year: media.release_date ? parseInt(media.release_date.substring(0, 4)) : null,
    rating: media.vote_average || null,
    genres: media.genres ? media.genres.map((g: any) => g.name) : [],
    description: media.overview || '',
    duration: media.runtime ? `${media.runtime} min` : '',
    director: media.director || '',
  };
}


import { MediaType } from "@/types";

export const formatFilmSearchResult = (item: any) => ({
  id: item.id.toString(),
  title: item.title,
  type: 'film' as MediaType,
  coverImage: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder.svg',
  year: item.release_date ? parseInt(item.release_date.substring(0, 4)) : null,
  rating: item.vote_average || null,
  popularity: item.popularity || 0,
  externalData: item
});

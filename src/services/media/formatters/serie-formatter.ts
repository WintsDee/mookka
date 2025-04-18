
import { MediaType } from "@/types";

export const formatSerieSearchResult = (item: any) => ({
  id: item.id.toString(),
  title: item.name,
  type: 'serie' as MediaType,
  coverImage: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder.svg',
  year: item.first_air_date ? parseInt(item.first_air_date.substring(0, 4)) : null,
  rating: item.vote_average || null,
  popularity: item.popularity || 0,
  externalData: item
});

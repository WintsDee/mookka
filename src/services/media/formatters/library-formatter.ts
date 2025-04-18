
import { MediaType } from "@/types";

export const formatLibraryMedia = (item: any) => ({
  id: item.media.id,
  title: item.media.title,
  type: item.media.type as MediaType,
  coverImage: item.media.cover_image,
  year: item.media.year,
  rating: item.media.rating,
  userRating: item.user_rating,
  genres: item.media.genres,
  description: item.media.description,
  status: (item.status || 'to-watch') as 'to-watch' | 'watching' | 'completed',
  addedAt: item.added_at,
  notes: item.notes,
  duration: item.media.duration,
  director: item.media.director,
  author: item.media.author,
  publisher: item.media.publisher,
  platform: item.media.platform
});

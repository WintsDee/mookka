
import { Media } from "@/types";

export function formatLibraryMedia(item: any): Media {
  const media = item.media;
  return {
    id: media.id,
    title: media.title,
    type: media.type,
    coverImage: media.cover_image,
    year: media.year,
    rating: media.rating,
    genres: media.genres,
    description: media.description,
    status: item.status,
    duration: media.duration,
    director: media.director,
    author: media.author,
    publisher: media.publisher,
    platform: media.platform
  };
}

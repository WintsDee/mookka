
import { MediaType } from "@/types";

export function formatBookMedia(media: any) {
  return {
    external_id: media.id.toString() || '',
    title: media.volumeInfo?.title || '',
    type: 'book' as MediaType,
    cover_image: media.volumeInfo?.imageLinks?.thumbnail || null,
    year: media.volumeInfo?.publishedDate ? parseInt(media.volumeInfo.publishedDate.substring(0, 4)) : null,
    genres: media.volumeInfo?.categories || [],
    description: media.volumeInfo?.description || '',
    author: media.volumeInfo?.authors ? media.volumeInfo.authors.join(', ') : '',
  };
}

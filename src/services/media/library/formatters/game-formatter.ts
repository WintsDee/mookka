
import { MediaType } from "@/types";

export function formatGameMedia(media: any) {
  return {
    external_id: media.id.toString() || '',
    title: media.name || '',
    type: 'game' as MediaType,
    cover_image: media.background_image || null,
    year: media.released ? parseInt(media.released.substring(0, 4)) : null,
    rating: media.rating || null,
    genres: media.genres ? media.genres.map((g: any) => g.name) : [],
    description: media.description_raw || '',
    publisher: media.publishers && media.publishers.length > 0 ? media.publishers[0].name : '',
    platform: media.platforms ? media.platforms.map((p: any) => p.platform.name).join(', ') : '',
  };
}

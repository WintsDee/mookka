
import { MediaType } from "@/types";
import { Platform } from "./types";
import { generateFilmAndSeriesPlatforms } from "./platforms/film-series-platforms";
import { generateBookPlatforms } from "./platforms/book-platforms";
import { generateGamePlatforms } from "./platforms/game-platforms";

export function generatePlatformData(mediaId: string, mediaType: MediaType, title: string): Platform[] {
  const encodedTitle = encodeURIComponent(title);
  
  // Log the media information for debugging
  console.log(`Generating platform data for: ${mediaType} ID:${mediaId} Title:${title}`);
  
  if (mediaType === "film" || mediaType === "serie") {
    return generateFilmAndSeriesPlatforms(mediaId, encodedTitle);
  } else if (mediaType === "book") {
    return generateBookPlatforms(mediaId, encodedTitle);
  } else if (mediaType === "game") {
    return generateGamePlatforms(mediaId, encodedTitle);
  }
  
  return [];
}

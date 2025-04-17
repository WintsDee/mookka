
import { Media, MediaType } from "@/types";

export function formatLibraryMedia(item: any): Media {
  const media = item.media;
  return {
    id: media.id,
    title: media.title,
    type: media.type as MediaType,  // Add type assertion
    coverImage: media.cover_image,
    year: media.year,
    rating: media.rating,
    genres: media.genres,
    description: media.description,
    status: item.status as Media['status'], // Add type assertion
    duration: media.duration,
    director: media.director,
    author: media.author,
    publisher: media.publisher,
    platform: media.platform
  };
}

// Film search result formatting
export function formatFilmSearchResult(item: any): Media {
  return {
    id: item.id.toString(),
    title: item.title || item.original_title || "",
    type: "film",
    coverImage: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "/placeholder.svg",
    year: item.release_date ? parseInt(item.release_date.substring(0, 4)) : undefined,
    rating: item.vote_average || undefined,
    genres: item.genre_ids || [],
    description: item.overview || "",
    popularity: item.popularity,
    director: item.director,
  };
}

// Serie search result formatting
export function formatSerieSearchResult(item: any): Media {
  return {
    id: item.id.toString(),
    title: item.name || item.original_name || "",
    type: "serie",
    coverImage: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "/placeholder.svg",
    year: item.first_air_date ? parseInt(item.first_air_date.substring(0, 4)) : undefined,
    rating: item.vote_average || undefined,
    genres: item.genre_ids || [],
    description: item.overview || "",
    popularity: item.popularity,
  };
}

// Book search result formatting
export function formatBookSearchResult(item: any): Media {
  const volumeInfo = item.volumeInfo || {};
  
  return {
    id: item.id,
    title: volumeInfo.title || "",
    type: "book",
    coverImage: volumeInfo.imageLinks?.thumbnail || "/placeholder.svg",
    year: volumeInfo.publishedDate ? parseInt(volumeInfo.publishedDate.substring(0, 4)) : undefined,
    rating: volumeInfo.averageRating || undefined,
    genres: volumeInfo.categories || [],
    description: volumeInfo.description || "",
    author: volumeInfo.authors ? volumeInfo.authors.join(", ") : undefined,
    popularity: item.saleInfo?.saleability === "FOR_SALE" ? 10 : 0, // Give higher score to books that are for sale
  };
}

// Game search result formatting
export function formatGameSearchResult(item: any): Media {
  return {
    id: item.id.toString(),
    title: item.name || "",
    type: "game",
    coverImage: item.background_image || "/placeholder.svg",
    year: item.released ? parseInt(item.released.substring(0, 4)) : undefined,
    rating: item.rating || undefined,
    genres: item.genres ? item.genres.map((g: any) => g.name) : [],
    description: item.description_raw || "",
    publisher: item.publishers?.length > 0 ? item.publishers[0].name : undefined,
    platform: item.platforms ? item.platforms.map((p: any) => p.platform.name).join(", ") : undefined,
    popularity: item.ratings_count || 0,
  };
}

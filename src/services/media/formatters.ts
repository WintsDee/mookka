
import { Media, MediaType, MediaStatus } from "@/types";

/**
 * Formate les données d'un média de la bibliothèque de l'utilisateur
 */
export function formatLibraryMedia(userMediaItem: any): Media {
  const media = userMediaItem.media;

  return {
    id: media.id,
    title: media.title,
    type: media.type as MediaType,
    coverImage: media.cover_image || '/placeholder.svg',
    year: media.year,
    rating: media.rating,
    status: userMediaItem.status as MediaStatus,
    genres: media.genres,
    description: media.description,
    duration: media.duration,
    director: media.director,
    author: media.author,
    publisher: media.publisher,
    platform: media.platform
  };
}

/**
 * Formate les résultats de recherche de livres pour l'affichage
 */
export function formatBookSearchResult(book: any): Media {
  return {
    id: book.id,
    title: book.volumeInfo?.title || 'Titre inconnu',
    type: 'book' as MediaType,
    coverImage: book.volumeInfo?.imageLinks?.thumbnail || '/placeholder.svg',
    year: book.volumeInfo?.publishedDate ? parseInt(book.volumeInfo.publishedDate.substring(0, 4)) : undefined,
    rating: book.volumeInfo?.averageRating ? parseFloat((book.volumeInfo.averageRating * 2).toFixed(1)) : undefined,
    author: book.volumeInfo?.authors?.join(', '),
    genres: book.volumeInfo?.categories || []
  };
}

/**
 * Formate les résultats de recherche de films pour l'affichage
 */
export function formatFilmSearchResult(film: any): Media {
  return {
    id: film.id.toString(),
    title: film.title || film.original_title || 'Titre inconnu',
    type: 'film' as MediaType,
    coverImage: film.poster_path ? `https://image.tmdb.org/t/p/w500${film.poster_path}` : '/placeholder.svg',
    year: film.release_date ? parseInt(film.release_date.substring(0, 4)) : undefined,
    rating: film.vote_average ? parseFloat(film.vote_average.toFixed(1)) : undefined,
    popularity: film.popularity
  };
}

/**
 * Formate les résultats de recherche de séries pour l'affichage
 */
export function formatSerieSearchResult(serie: any): Media {
  return {
    id: serie.id.toString(),
    title: serie.name || serie.original_name || 'Titre inconnu',
    type: 'serie' as MediaType,
    coverImage: serie.poster_path ? `https://image.tmdb.org/t/p/w500${serie.poster_path}` : '/placeholder.svg',
    year: serie.first_air_date ? parseInt(serie.first_air_date.substring(0, 4)) : undefined,
    rating: serie.vote_average ? parseFloat(serie.vote_average.toFixed(1)) : undefined,
    popularity: serie.popularity
  };
}

/**
 * Formate les résultats de recherche de jeux pour l'affichage
 */
export function formatGameSearchResult(game: any): Media {
  return {
    id: game.id.toString(),
    title: game.name || 'Titre inconnu',
    type: 'game' as MediaType,
    coverImage: game.background_image || '/placeholder.svg',
    year: game.released ? parseInt(game.released.substring(0, 4)) : undefined,
    rating: game.rating ? parseFloat(game.rating.toFixed(1)) : undefined,
    platform: game.platforms?.map((p: any) => p.platform.name).join(', ')
  };
}


import { Media, MediaType } from "@/types";

export function formatLibraryMedia(item: any): Media {
  const media = item.media;
  
  if (!media) {
    console.error("Media data is missing in formatLibraryMedia:", item);
    return {
      id: item.id || 'unknown',
      title: 'Média inconnu',
      type: 'film' as MediaType,
      year: null,
      rating: null,
      genres: [],
      description: null,
      coverImage: null,
      status: item.status || null,
      addedAt: item.added_at,
      userRating: item.user_rating,
      userReview: item.notes
    };
  }

  return {
    id: media.id,
    title: media.title,
    type: media.type as MediaType,
    year: media.year,
    rating: media.rating,
    genres: media.genres || [],
    description: media.description,
    coverImage: media.cover_image,
    duration: media.duration,
    director: media.director,
    author: media.author,
    publisher: media.publisher,
    platform: media.platform,
    // User-specific data from user_media table
    status: item.status,
    addedAt: item.added_at,
    userRating: item.user_rating,
    userReview: item.notes
  };
}

export function formatSearchResult(item: any, type: MediaType): Media {
  return {
    id: item.id?.toString() || item.tmdbId?.toString() || item.igdbId?.toString() || Math.random().toString(),
    title: item.title || item.name || 'Titre inconnu',
    type,
    year: item.release_date ? new Date(item.release_date).getFullYear() : 
          item.first_air_date ? new Date(item.first_air_date).getFullYear() :
          item.published_date ? new Date(item.published_date).getFullYear() :
          item.released ? new Date(item.released).getFullYear() : null,
    rating: item.vote_average || item.rating || item.averageRating || null,
    genres: item.genres?.map((g: any) => typeof g === 'string' ? g : g.name) || 
            item.genre_ids?.map((id: number) => getGenreName(id, type)) || [],
    description: item.overview || item.description || item.summary || null,
    coverImage: formatImageUrl(item.poster_path || item.backdrop_path || item.cover || item.background_image, type),
    duration: item.runtime ? `${item.runtime} min` : 
              item.episode_run_time?.[0] ? `${item.episode_run_time[0]} min` : null,
    director: item.director || (item.crew?.find((c: any) => c.job === 'Director')?.name) || null,
    author: item.authors?.[0] || item.author || null,
    publisher: item.publisher || null,
    platform: item.platforms?.map((p: any) => p.platform?.name || p.name).join(', ') || null
  };
}

// Add the missing specific formatter functions
export function formatFilmSearchResult(item: any): any {
  return {
    id: item.id?.toString() || Math.random().toString(),
    title: item.title || item.original_title || 'Titre inconnu',
    type: 'film' as MediaType,
    year: item.release_date ? new Date(item.release_date).getFullYear() : null,
    rating: item.vote_average || null,
    genres: item.genres?.map((g: any) => typeof g === 'string' ? g : g.name) || 
            item.genre_ids?.map((id: number) => getGenreName(id, 'film')) || [],
    description: item.overview || null,
    coverImage: formatImageUrl(item.poster_path || item.backdrop_path, 'film'),
    duration: item.runtime ? `${item.runtime} min` : null,
    director: item.crew?.find((c: any) => c.job === 'Director')?.name || null,
    popularity: item.popularity || 0
  };
}

export function formatSerieSearchResult(item: any): any {
  return {
    id: item.id?.toString() || Math.random().toString(),
    title: item.name || item.original_name || 'Titre inconnu',
    type: 'serie' as MediaType,
    year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : null,
    rating: item.vote_average || null,
    genres: item.genres?.map((g: any) => typeof g === 'string' ? g : g.name) || 
            item.genre_ids?.map((id: number) => getGenreName(id, 'serie')) || [],
    description: item.overview || null,
    coverImage: formatImageUrl(item.poster_path || item.backdrop_path, 'serie'),
    duration: item.number_of_seasons ? `${item.number_of_seasons} saison${item.number_of_seasons > 1 ? 's' : ''}` : null,
    popularity: item.popularity || 0
  };
}

export function formatBookSearchResult(item: any): any {
  return {
    id: item.id?.toString() || Math.random().toString(),
    title: item.volumeInfo?.title || 'Titre inconnu',
    type: 'book' as MediaType,
    year: item.volumeInfo?.publishedDate ? new Date(item.volumeInfo.publishedDate).getFullYear() : null,
    rating: item.volumeInfo?.averageRating ? (item.volumeInfo.averageRating * 2) : null, // Convert from 5 to 10 scale
    genres: item.volumeInfo?.categories || [],
    description: item.volumeInfo?.description || null,
    coverImage: item.volumeInfo?.imageLinks?.thumbnail || null,
    author: item.volumeInfo?.authors?.join(', ') || null,
    publisher: item.volumeInfo?.publisher || null,
    popularity: item.volumeInfo?.ratingsCount || 0
  };
}

export function formatGameSearchResult(item: any): any {
  return {
    id: item.id?.toString() || Math.random().toString(),
    title: item.name || 'Titre inconnu',
    type: 'game' as MediaType,
    year: item.released ? new Date(item.released).getFullYear() : null,
    rating: item.rating ? (item.rating * 2) : null, // Convert from 5 to 10 scale
    genres: item.genres?.map((g: any) => g.name) || [],
    description: item.description_raw || item.description || null,
    coverImage: item.background_image ? item.background_image.replace('//images.igdb.com/', 'https://images.igdb.com/').replace('/t_thumb/', '/t_cover_big/') : null,
    publisher: item.publishers?.[0]?.name || null,
    platform: item.platforms?.map((p: any) => p.platform?.name || p.name).join(', ') || null,
    popularity: item.rating || 0
  };
}

function formatImageUrl(path: string | null, type: MediaType): string | null {
  if (!path) return null;
  
  if (path.startsWith('http')) return path;
  
  switch (type) {
    case 'film':
    case 'serie':
      return `https://image.tmdb.org/t/p/w500${path}`;
    case 'game':
      return path.replace('//images.igdb.com/', 'https://images.igdb.com/').replace('/t_thumb/', '/t_cover_big/');
    default:
      return path;
  }
}

function getGenreName(id: number, type: MediaType): string {
  const movieGenres: { [key: number]: string } = {
    28: 'Action', 12: 'Aventure', 16: 'Animation', 35: 'Comédie',
    80: 'Crime', 99: 'Documentaire', 18: 'Drame', 10751: 'Familial',
    14: 'Fantastique', 36: 'Histoire', 27: 'Horreur', 10402: 'Musique',
    9648: 'Mystère', 10749: 'Romance', 878: 'Science-Fiction',
    10770: 'Téléfilm', 53: 'Thriller', 10752: 'Guerre', 37: 'Western'
  };
  
  return movieGenres[id] || 'Inconnu';
}

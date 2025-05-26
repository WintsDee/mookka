
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
      cover_image: null,
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
    cover_image: media.cover_image,
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
    cover_image: formatImageUrl(item.poster_path || item.backdrop_path || item.cover || item.background_image, type),
    duration: item.runtime ? `${item.runtime} min` : 
              item.episode_run_time?.[0] ? `${item.episode_run_time[0]} min` : null,
    director: item.director || (item.crew?.find((c: any) => c.job === 'Director')?.name) || null,
    author: item.authors?.[0] || item.author || null,
    publisher: item.publisher || null,
    platform: item.platforms?.map((p: any) => p.platform?.name || p.name).join(', ') || null
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
